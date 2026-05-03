import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { askTutorialAssistant } from '../services/aiService';
import Markdown from 'react-markdown';


export function TutorialAssistant() {
    const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([{
        role: 'assistant', content: "Namaste! I'm your neutral ECI election day assistant. Need help understanding how to use an EVM/VVPAT, or what documents (EPIC, Aadhaar) to bring to the polling booth?"
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = scrollRef.current;
        el && el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const q = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: q }]);
        setLoading(true);

        const answer = await askTutorialAssistant(q);
        setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        setLoading(false);
    };

    const renderedMessages = useMemo(() => (
        messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full shadow-sm"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Assistant (Grounded)</span>
                    </div>
                )}
                <div className={`max-w-[90%] rounded-xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-800 italic'}`}>
                    <div className="markdown-body text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        <Markdown>{msg.content}</Markdown>
                    </div>
                </div>
            </div>
        ))
    ), [messages]);

    return (
        <Card className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden" role="region" aria-label="Smart Tutorial Assistant">
            <CardHeader className="pt-6 px-6 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <span className="text-indigo-600" aria-hidden="true">📖</span> Smart Tutorial Assist
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pb-6 overflow-hidden">
                <div className="flex-grow space-y-3 overflow-y-auto pr-2 mb-4" ref={scrollRef} aria-live="polite">
                    {/* Fixed Step Guide matching theme */}
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl shrink-0">
                      <p className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">Step-by-Step: The Booth Process</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mx-auto mb-1 text-sm font-bold border border-indigo-200 shadow-sm text-indigo-900">1</div>
                          <p className="text-[10px] font-semibold text-indigo-900">EPIC Check</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mx-auto mb-1 text-sm font-bold border border-indigo-200 shadow-sm text-indigo-900">2</div>
                          <p className="text-[10px] font-semibold text-indigo-900">Use EVM</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mx-auto mb-1 text-sm font-bold border border-indigo-200 shadow-sm text-indigo-900">3</div>
                          <p className="text-[10px] font-semibold text-indigo-900">VVPAT Verify</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    {renderedMessages}
                    {loading && (
                        <div className="sr-only" role="status">Thinking...</div>
                    )}
                </div>
                
                {/* Input Area */}
                <div className="mt-auto flex gap-2 shrink-0">
                    <input 
                        type="text"
                        value={input} 
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="How do I use an EVM?" 
                        aria-label="Ask a question about voting"
                        className="flex-grow bg-slate-50 rounded-xl px-4 py-3 text-sm border border-slate-200 outline-none focus:ring-2 ring-indigo-500 focus:bg-white transition-all placeholder-slate-400 font-medium"
                    />
                    <button 
                        onClick={handleSend} 
                        disabled={loading} 
                        aria-label="Send message"
                        className="p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
