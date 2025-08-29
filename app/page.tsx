'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

// Shape of the response returned by the Blink API
type Result = {
  verdict: 'YES' | 'NO' | 'BASED';
  title: string;
  reasoning: string;
  disclaimer: string;
};

export default function Home() {
  // User input text
  const [text, setText] = useState('');
  // Loading state while awaiting response
  const [loading, setLoading] = useState(false);
  // Result returned from the API
  const [result, setResult] = useState<Result | null>(null);
  // Ref used for screenshotting the result card
  const cardRef = useRef<HTMLDivElement>(null);

  // Call the Blink API and update local state
  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/blink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult({ verdict: 'NO', title: 'Error', reasoning: 'Something went wrong.', disclaimer: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Copy only the verdict to clipboard
  const copyVerdict = () => {
    if (result) navigator.clipboard.writeText(result.verdict);
  };

  // Copy the full result to clipboard
  const copyFull = () => {
    if (result) navigator.clipboard.writeText(`${result.verdict}: ${result.title}\n${result.reasoning}`);
  };

  // Save a screenshot of the result card
  const screenshot = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement('a');
    link.download = 'blink.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const verdictStyles: Record<string, string> = {
    YES: 'bg-neon-pink glow-neon-pink',
    NO: 'bg-neon-blue glow-neon-blue',
    BASED: 'bg-neon-orange glow-neon-orange'
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="py-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="logo" className="h-10 w-10" />
          <span className="text-3xl font-bold glow-neon-pink">Blink.ai</span>
        </div>
      </header>

      <main className="flex flex-col items-center px-4 flex-1 w-full">
        <section className="max-w-xl w-full text-center space-y-4">
          <h1 className="text-2xl font-bold">Life gets messy. Blink tells you the truth.</h1>
          <p className="text-lg text-gray-300">Type your situation. Get a brutally honest verdict—no sugarcoating.</p>
          <textarea
            className="w-full h-32 p-4 rounded-xl bg-black/40 border border-white/20 focus:border-neon-pink outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Confess your situation..."
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 px-6 py-3 rounded-xl border border-neon-blue glow-neon-blue hover:glow-neon-pink transition"
          >
            {loading ? 'Thinking...' : 'Tell me the truth'}
          </button>
        </section>

        {result && (
          <div ref={cardRef} className="mt-8 w-full max-w-xl p-6 rounded-xl bg-black/40 border border-white/10 text-left space-y-4">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold text-black ${verdictStyles[result.verdict]}`}>{result.verdict}</div>
            <h3 className="text-xl font-bold">{result.title}</h3>
            <p className="text-gray-300">{result.reasoning}</p>
            <p className="text-xs text-gray-500">{result.disclaimer}</p>
            <div className="flex gap-2 pt-2">
              <button onClick={copyVerdict} className="px-3 py-1 rounded-xl border border-neon-yellow glow-neon-yellow hover:glow-neon-pink text-sm">Copy verdict</button>
              <button onClick={copyFull} className="px-3 py-1 rounded-xl border border-neon-yellow glow-neon-yellow hover:glow-neon-pink text-sm">Copy result</button>
              <button onClick={screenshot} className="px-3 py-1 rounded-xl border border-neon-yellow glow-neon-yellow hover:glow-neon-pink text-sm">Screenshot</button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-xs text-gray-400">
        <p>Results are for entertainment only. © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
