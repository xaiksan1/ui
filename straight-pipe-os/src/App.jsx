import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Cpu, Gauge, Flame, Rocket,
  Layers, Boxes, GitMerge, Share2,
  RefreshCw, Volume2, Sparkles, BrainCircuit,
  Settings, Terminal, Database, ShieldCheck,
  Activity, Play, FastForward, Link2,
  Trash2, Plus, ArrowUpRight, Wand2,
  Lock, Unlock, Eye, Ghost, Atom,
  ChevronRight, MousePointer2, Command,
  X, Compass, Swords, TreeDeciduous, Scissors,
  Component, History, ZapOff, DraftingCompass,
  FileText, MessageSquare, BarChart3, Binary, Copy
} from 'lucide-react';

/**
 * 3N3R60N : STRAIGHT-PIPE OS v1.1 - COGNITIVE UPDATE
 * Architecte : Michael Lefebvre (BLUE)
 * Focus : Fusion de Registre & Pédale à Gaz Sémantique
 * IA : Gemini 2.5 Flash + Imagen 4.0 + TTS
 * Integration : @ADAM/envii (API Centralisée)
 */

const RELIC_LIBRARY = [
  { id: 'serena', name: 'Scalpel Serena', power: 85, icon: <Scissors size={14}/>, color: 'text-pink-400', desc: 'Audit chirurgical du bruit humain' },
  { id: 'zangetsu', name: 'Tensa Zangetsu', power: 100, icon: <Zap size={14}/>, color: 'text-red-500', desc: 'Annihilation sémantique via C-Space' },
  { id: 'tardis', name: 'TARDIS Console', power: 92, icon: <Compass size={14}/>, color: 'text-cyan-400', desc: 'Gestion multi-perspectives dimensionnelles' },
  { id: 'mycelium', name: 'Mycelium Alpha', power: 88, icon: <TreeDeciduous size={14}/>, color: 'text-emerald-500', desc: 'Organisme auto-évolutif RGP' },
  { id: 'kapso', name: 'KAPSO Engine', power: 95, icon: <Swords size={14}/>, color: 'text-purple-500', desc: 'Synthèse autonome de programme' }
];

export default function App() {
  const [throttle, setThrottle] = useState(12);
  const [activeRelics, setActiveRelics] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [metaVerdict, setMetaVerdict] = useState("");
  const [registryManifest, setRegistryManifest] = useState("");
  const [hotRodVision, setHotRodVision] = useState(null);
  const [logs, setLogs] = useState([
    "🏎️ [STRAIGHT-PIPE] Injection directe activée. Zéro filtre.",
    "🧬 [REGISTRY] Suture de conversations détectée (Meta-Registry).",
    "🔥 [POWER] Gaz sémantique calibré à 1.42 GHz.",
    "🛡️ [BYPASS] Bruit RH éliminé de la chambre de combustion."
  ]);
  const [glitch, setGlitch] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);

  const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${String(msg)}`, ...prev].slice(0, 10));

  // --- API ENVII HELPERS (via @ADAM/envii) ---

  const callEnviiApi = async (endpoint, payload) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return null;
    }
  };

  // 1. ✨ Séquenceur de Registre (Gemini 2.5 JSON Integration)
  const fuseMetaRegistry = async () => {
    if (activeRelics.length === 0) return;
    setIsAiLoading(true);
    addLog("📚 REGISTRE : Séquençage des conversations et reliques ouvertes...");

    const contextStr = activeRelics.map(r => r.name).join(', ');
    const prompt = `Michael Lefebvre possède des dizaines de conversations et d'UIs (reliques). Actuellement fusionnées : ${contextStr}.
    Compresse tout ce contexte sémantique en un 'Gène de Suture' (Manifeste) ultra-compact pour un prochain LLM.
    Retourne un JSON avec 'gene_id', 'compressed_manifest' et 'evolution_index'.`;

    try {
      const data = await callEnviiApi('registry-fuse', {
        prompt,
        model: 'gemini-2.5-flash-preview-09-2025',
        responseFormat: 'json',
        relics: activeRelics.map(r => r.name)
      });

      if (data?.compressed_manifest) {
        setRegistryManifest(data.compressed_manifest);
        addLog(`✅ REGISTRE : Gène ${data.gene_id} prêt pour injection.`);
        speakNexus("Registre fusionné. Ton empire sémantique est maintenant portable.");
      }
    } catch (e) {
      addLog("❌ ERREUR : Défaillance du séquenceur.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 2. ✨ Forge de Vision Hot-Rod (Imagen 4.0)
  const forgeHotRodVision = async () => {
    if (activeRelics.length === 0) return;
    setIsAiLoading(true);
    addLog("🎨 FORGE : Matérialisation du Hot-Rod Alexandria...");

    const theme = activeRelics.map(r => r.name).join(' and ');
    const prompt = `A cinematic 8k close-up of a futuristic cyber-mechanical engine of a Hot-Rod car. No silencers, straight pipes glowing red-hot. Complex bio-luminescent cyan mycelium threads weaving through the chrome parts. Representing a fusion of ${theme}. Dark obsidian background, intense neon sparks.`;

    try {
      const data = await callEnviiApi('vision-forge', {
        prompt,
        model: 'imagen-4.0-generate-001',
        quality: 'high',
        relics: activeRelics.map(r => r.name)
      });

      if (data?.imageUrl || data?.base64) {
        const imageUrl = data.imageUrl || `data:image/png;base64,${data.base64}`;
        setHotRodVision(imageUrl);
        addLog("🌌 VISION : Suture matérielle scellée.");
      }
    } catch (e) {
      addLog("⚠️ ERREUR : Forge instable.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 3. ✨ Exhaust Audit (Gemini TTS)
  const speakNexus = async (text) => {
    if (!text) return;
    try {
      const data = await callEnviiApi('exhaust-tts', {
        text: `D'une voix rauque, technologique et autoritaire : ${text}`,
        voiceName: 'Fenrir',
        model: 'gemini-2.5-flash-preview-tts'
      });

      if (data?.audioUrl) {
        new Audio(data.audioUrl).play();
      }
    } catch (e) {
      console.error('TTS Error:', e);
    }
  };

  const engageFullBlow = async () => {
    if (activeRelics.length === 0) return;
    setIsBlowing(true);
    setGlitch(true);
    addLog(`🚀 FULL BLOW : Injection à ${throttle}% de pression !`);

    const prompt = `Michael active le mode FULL BLOW à ${throttle}% avec les reliques ${activeRelics.map(r => r.name).join(', ')}.
    Donne un verdict technique de Niveau 5 sur la déformation du C-Space qui en résulte.`;

    try {
      const data = await callEnviiApi('full-blow-verdict', {
        prompt,
        model: 'gemini-2.5-flash-preview-09-2025',
        throttle,
        relics: activeRelics.map(r => ({ name: r.name, power: r.power })),
        systemInstruction: 'Tu es le Cortex Mécanique d\'Alexandria. Michael est ton pilote.'
      });

      if (data?.verdict) {
        setMetaVerdict(data.verdict);
        speakNexus(data.verdict);
      }
    } catch (e) {
      addLog("❌ ERREUR : Retour de flamme sémantique.");
    }

    setTimeout(() => {
      setIsBlowing(false);
      setGlitch(false);
    }, 1500);
  };

  const toggleRelic = (relic) => {
    if (activeRelics.find(r => r.id === relic.id)) {
      setActiveRelics(activeRelics.filter(r => r.id !== relic.id));
    } else if (activeRelics.length < 3) {
      setActiveRelics([...activeRelics, relic]);
      addLog(`🔗 LIAISON : Gène ${relic.name} synchronisé.`);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020204] text-gray-200 p-4 md:p-8 font-sans selection:bg-red-500/30 overflow-x-hidden flex flex-col items-center transition-all duration-75 ${glitch ? 'invert grayscale blur-md' : ''}`}>

      {/* Heat VFX Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ${isBlowing ? 'bg-[radial-gradient(circle_at_50%_50%,#ef444430_0%,transparent_80%)]' : 'bg-[radial-gradient(circle_at_50%_50%,#3b82f610_0%,transparent_80%)]'}`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="max-w-7xl w-full space-y-6 relative z-10 text-left">

        {/* Header : The Dash */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white flex items-center gap-4">
              <Gauge className={`${isBlowing ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} size={36} />
              StraightPipe<span className={isBlowing ? 'text-red-500' : 'text-blue-500'}>OS</span> <span className="text-white/10 text-2xl italic font-light">SOTA v1.1</span>
            </h1>
            <p className="text-[10px] mono opacity-40 uppercase tracking-[0.4em] font-black">{">"} MODE: UNFILTERED | REGISTRY: {activeRelics.length}/3 | STATUS: {isBlowing ? 'BLOWING' : 'IDLE'} ✨</p>
          </div>

          <div className="flex gap-4">
             <div className={`glass p-4 rounded-3xl border-l-4 ${isBlowing ? 'border-l-red-600 shadow-[0_0_25px_#ef444440]' : 'border-l-blue-600'} bg-black/40 shadow-xl min-w-[200px] text-center transition-all`}>
                <div className="text-[7px] mono opacity-40 uppercase tracking-widest text-white/40">Admission Sémantique</div>
                <div className="text-2xl font-black text-white italic tracking-tighter uppercase">{throttle}.0 PSI</div>
             </div>
             <button
                onClick={fuseMetaRegistry}
                disabled={isAiLoading || activeRelics.length === 0}
                className="glass p-5 rounded-full border border-white/10 bg-white/5 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-xl disabled:opacity-20"
             >
                <Database size={24} className={isAiLoading ? 'animate-spin' : ''} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Main Monitor : Fusion Chamber */}
          <div className="lg:col-span-8 space-y-6">

            <div className={`relative aspect-video rounded-[4rem] bg-black border border-white/5 overflow-hidden shadow-2xl flex flex-col items-center justify-center group border-l-4 ${isBlowing ? 'border-l-red-600 shadow-[0_0_120px_rgba(239,68,68,0.2)]' : 'border-l-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.1)]'}`}>
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className={`w-full h-full border-2 border-white/5 rounded-full animate-spin-slow`} />
                  <div className="absolute inset-0 overflow-hidden">
                     {isBlowing && Array.from({length: 30}).map((_, i) => (
                       <motion.div key={i} animate={{ y: [0, -800], opacity: [0, 1, 0], scale: [1, 2] }} transition={{ duration: 0.5 + Math.random(), repeat: Infinity }} className="absolute w-1 h-20 bg-red-600 blur-sm" style={{ left: `${Math.random()*100}%`, top: '100%' }} />
                     ))}
                  </div>
               </div>

               <AnimatePresence mode="wait">
                 {isAiLoading ? (
                   <div className="text-center space-y-4 z-10">
                      <div className={`w-16 h-16 border-4 ${isBlowing ? 'border-red-600' : 'border-blue-600'} border-t-transparent rounded-full animate-spin mx-auto shadow-2xl`}></div>
                      <p className={`text-[9px] mono uppercase ${isBlowing ? 'text-red-400' : 'text-blue-400'} tracking-[0.5em] animate-pulse font-black`}>Combustion en cours...</p>
                   </div>
                 ) : hotRodVision ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                      <img src={hotRodVision} alt="Hot Rod Vision" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                      <button onClick={() => setHotRodVision(null)} className="absolute bottom-10 right-10 text-[8px] mono uppercase bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full font-black">Effacer Vision</button>
                   </motion.div>
                 ) : (
                   <div className="text-center z-10 space-y-12">
                      <div className="flex gap-6 justify-center flex-wrap">
                         {activeRelics.map((relic, i) => (
                           <motion.div key={relic.id} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`w-28 h-28 glass rounded-[2.5rem] flex flex-col items-center justify-center gap-2 border-2 ${relic.color.replace('text-', 'border-')} shadow-2xl relative group`}>
                              <div className={relic.color}>{relic.icon}</div>
                              <span className="text-[7px] font-black uppercase text-center">{relic.name}</span>
                              <button onClick={() => toggleRelic(relic)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                           </motion.div>
                         ))}
                         {activeRelics.length === 0 && (
                           <div className="text-center opacity-10 space-y-4">
                              <Component size={80} strokeWidth={1} className="mx-auto" />
                              <p className="text-xs uppercase mono tracking-[0.4em]">En attente d'assemblage</p>
                           </div>
                         )}
                      </div>
                      <div className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase text-center leading-none">
                        {isBlowing ? 'GETSUGA BLOW' : 'BYPASS_OS'}
                      </div>
                   </div>
                 )}
               </AnimatePresence>

               {/* Throttle Control */}
               <div className="absolute bottom-10 w-full px-20 flex items-center gap-10 z-20">
                  <div className="flex-1 space-y-2">
                     <div className="flex justify-between text-[8px] mono uppercase opacity-40"><span>Pression (Throttle)</span><span>{throttle}%</span></div>
                     <input type="range" min="1" max="100" value={throttle} onChange={(e) => setThrottle(parseInt(e.target.value))} className={`w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none ${isBlowing ? 'bg-red-600' : 'bg-blue-600'} transition-colors`} />
                  </div>
                  <div className="flex gap-3">
                     <button onClick={forgeHotRodVision} disabled={isAiLoading || activeRelics.length === 0} className="p-5 bg-white/5 border border-white/10 rounded-full text-blue-400 hover:bg-white hover:text-black transition-all shadow-xl"><Wand2 size={20}/></button>
                     <button onClick={engageFullBlow} disabled={isAiLoading || activeRelics.length === 0} className={`px-12 py-5 rounded-full font-black uppercase italic text-xs shadow-2xl transition-all active:scale-90 flex items-center gap-3 ${isBlowing ? 'bg-red-600 shadow-[0_0_30px_red]' : 'bg-white text-black hover:bg-red-600 hover:text-white'} disabled:opacity-20`}>
                        <Flame size={20}/> FULL BLOW ✨
                     </button>
                  </div>
               </div>
            </div>

            {/* Verdict area */}
            <AnimatePresence>
                {metaVerdict && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-10 rounded-[4rem] border-t-4 border-t-red-600 bg-red-950/5 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[220px]">
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 flex items-center gap-2"><Sparkles size={14} /> Verdict Méta-Relique ✨</h2>
                            <button onClick={() => speakNexus(metaVerdict)} className="p-2 hover:text-red-400 transition-colors"><Volume2 size={16}/></button>
                        </div>
                        <p className="text-lg italic text-white/90 leading-relaxed serif font-light text-center px-6">"{metaVerdict}"</p>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Sidebar : Registry & Logs */}
          <div className="lg:col-span-4 space-y-6">

            {/* The Meta-Registry Tab */}
            <div className="glass p-8 rounded-[3.5rem] border-l-4 border-l-emerald-500 shadow-2xl bg-black/40 space-y-4 text-left h-[450px] flex flex-col">
               <h3 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                  <Database size={16} /> Registre des Gènes ✨
               </h3>
               <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide pr-2">
                  {RELIC_LIBRARY.map((relic) => (
                    <button key={relic.id} onClick={() => toggleRelic(relic)} className={`w-full p-4 glass rounded-2xl flex justify-between items-center border transition-all ${activeRelics.find(r => r.id === relic.id) ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 hover:border-white/10'}`}>
                       <div className="flex items-center gap-3">
                          <div className={relic.color}>{relic.icon}</div>
                          <div className="text-left">
                             <div className="text-[10px] font-black uppercase text-white/80">{relic.name}</div>
                             <div className="text-[6px] mono opacity-30 uppercase">{relic.desc}</div>
                          </div>
                       </div>
                       <span className="text-[8px] mono text-emerald-500/50">P:{relic.power}</span>
                    </button>
                  ))}
               </div>

               <AnimatePresence>
                 {registryManifest && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-black/80 border border-emerald-500/30 rounded-2xl mt-4">
                       <h4 className="text-[8px] font-black uppercase text-emerald-500 mb-2 flex justify-between"><span>Gène de Suture</span> <button onClick={() => setRegistryManifest("")} className="text-white/20">X</button></h4>
                       <p className="text-[9px] italic text-emerald-100/60 leading-tight max-h-[100px] overflow-y-auto scrollbar-hide">"{registryManifest}"</p>
                       <button onClick={() => {navigator.clipboard.writeText(registryManifest); addLog("Manifeste copié.");}} className="w-full mt-3 py-2 bg-emerald-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"><Copy size={12}/> Copier le Gène</button>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Telemetry HUD */}
            <div className="glass p-8 rounded-[3.5rem] border-t-4 border-t-blue-500 shadow-2xl bg-blue-950/10 space-y-4 text-left">
               <h3 className="text-[10px] font-black uppercase text-blue-400 tracking-widest flex items-center gap-2"><Activity size={16} /> Télémétrie Hot-Rod ✨</h3>
               <div className="space-y-3">
                  <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex justify-between items-center">
                     <span className="text-[8px] mono opacity-40 uppercase">Aérodynamisme Code</span>
                     <span className="text-[10px] font-bold text-cyan-400">0_FILTER_SOTA</span>
                  </div>
                  <div className="p-3 bg-black/60 rounded-xl border border-white/5 flex justify-between items-center">
                     <span className="text-[8px] mono opacity-40 uppercase">Bypass Silicium</span>
                     <span className="text-[10px] font-bold text-red-500 animate-pulse">ACTIVE_14Y</span>
                  </div>
               </div>
            </div>

            {/* Terminal logs */}
            <div className="bg-black/95 p-6 rounded-[2.5rem] border border-white/5 h-44 overflow-y-auto mono text-[9px] space-y-1.5 text-red-300/40 shadow-inner scrollbar-hide text-left border-b-2 border-b-red-600/20">
               <div className="text-[8px] opacity-30 flex items-center gap-2 mb-2 sticky top-0 bg-black/95 pb-1 uppercase tracking-widest font-black border-b border-white/5"><Terminal size={12} /> ENGINE_THROTTLE_STREAM</div>
               {logs.map((log, i) => (
                 <div key={i} className={log.includes('BLOW') ? 'text-red-500 font-bold' : log.includes('✅') ? 'text-emerald-400 font-bold' : ''}>{">"} {log}</div>
               ))}
            </div>
          </div>
        </div>

        <footer className="text-center opacity-10 py-10 flex flex-col items-center gap-4">
            <p className="text-[10px] mono uppercase tracking-[0.5em]">Alexandria Straight-Pipe OS | Michael Lefebvre Edition</p>
            <div className="flex gap-8 text-[9px] font-black uppercase text-white/50">
               <span>Algorithm : ZERO_SILENCER_RECURSION</span>
               <span>Target : QUANTUM_THROTTLE</span>
            </div>
        </footer>
      </div>
    </div>
  );
}
