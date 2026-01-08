'use client';

import { useState, useRef, useEffect } from 'react';
import { updateConfig, addAllowedChannel, removeAllowedChannel, resetLogs } from '../actions';
import {
    Cpu,
    Shield,
    Activity,
    Settings,
    Trash2,
    Plus,
    MessageSquare,
    Terminal,
    Command,
    Zap,
    Server,
    Lock,
    User,
    Bot
} from 'lucide-react';

// Define types locally for now
type Config = any;
type AllowedChannel = any;
type Log = any;

export default function Dashboard({ config, channels, logs }: { config: Config, channels: AllowedChannel[], logs: Log[] }) {
    const [activeTab, setActiveTab] = useState('brain');
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px]" />
            </div>

            <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-50 animate-pulse" />
                            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-lg">
                                <Bot size={18} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight">
                            Neural<span className="text-indigo-400">Admin</span>
                        </h1>
                    </div>

                    <div className="flex p-1 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                        <TabButton
                            active={activeTab === 'brain'}
                            onClick={() => setActiveTab('brain')}
                            icon={<Cpu size={14} />}
                            label="Neural Core"
                        />
                        <TabButton
                            active={activeTab === 'access'}
                            onClick={() => setActiveTab('access')}
                            icon={<Shield size={14} />}
                            label="Security"
                        />
                        <TabButton
                            active={activeTab === 'memory'}
                            onClick={() => setActiveTab('memory')}
                            icon={<Activity size={14} />}
                            label="Live Feed"
                        />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column (Brain & Access) */}
                    <div className="lg:col-span-8 space-y-8">

                        {(activeTab === 'brain' || activeTab === 'all') && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Settings size={20} className="text-indigo-400" />
                                        <h2 className="text-xl font-semibold tracking-tight">Core Configuration</h2>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        Active Model: {config.modelName}
                                    </div>
                                </div>

                                <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
                                    <form action={updateConfig} className="bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 space-y-8">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Zap size={12} /> Provider
                                                </label>
                                                <div className="relative">
                                                    <select name="llmProvider" defaultValue={config.llmProvider} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-white/10 transition-colors appearance-none cursor-pointer">
                                                        <option value="gemini" className="bg-neutral-900">Google Gemini</option>
                                                        <option value="openai" className="bg-neutral-900">OpenAI</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                                        <Command size={14} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Server size={12} /> Model ID
                                                </label>
                                                <input
                                                    type="text"
                                                    name="modelName"
                                                    defaultValue={config.modelName}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-white/10 transition-colors placeholder:text-neutral-600"
                                                    placeholder="e.g. gpt-4-turbo"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                                    <Terminal size={12} /> System Instructions
                                                </label>
                                                <span className="text-[10px] text-neutral-500">Markdown supported</span>
                                            </div>
                                            <div className="relative group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition duration-500 blur" />
                                                <div className="relative">
                                                    <textarea
                                                        name="systemInstructions"
                                                        defaultValue={config.systemInstructions}
                                                        className="w-full h-64 bg-black/60 border border-white/10 rounded-xl px-4 py-4 font-mono text-sm leading-relaxed text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y placeholder:text-neutral-700"
                                                        placeholder="// Enter system prompt here..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-white/5">
                                            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                                                <Lock size={12} /> Secure Credentials
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <InputWithIcon icon={<Zap size={14} />} type="password" name="apiKey" placeholder="LLM API Key" />
                                                <InputWithIcon icon={<MessageSquare size={14} />} type="password" name="discordBotToken" placeholder="Discord Bot Token" />
                                            </div>
                                            <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                                                <Shield size={10} /> Credentials are encrypted at rest using Postgres.
                                            </p>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="group relative px-6 py-2.5 bg-white text-black font-semibold rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
                                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                                                Save Configuration
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        )}

                        {(activeTab === 'access' || activeTab === 'all') && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <Shield size={20} className="text-indigo-400" />
                                    <h2 className="text-xl font-semibold tracking-tight">Access Control</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-3">
                                        {channels.map((channel: any) => (
                                            <div key={channel.id} className="group relative flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                                                        <MessageSquare size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-xs text-indigo-300 mb-0.5">{channel.id}</p>
                                                        <p className="text-sm font-medium text-white">{channel.name || "Unnamed Channel"}</p>
                                                    </div>
                                                </div>
                                                <form action={async () => { await removeAllowedChannel(channel.id) }}>
                                                    <button className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </form>
                                            </div>
                                        ))}
                                        {channels.length === 0 && (
                                            <div className="p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5 text-neutral-500 text-sm">
                                                <Shield size={24} className="mx-auto mb-3 opacity-20" />
                                                No channels authorized. Bot is in silent mode.
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-1">
                                        <div className="p-5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                                <Plus size={14} className="text-indigo-400" /> Authorize Channel
                                            </h3>
                                            <form action={addAllowedChannel} className="space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-neutral-500">Channel ID</label>
                                                    <input name="channelId" placeholder="1234..." required className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-neutral-500">Label (Optional)</label>
                                                    <input name="name" placeholder="#general" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none" />
                                                </div>
                                                <button type="submit" className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/20">
                                                    Add to Allow List
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Live Feed */}
                    <div className="lg:col-span-4 space-y-8">
                        {(activeTab === 'memory' || activeTab === 'all' || activeTab) && (
                            <section className="h-[calc(100vh-8rem)] sticky top-24 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute inset-0 opacity-75" />
                                            <div className="w-2 h-2 bg-green-500 rounded-full relative" />
                                        </div>
                                        <h2 className="text-sm font-semibold tracking-wider uppercase text-neutral-400">Live Neural Feed</h2>
                                    </div>
                                    <form action={resetLogs}>
                                        <button className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/20 transition-colors">CLEAR BUFFER</button>
                                    </form>
                                </div>

                                <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-md relative">
                                    {/* CRT Screen effect overlay could go here */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

                                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        {logs.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-3">
                                                <Activity size={32} className="opacity-20" />
                                                <p className="text-xs font-mono">buffer_empty // waiting for signal</p>
                                            </div>
                                        ) : (
                                            logs.map((log: any) => (
                                                <div key={log.id} className={`flex flex-col ${log.role === 'assistant' ? 'items-start' : 'items-end'}`}>
                                                    <div className={`flex items-end gap-2 max-w-[90%] ${log.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                                                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mb-1 border ${log.role === 'assistant'
                                                                ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400'
                                                                : 'bg-neutral-700/50 border-white/10 text-neutral-400'
                                                            }`}>
                                                            {log.role === 'assistant' ? <Bot size={12} /> : <User size={12} />}
                                                        </div>
                                                        <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm border ${log.role === 'assistant'
                                                                ? 'bg-neutral-900/80 border-white/10 text-neutral-200 rounded-bl-sm'
                                                                : 'bg-indigo-600 text-white border-transparent rounded-br-sm shadow-indigo-900/20'
                                                            }`}>
                                                            <p className="whitespace-pre-wrap leading-relaxed">{log.message}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-neutral-600 mt-1.5 px-9 font-mono opacity-50">
                                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                        <div ref={logsEndRef} />
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

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${active
                    ? 'bg-indigo-500/20 text-indigo-200 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function InputWithIcon({ icon, ...props }: any) {
    return (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-indigo-400 transition-colors">
                {icon}
            </div>
            <input
                {...props}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-white/10 transition-colors placeholder:text-neutral-600 shadow-sm"
            />
        </div>
    );
}
