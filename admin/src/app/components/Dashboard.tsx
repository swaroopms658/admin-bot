'use client';

import { useState } from 'react';
import { updateConfig, addAllowedChannel, removeAllowedChannel, resetLogs } from '../actions';

// Define types locally for now or import from prisma client if available
// but better to just use inferred types or 'any' for speed until generation finishes
type Config = any;
type AllowedChannel = any;
type Log = any;

export default function Dashboard({ config, channels, logs }: { config: Config, channels: AllowedChannel[], logs: Log[] }) {
    const [activeTab, setActiveTab] = useState('brain');

    return (
        <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-purple-500 selection:text-white">
            <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Agent Command Center
                        </h1>
                    </div>
                    <div className="flex gap-4 text-sm font-medium text-neutral-400">
                        <button
                            onClick={() => setActiveTab('brain')}
                            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'brain' ? 'bg-white/10 text-white' : 'hover:text-white'}`}
                        >
                            Brain & Config
                        </button>
                        <button
                            onClick={() => setActiveTab('access')}
                            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'access' ? 'bg-white/10 text-white' : 'hover:text-white'}`}
                        >
                            Access Control
                        </button>
                        <button
                            onClick={() => setActiveTab('memory')}
                            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'memory' ? 'bg-white/10 text-white' : 'hover:text-white'}`}
                        >
                            Memory
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Main Content Area */}
                    <div className="md:col-span-12 lg:col-span-8 space-y-8">

                        {/* Brain Section */}
                        {(activeTab === 'brain' || activeTab === 'all') && (
                            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-200">System Instructions</h2>
                                    <span className="text-xs font-mono text-neutral-500">model: {config.modelName}</span>
                                </div>
                                <div className="p-1 rounded-xl bg-gradient-to-b from-white/10 to-transparent">
                                    <form action={updateConfig} className="bg-neutral-900 rounded-lg p-6 border border-white/5 shadow-2xl">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Provider</label>
                                                    <select name="llmProvider" defaultValue={config.llmProvider} className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                                                        <option value="gemini">Google Gemini</option>
                                                        <option value="openai">OpenAI</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Model Name</label>
                                                    <input type="text" name="modelName" defaultValue={config.modelName} className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">System Prompt (The Brain)</label>
                                                <textarea
                                                    name="systemInstructions"
                                                    defaultValue={config.systemInstructions}
                                                    className="w-full h-64 bg-neutral-950 border border-neutral-800 rounded-md px-4 py-3 font-mono text-sm leading-relaxed text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                                    placeholder="You are a helpful AI..."
                                                />
                                            </div>

                                            <div className="space-y-2 pt-4 border-t border-white/5">
                                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Credentials (Sensitive)</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="password" name="apiKey" placeholder="LLM API Key (Update)" className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                                    <input type="password" name="discordBotToken" placeholder="Discord Bot Token (Update)" className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-md transition-colors shadow-lg shadow-purple-900/20">
                                                    Save Configuration
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        )}

                        {/* Access Control */}
                        {(activeTab === 'access' || activeTab === 'all') && (
                            <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-semibold tracking-tight text-neutral-200">Access Control</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        {channels.map((channel: any) => (
                                            <div key={channel.id} className="group flex items-center justify-between p-4 bg-neutral-800/50 border border-white/5 rounded-lg hover:border-purple-500/30 transition-all">
                                                <div>
                                                    <p className="font-mono text-sm text-purple-400">{channel.id}</p>
                                                    <p className="text-xs text-neutral-500">{channel.name || "Unnamed Channel"}</p>
                                                </div>
                                                <form action={async () => { await removeAllowedChannel(channel.id) }}>
                                                    <button className="p-2 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                </form>
                                            </div>
                                        ))}
                                        {channels.length === 0 && (
                                            <div className="p-8 text-center border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-sm">
                                                No channels allowed yet. The bot will not reply to anyone.
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-1">
                                        <div className="p-4 bg-neutral-900 border border-white/5 rounded-lg">
                                            <h3 className="text-sm font-medium text-neutral-300 mb-4">Add Channel</h3>
                                            <form action={addAllowedChannel} className="space-y-3">
                                                <input name="channelId" placeholder="Channel ID" required className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm text-white" />
                                                <input name="name" placeholder="Channel Name (Optional)" className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm text-white" />
                                                <button type="submit" className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded transition-colors">
                                                    Authorize
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Sidebar - Memory */}
                    <div className="md:col-span-12 lg:col-span-4 space-y-8">
                        {(activeTab === 'memory' || activeTab === 'all' || activeTab) && (
                            <section className="h-[calc(100vh-8rem)] sticky top-24 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-neutral-200">Live Memory</h2>
                                    <form action={resetLogs}>
                                        <button className="text-xs text-red-500 hover:text-red-400 underline decoration-red-500/30">Reset Session</button>
                                    </form>
                                </div>
                                <div className="flex-1 bg-black/40 border border-white/5 rounded-xl overflow-hidden flex flex-col">
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
                                        {logs.length === 0 ? (
                                            <div className="text-center text-neutral-600 text-sm py-10">Usage logs will appear here.</div>
                                        ) : (
                                            logs.map((log: any) => (
                                                <div key={log.id} className={`flex flex-col ${log.role === 'assistant' ? 'items-start' : 'items-end'}`}>
                                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${log.role === 'assistant'
                                                            ? 'bg-neutral-800 text-neutral-200 rounded-tl-none'
                                                            : 'bg-purple-900/40 text-purple-100 rounded-tr-none'
                                                        }`}>
                                                        <p className="whitespace-pre-wrap">{log.message}</p>
                                                    </div>
                                                    <span className="text-[10px] text-neutral-600 mt-1 px-1">{log.role} • {new Date(log.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
