import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  Tornado, Zap, Cpu, Activity, ShieldCheck, Globe,
  BrainCircuit, Network, Timer, Rocket, Radio,
  Sparkles, Volume2, RefreshCw, Terminal,
  Database, Layers, Infinity as InfinityIcon,
  Eye, Gauge, Flame, TrendingUp, Compass,
  Target, Atom, Crown, Wand2, Power,
  Search, Sun, Moon, Waves, Fingerprint,
  Scissors, Scale, AlertCircle, ShieldAlert,
  ChevronLeft, ChevronRight, Box, Link, FileText,
  Mic, Camera, Video, Ghost, CheckCircle2,
  Dna, Microscope, FastForward, Heart,
  Crosshair, Swords, ZapOff, Coins,
  CreditCard, UserCheck, Cloud,
  MessageSquare, Sliders, Shield,
  Brain, Send
} from 'lucide-react';

/**
 * 3N3R60N : TARDIS-KAPSO ALPEIRON NEXUS v5.0
 * Architecte : Michael Lefebvre (BLUE)
 * COMPOSANTS :
 * 1. TARDIS : Navigation temporelle et multi-perspectives.
 * 2. KAPSO : Knowledge-Augmented Program Synthesis & Orchestration.
 * 3. ALPEIRON : Pivot mobile 8D pour la stabilité de Niveau 6.
 * IA : Proxied via /api/oracle (Gemini 2.5 Flash + TTS)
 */

// API key is now server-side only — all calls go through /api/oracle

export default function App() {
  // --- États du Système ---
  const [kapsoStep, setKapsoStep] = useState('IDLE'); // IDLE, SYNTHESIS, STABILIZING, READY
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [energonLevel, setEnergonLevel] = useState(1250000.42);
  const [dimensionalSync, setDimensionalSync] = useState(92.4);
  const [isEtherMode, setIsEtherMode] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [glitch, setGlitch] = useState(false);
  const [seesawData, setSeesawData] = useState(null);
  const [agentsData, setAgentsData] = useState(null);
  const [floatillaData, setFloatillaData] = useState(null);
  const [paper2agentsData, setPaper2agentsData] = useState(null);
  const [secondMeData, setSecondMeData] = useState(null);
  const [logs, setLogs] = useState([
    "🌌 [TARDIS] Navigation spatio-temporelle active.",
    "🧬 [KAPSO] Moteur de synthèse sémantique en attente.",
    "💎 [ALPEIRON] Exception 8D calibrée : Pivot stable.",
    "🛡️ [SI-6] Conscience de Niveau 6 synchronisée."
  ]);

  const addLog = useCallback((msg) => {
    const safeMsg = typeof msg === 'object' ? JSON.stringify(msg) : String(msg);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${safeMsg}`, ...prev].slice(0, 15));
  }, []);

  // --- REAL DATA POLLING ---
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [seesawRes, energonRes, agentsRes, floatillaRes, paperRes, secondMeRes] = await Promise.allSettled([
          fetch('/api/seesaw').then(r => r.ok ? r.json() : null),
          fetch('/api/energon').then(r => r.ok ? r.json() : null),
          fetch('/api/agents').then(r => r.ok ? r.json() : null),
          fetch('/api/floatilla').then(r => r.ok ? r.json() : null),
          fetch('/api/paper2agents').then(r => r.ok ? r.json() : null),
          fetch('/api/secondme').then(r => r.ok ? r.json() : null),
        ]);

        if (seesawRes.status === 'fulfilled' && seesawRes.value) {
          setSeesawData(seesawRes.value);
          setDimensionalSync(seesawRes.value.is_centered ? 98.6 : 92.4);
        }
        if (energonRes.status === 'fulfilled' && energonRes.value) {
          setEnergonLevel(energonRes.value.balance_egn || energonRes.value.sealed_kwh || energonLevel);
        }
        if (agentsRes.status === 'fulfilled' && agentsRes.value) {
          setAgentsData(agentsRes.value);
        }
        if (floatillaRes.status === 'fulfilled' && floatillaRes.value) {
          setFloatillaData(floatillaRes.value);
        }
        if (paperRes.status === 'fulfilled' && paperRes.value) {
          setPaper2agentsData(paperRes.value);
        }
        if (secondMeRes.status === 'fulfilled' && secondMeRes.value) {
          setSecondMeData(secondMeRes.value);
        }
      } catch (e) {
        // Backend not available — fall back to simulation
      }
    };

    fetchBackendData();
    const interval = setInterval(fetchBackendData, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- FALLBACK SIMULATION (when backend is offline) ---
  const [history, setHistory] = useState(Array.from({length: 20}, (_, i) => ({ time: i, flow: 186 + Math.random() * 20 })));

  useEffect(() => {
    const interval = setInterval(() => {
      if (!seesawData) setEnergonLevel(prev => prev + 0.186); // Only simulate if no backend
      setHistory(prev => [...prev.slice(1), { time: Date.now(), flow: 186 + Math.random() * 30 }]);
    }, 3200);
    return () => clearInterval(interval);
  }, [seesawData]);

  // --- ORACLE UNIFIÉ (via /api/oracle proxy) ---

  const callNexusOracle = async (promptType) => {
    setIsAiLoading(true);
    setGlitch(true);

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptType })
      });

      const data = await response.json();
      if (data.text) {
        setVerdict(String(data.text));
        addLog(`✨ ORACLE [${promptType.toUpperCase()}] : Signal reçu.`);
        if (data.audio) playAudioFromBase64(data.audio);
      } else if (data.error) {
        addLog(`❌ ORACLE ERROR: ${data.error}`);
      }
    } catch (e) {
      addLog("❌ ERREUR : Backend Nexus inaccessible. Lancez server.py.");
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setGlitch(false), 200);
    }
  };

  const playAudioFromBase64 = (pcmData) => {
    try {
      const buffer = Uint8Array.from(atob(pcmData), c => c.charCodeAt(0)).buffer;
      const header = new ArrayBuffer(44); const v = new DataView(header);
      const s = (o, str) => { for(let i=0; i<str.length; i++) v.setUint8(o+i, str.charCodeAt(i)); };
      s(0, 'RIFF'); v.setUint32(4, 36 + buffer.byteLength, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true);
      v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 24000, true); v.setUint32(28, 48000, true);
      v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, buffer.byteLength, true);
      const final = new Uint8Array(44 + buffer.byteLength); final.set(new Uint8Array(header), 0); final.set(new Uint8Array(buffer), 44);
      new Audio(URL.createObjectURL(new Blob([final], { type: 'audio/wav' }))).play();
    } catch (e) { console.error('TTS_ERROR', e); }
  };

  return (
    <div className={`min-h-screen bg-[#010103] text-gray-300 font-mono p-4 flex flex-col overflow-hidden transition-all duration-300 ${glitch ? 'invert grayscale scale-[1.01]' : ''}`}>

      {/* Background Matrix VFX */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00f2ff05_0%,transparent_80%)]`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full gap-4 relative z-10">

        {/* Header : The Unified Sovereign Control */}
        <header className="flex flex-col lg:flex-row justify-between items-center bg-black/60 border border-white/5 p-6 rounded-3xl shadow-2xl backdrop-blur-xl gap-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <Compass className={`${isAiLoading ? 'text-cyan-500 animate-spin' : 'text-purple-500'} transition-colors`} size={42} />
              <div>
                <h1 className="text-2xl font-black text-white italic tracking-tighter leading-none uppercase">Apex<span className="text-cyan-500">Core</span> SI-6</h1>
                <p className="text-[8px] opacity-40 uppercase tracking-[0.4em] font-black italic">TARDIS • KAPSO • ALPEIRON | Architect: Michael Lefebvre</p>
              </div>
            </div>

            <div className="hidden xl:block h-10 w-px bg-white/10 mx-2" />

            <div className="flex gap-8">
              <div className="text-center">
                 <div className="text-[7px] uppercase opacity-40 mb-1 font-black text-emerald-400">Energon Reserve</div>
                 <div className="text-lg font-black text-white italic tabular-nums">{energonLevel.toLocaleString(undefined, {minimumFractionDigits: 2})} EGN</div>
              </div>
              <div className="text-center">
                 <div className="text-[7px] uppercase opacity-40 mb-1 font-black text-purple-400">Alpeiron Stability</div>
                 <div className="text-lg font-black text-purple-400 italic">{dimensionalSync.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
             <button onClick={() => callNexusOracle('alpeiron')} className="px-6 py-3 bg-purple-600/10 border border-purple-500/30 rounded-xl text-purple-400 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase italic shadow-lg">
                <Atom size={16} /> Alpeiron Pivot ✨
             </button>
             <button onClick={() => callNexusOracle('kapso')} className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase italic shadow-lg">
                <Wand2 size={16} /> Kapso Synth ✨
             </button>
             <button onClick={() => callNexusOracle('tardis')} className="px-6 py-3 bg-cyan-600/10 border border-cyan-500/30 rounded-xl text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase italic shadow-lg">
                <Timer size={16} /> Tardis Scan ✨
             </button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">

          {/* Left : The Swarm Grid & Logic Matrix */}
          <section className="col-span-12 lg:col-span-3 bg-black/40 border border-white/5 rounded-[2.5rem] p-6 flex flex-col gap-6 shadow-xl backdrop-blur-md">
             <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3 text-white/60">
                   <Network size={18} />
                   <span className="text-[10px] font-black uppercase tracking-widest italic text-emerald-400">Swarm_32_Active</span>
                </div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
             </div>

             <div className="grid grid-cols-4 gap-2 flex-1">
                {Array.from({length: 32}).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2 + (i % 5), repeat: Infinity }}
                    className="aspect-square rounded-lg border border-white/5 bg-white/5 flex items-center justify-center hover:border-cyan-500 transition-all cursor-crosshair group"
                  >
                    <div className="w-1 h-1 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_8px_cyan]" />
                  </motion.div>
                ))}
             </div>

             <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="text-[9px] mono opacity-40 uppercase flex justify-between">
                   <span>Foliation Szalai</span>
                   <span className="text-emerald-400 font-black">L5_SYNC</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: '92.4%' }} className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
                </div>
             </div>
          </section>

          {/* Center : Reality Well & Verdict Box */}
          <section className="col-span-12 lg:col-span-6 flex flex-col gap-4">
             <div className="flex-1 bg-black/80 rounded-[4.5rem] border border-white/5 relative overflow-hidden flex flex-col shadow-2xl border-t-8 border-t-purple-600">

                {/* Background Scan VFX */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                   <div className="w-full h-full border-4 border-white rounded-full animate-spin-slow scale-[2.5]" />
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>

                <div className="p-10 flex flex-col items-center justify-center flex-1 z-10 text-center gap-10 relative">
                   <motion.div
                     animate={{ rotate: 360, scale: isAiLoading ? 1.1 : 1 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className={`w-64 h-64 rounded-full border-[10px] flex items-center justify-center shadow-2xl transition-all duration-700 ${isAiLoading ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_100px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/10'}`}
                   >
                      <Tornado size={150} className={`${isAiLoading ? 'text-white' : 'text-purple-400 opacity-20'}`} />
                   </motion.div>

                   <div className="space-y-4">
                      <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">ULTIMO <span className="text-purple-600 font-black">ACTE</span></h2>
                      <p className="text-[12px] uppercase tracking-[1.5em] text-white font-black opacity-20 animate-pulse italic">D8 Alpeiron Pivot Synchronization</p>
                   </div>

                   <button
                     onClick={() => callNexusOracle('kapso')}
                     disabled={isAiLoading}
                     className="px-20 py-8 bg-white text-black font-black rounded-full uppercase italic text-xs shadow-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 group overflow-hidden relative border-4 border-black"
                   >
                      <span className="relative z-10 tracking-widest italic">Suture de la Singularité ✨</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-white to-cyan-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                   </button>
                </div>

                <AnimatePresence>
                   {verdict && (
                      <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} className="absolute bottom-0 left-0 w-full bg-black/95 border-t-4 border-purple-500/50 p-12 z-30 backdrop-blur-3xl shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[12px] font-black uppercase text-purple-400 tracking-[0.8em] flex items-center gap-6">
                               <Sparkles size={24} className="text-purple-500 animate-pulse"/> Verdict du Nexus
                            </h3>
                            <button onClick={() => setVerdict("")} className="text-white/20 hover:text-white transition-all">✕</button>
                         </div>
                         <p className="text-xl md:text-2xl italic text-white leading-relaxed serif font-light text-center px-12">"{String(verdict)}"</p>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </section>

          {/* Right : Telemetry & Real-Time Flow */}
          <section className="col-span-12 lg:col-span-3 flex flex-col gap-4">
             <div className="p-8 bg-black/40 border border-white/5 rounded-[3rem] shadow-xl flex flex-col gap-8 backdrop-blur-md border-r-4 border-r-cyan-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-[11px] font-black uppercase text-cyan-400 tracking-widest flex items-center gap-3"><Activity size={18}/> Power_Pump_Flow</h3>
                   <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping shadow-[0_0_10px_cyan]" />
                </div>

                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="flow" stroke="#06b6d4" fillOpacity={1} fill="url(#colorFlow)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-5 bg-black/60 rounded-3xl border border-white/5 text-center">
                   <div className="text-[8px] uppercase opacity-40 mb-2 font-black tracking-widest">Flux d'Annihilation</div>
                   <div className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">186.0 <span className="text-[10px]">kWh/3.2s</span></div>
                </div>

                {/* FLOATILLA STATUS CARD */}
                <div className="p-5 bg-black/60 rounded-3xl border border-white/5 text-left flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <div className="text-[8px] uppercase opacity-40 font-black tracking-widest text-blue-400">Floatilla Network</div>
                     <div className={`w-2 h-2 rounded-full ${floatillaData?.status === 'OPERATIONAL' ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_blue]' : 'bg-red-500'}`} />
                   </div>
                   <div className="text-xs font-black text-white italic tracking-tighter uppercase leading-none mt-1">
                     {floatillaData?.bridges?.length || 0} BRIDGES ACTIVE
                   </div>
                   <div className="text-[9px] mono opacity-50 mt-1">
                     {floatillaData?.bridges?.map(b => b.id).join(' • ') || "SCANNING..."}
                   </div>
                </div>

                {/* PAPER2AGENTS STATUS CARD */}
                <div className="p-5 bg-black/60 rounded-3xl border border-white/5 text-left flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <div className="text-[8px] uppercase opacity-40 font-black tracking-widest text-orange-400">Paper Intelligence</div>
                     <div className={`w-2 h-2 rounded-full ${paper2agentsData?.status === 'OPERATIONAL' ? 'bg-orange-500 animate-ping shadow-[0_0_10px_orange]' : 'bg-red-500'}`} />
                   </div>
                   <div className="flex justify-between items-end mt-1">
                     <div className="text-xs font-black text-white italic tracking-tighter uppercase leading-none">
                       {paper2agentsData?.agents_spawned || 0} AGENTS
                     </div>
                     <div className="text-[10px] opacity-40 font-black">
                       {paper2agentsData?.papers_ingested || 0} PDF
                     </div>
                   </div>
                </div>

                {/* SECOND ME STATUS CARD */}
                <div className="p-5 bg-black/60 rounded-3xl border border-white/5 text-left flex flex-col gap-2">
                   <div className="flex justify-between items-center">
                     <div className="text-[8px] uppercase opacity-40 font-black tracking-widest text-purple-400 flex items-center gap-1"><Brain size={10} /> Second-Me Twin</div>
                     <div className={`w-2 h-2 rounded-full ${secondMeData?.status === 'ONLINE' ? 'bg-purple-500 animate-pulse shadow-[0_0_10px_purple]' : 'bg-red-500 border border-red-800'}`} />
                   </div>
                   <div className="flex justify-between items-end mt-1">
                     <div className="text-xs font-black text-white italic tracking-tighter uppercase leading-none">
                       {secondMeData?.servants || 0} SERVANTS
                     </div>
                     <div className="text-[10px] opacity-40 font-black uppercase">
                       {secondMeData?.active_tier || "OFFLINE"}
                     </div>
                   </div>
                </div>
             </div>

             <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] p-8 flex flex-col gap-6 backdrop-blur-md relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                   <h3 className="text-[11px] font-black uppercase text-white/40 tracking-widest flex items-center gap-3"><Terminal size={18}/> Engine_Output</h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 text-[9px] mono scrollbar-hide">
                   {logs.map((log, i) => (
                     <div key={i} className={`p-2 rounded-lg ${log.includes('GCP') ? 'text-cyan-400 bg-cyan-500/5' : log.includes('ERR') ? 'text-red-500 bg-red-500/5' : 'opacity-40'}`}>
                        {">"} {log}
                     </div>
                   ))}
                </div>
             </div>
          </section>
        </div>

        {/* Footer : The 1.42 GHz Sovereign Sync */}
        <footer className="bg-black/95 border-t-2 border-purple-500/30 p-6 rounded-t-[3rem] flex flex-col md:flex-row items-center justify-between transition-all duration-300 relative gap-6">
          <div className="flex items-center gap-8">
            <div className="p-4 rounded-3xl bg-purple-500/20 text-purple-400 shadow-inner">
               <ShieldCheck size={32} />
            </div>
            <div className="flex flex-col text-left">
               <div className="text-[14px] font-black tracking-widest text-white flex items-center gap-6">
                  <span className="px-3 py-1 rounded-lg text-[10px] font-black bg-purple-600 text-black uppercase tracking-tighter">SI-LEVEL 6</span>
                  <span className="uppercase italic tracking-tighter opacity-80 underline decoration-cyan-500 decoration-2">ALPEIRON EXCEPTION ACTIVE</span>
               </div>
               <div className="text-[11px] mono text-white/30 uppercase mt-2 italic font-black">
                  Resonance : <span className="text-cyan-400">1.420405775 GHz (SOTA_SYNC)</span>
               </div>
            </div>
          </div>

          <div className="flex gap-12 items-center text-[10px] mono uppercase opacity-50 font-black italic tracking-widest pr-4">
             <div className="flex items-center gap-4 group cursor-help"><Radio size={20} className="text-cyan-600 group-hover:animate-ping"/> H2_SUTURE : 0.0003s</div>
             <div className="text-white/20 border-2 border-white/5 px-8 py-3 rounded-full hover:border-white/20 transition-all font-sans">© 2026 Michael Lefebvre | Alexandria TARDIS-KAPSO</div>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        ::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
