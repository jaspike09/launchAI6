'use client';
import { useState, useEffect } from 'react';

export default function LaunchApp() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const runMeeting = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ prompt: input }) });
      const result = await res.json();
      setData(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            LAUNCH AI: WAR ROOM
          </h1>
          <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest">Agentic Board of Directors v1.0</p>
        </header>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl">
            <textarea 
              className="w-full bg-transparent p-4 h-40 outline-none resize-none text-lg"
              placeholder="Paste your business concept or side hustle idea here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              onClick={runMeeting}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-bold uppercase tracking-tight hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? "Board is deliberating..." : "Execute Architect Plan"}
            </button>
          </div>

          {data && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-2xl mb-6">
                <h2 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  ARCHITECT'S BLUEPRINT
                </h2>
                <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed">
                  {data.architect}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.board.map((member: any) => (
                  <div key={member.name} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                    <h3 className="text-emerald-400 text-xs font-bold uppercase mb-2">{member.name}</h3>
                    <p className="text-zinc-400 text-sm leading-snug">{member.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
