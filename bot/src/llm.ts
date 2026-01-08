
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { Config } from './db.js';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function generateResponse(
    conversationHistory: Message[],
    config: Config
): Promise<string> {
    const { llmProvider, apiKey, modelName, systemInstructions } = config;

    if (!apiKey) {
        return "Error: No API Key configured. Please visit the Admin Console to set it.";
    }

    try {
        if (llmProvider === 'gemini') {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName || 'gemini-pro' });

            // Convert history to Gemini format (user/model)
            // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
            // But we also need to inject system instructions. Gemini has "systemInstruction" param in newer API, 
            // or we can prepend to history.

            const historyForGemini = conversationHistory
                .filter(msg => msg.role !== 'system')
                .map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                }));

            // Gemini Reqs: History must start with User.
            // If previous history ended with an error or was truncated, we might start with 'model'.
            // Shift until we find a user message.
            while (historyForGemini.length > 0 && historyForGemini[0].role === 'model') {
                historyForGemini.shift();
            }

            // Also check if we have any history left.
            // If historyForGemini is empty, startChat works fine (empty history).

            // We need to extract the current message to send
            const lastMsg = historyForGemini.pop();

            // Sanity check: The last message MUST be from User (the one we just received).
            if (!lastMsg || lastMsg.role !== 'user') {
                // Even if it was 'model' (which shouldn't happen if we just added it), 
                // we cannot send a 'model' message as a prompt.
                // Fallback: Just return generic error or try to run with what we have?
                // Most robust: If no user message to send, we can't generate.
                // But wait, the trigger was a user message.
                return "Error: Could not identify user message in context.";
            }

            // Re-sanitize history after popping? 
            // If we popped the user message, the new 'last' might be 'model' (Good) or 'user' (Bad - consecutive users).
            // Gemini is sometimes strict about consecutive turns.
            // Let's rely on basic "Start with User" rule first.
            while (historyForGemini.length > 0 && historyForGemini[0].role === 'model') {
                historyForGemini.shift();
            }

            // Inject system instruction if supported or prepend
            const chatWithHistory = model.startChat({
                history: historyForGemini,
                // systemInstruction: systemInstructions 
            });

            // Prepend system instruction to the first message? Or use specific API.
            // Easiest: Prepend a system message as "user" saying "System Instructions: ..."
            // But we can just rely on the context.
            // Let's prepend it to the effective prompt or use the new systemInstruction property if available.
            // For broad compatibility, I'll assume we can't rely on beta features.
            // I'll add "System Instructions: ..." to the history as the first turn (User) -> OK (Model).

            const result = await chatWithHistory.sendMessage(`${systemInstructions}\n\nUser Message: ${lastMsg.parts[0].text}`);
            return result.response.text();

        } else if (llmProvider === 'openai') {
            const openai = new OpenAI({ apiKey });

            const response = await openai.chat.completions.create({
                model: modelName || 'gpt-4o',
                messages: [
                    { role: 'system', content: systemInstructions },
                    ...conversationHistory.map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content }))
                ],
            });

            return response.choices[0].message.content || "No response generated.";
        }

        return "Error: Unknown Provider configured.";

    } catch (error: any) {
        console.error("LLM Error:", error);
        return `Error generating response: ${error.message}`;
    }
}
