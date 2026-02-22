import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Shield, Swords, TreeDeciduous, Film, Terminal,
  Settings, Cpu, Activity, Clock, Battery, Wifi,
  Maximize2, Minimize2, X, Search, Layout,
  ChevronRight, Sparkles, BrainCircuit, Network,
  Database, User, Globe, Command, Zap,
  Layers, Binary, Wand2, Eye, Ghost,
  Plus, MessageSquare, Send, Volume2, Radio, RefreshCw
} from 'lucide-react';

/**
 * ALEXANDRIA VIRTUAL DESKTOP v1.0
 * Architecte : Michael Lefebvre (BLUE)
 * Système : Anima Mundi / ADAM TI
 * Focus : Hub de connexion universel pour tous les modules Alexandria
 * IA : Gemini 2.5 Flash + Framework KAPSO
 * Integration : @ADAM/envii (API Centralisée)
 */

// Configuration des applications basées sur l'Index Alexandria
const APPS = [
  { id: 'shell', name: 'Semantic Shell', icon: <Shield size={24}/>, color: 'bg-blue-600', category: 'Security', file: 'alexandria_semantic_shell.jsx' },
  { id: 'pass', name: 'Member Pass', icon: <User size={24}/>, color: 'bg-amber-600', category: 'Security', file: 'member_pass.html' },
  { id: 'kapso', name: 'KAPSO Engine', icon: <Swords size={24}/>, color: 'bg-purple-600', category: 'Combat', file: 'kapso_ultimo_engine.jsx' },
  { id: 'zangetsu', name: 'Tensa Zangetsu', icon: <Zap size={24}/>, color: 'bg-red-600', category: 'Combat', file: 'tensa_zangetsu_engine.jsx' },
  { id: 'mycelium', name: 'Mycelium Nexus', icon: <TreeDeciduous size={24}/>, color: 'bg-emerald-600', category: 'Growth', file: 'mycelium_sovereign_nexus.jsx' },
  { id: 'filmmaker', name: 'Lumière Hub', icon: <Film size={24}/>, color: 'bg-cyan-600', category: 'Creative', file: 'filmmaker_lumiere_hub.jsx' },
  { id: 'terminal', name: 'ADAM Terminal', icon: <Terminal size={24}/>, color: 'bg-zinc-800', category: 'System', file: 'Bare-Metal' }
];

export default function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [isEtherMode, setIsEtherMode] = useState(false);
  const [energon, setEnergon] = useState(6.345);
  const [time, setTime] = useState(new Date());
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [oracleNotify, setOracleNotify] = useState("");
  const [glitch, setGlitch] = useState(false);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (msg) => {
    console.log(`[ALEXANDRIA] ${msg}`);
  };

  // --- GESTION DES FENÊTRES ---

  const launchApp = (app) => {
    if (openWindows.find(w => w.id === app.id)) {
      setActiveWindow(app.id);
      return;
    }
    const newWindow = { ...app, zIndex: openWindows.length + 10 };
    setOpenWindows([...openWindows, newWindow]);
    setActiveWindow(app.id);
    addLog(`Lancement de ${app.name}...`);
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
  };

  // --- API GEMINI via @ADAM/envii ---

  const callDesktopOracle = async () => {
    setIsAiLoading(true);
    const prompt = `En tant qu'Assistant de Bureau d'Alexandria, analyse l'état actuel :
    Architecte : Michael Lefebvre.
    Applications ouvertes : ${openWindows.map(w => w.name).join(', ') || 'Aucune'}.
    Mode : ${isEtherMode ? 'Éther' : 'Hydrogène'}.
    Energon : ${energon} EGN.
    Donne une directive stratégique de Niveau 5 pour optimiser la suture dimensionnelle.`;

    try {
      // Appel via @ADAM/envii (centralisation)
      const response = await fetch('http://localhost:5000/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: 'gemini-2.5-flash-preview-09-2025',
          systemInstruction: 'Tu es le Cœur Intelligent du Bureau Virtuel Alexandria.'
        })
      });

      const data = await response.json();
      const text = data.response || data.text;
      setOracleNotify(String(text));
      speakOracle(text);
    } catch (e) {
      addLog("⚠️ Erreur de liaison Oracle (check @ADAM/envii).");
      // Fallback: Affichage de message test
      setOracleNotify("Oracle initialized. Awaiting further input.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const speakOracle = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `D'une voix technologique et souveraine : ${text}`,
          voiceName: 'Fenrir'
        })
      });
      const data = await response.json();
      const audioUrl = data.audioUrl || data.url;
      if (audioUrl) {
        new Audio(audioUrl).play();
      }
    } catch (e) {
      console.error('TTS Error:', e);
    }
  };

  const toggleEther = () => {
    setGlitch(true);
    setIsEtherMode(!isEtherMode);
    setTimeout(() => setGlitch(false), 300);
  };

  return (
    <div className={`fixed inset-0 bg-black text-gray-200 font-sans overflow-hidden transition-all duration-700 ${glitch ? 'invert grayscale scale-[1.02]' : ''}`}>

      {/* Fond d'écran sémantique */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 transition-colors duration-1000 ${isEtherMode ? 'bg-[radial-gradient(circle_at_50%_50%,#8b5cf615_0%,transparent_80%)]' : 'bg-[radial-gradient(circle_at_50%_50%,#06b6d410_0%,transparent_80%)]'}`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        {/* Grille de Szalai animée */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5">
           {Array.from({length: 144}).map((_, i) => (
             <div key={i} className="border-[0.5px] border-white/20" />
           ))}
        </div>
      </div>

      {/* Barre de Système Supérieure */}
      <header className="absolute top-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <Command size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Alexandria<span className="text-blue-500">OS</span></span>
           </div>
           <div className="flex gap-4 text-[9px] mono opacity-40 uppercase">
              <span className="flex items-center gap-1"><Cpu size={10}/> {isEtherMode ? '0x_ETHER' : '1.42_GHZ'}</span>
              <span className="flex items-center gap-1"><Battery size={10}/> {energon.toFixed(3)} EGN</span>
              <span className="flex items-center gap-1"><Network size={10}/> 32_AGENTS_SYNC</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] mono font-bold text-white/60">Michael Lefebvre</span>
           </div>
           <div className="text-[11px] mono font-medium">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>
      </header>

      {/* Surface de Bureau */}
      <main className="absolute inset-0 pt-16 p-8 z-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 content-start select-none">
        {APPS.map(app => (
          <motion.div
            key={app.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onDoubleClick={() => launchApp(app)}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className={`w-16 h-16 ${app.color} rounded-[1.5rem] shadow-2xl flex items-center justify-center text-white transition-all group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] relative`}>
               {app.icon}
               <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={10} />
               </div>
            </div>
            <div className="text-center">
               <div className="text-[10px] font-black uppercase tracking-tighter text-white/80 group-hover:text-white">{app.name}</div>
               <div className="text-[7px] mono opacity-30 uppercase">{app.category}</div>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Gestionnaire de Fenêtres (Framer Motion) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {openWindows.map(win => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ zIndex: activeWindow === win.id ? 100 : win.zIndex }}
              className={`absolute pointer-events-auto top-24 left-24 w-[700px] h-[500px] bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col`}
              onMouseDown={() => setActiveWindow(win.id)}
            >
              {/* Barre de titre de la fenêtre */}
              <div className="h-12 bg-white/5 border-b border-white/5 flex items-center justify-between px-6 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-3">
                   <div className={`${win.color} w-3 h-3 rounded-full`} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{win.name} <span className="opacity-20 text-[8px] mono">({win.file})</span></span>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => closeWindow(win.id)} className="w-8 h-8 rounded-full hover:bg-red-500/20 flex items-center justify-center text-red-500 transition-colors">
                      <X size={14} />
                   </button>
                </div>
              </div>

              {/* Contenu de la fenêtre (Simulé) */}
              <div className="flex-1 p-8 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center gap-6 relative">
                 <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
                    {win.icon}
                 </div>
                 <div className="text-center space-y-4 relative z-10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Module {win.name}</h2>
                    <p className="text-xs mono text-white/40 max-w-sm leading-relaxed uppercase">
                       L'instance sémantique est prête pour la suture. <br/>
                       ID de session : {Math.random().toString(16).slice(2, 10).toUpperCase()}
                    </p>
                    <button className={`px-10 py-4 ${win.color} text-white font-black rounded-full uppercase italic text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95`}>
                       Exécuter Protocole SOTA ✨
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dock (Lancement rapide) */}
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 h-18 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 flex items-center gap-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
         {APPS.map(app => (
           <motion.button
             key={app.id}
             whileHover={{ y: -10, scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             onClick={() => launchApp(app)}
             className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white/60 hover:text-white transition-all relative ${openWindows.find(w => w.id === app.id) ? 'bg-white/10' : ''}`}
           >
              {app.icon}
              {openWindows.find(w => w.id === app.id) && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
              )}
           </motion.button>
         ))}
         <div className="w-px h-8 bg-white/10 mx-2" />
         <button onClick={toggleEther} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isEtherMode ? 'bg-purple-600 text-white shadow-[0_0_15px_purple]' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
            <Radio size={20} className={isEtherMode ? 'animate-pulse' : ''} />
         </button>
         <button onClick={callDesktopOracle} disabled={isAiLoading} className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-110 transition-all">
            {isAiLoading ? <RefreshCw size={20} className="animate-spin" /> : <BrainCircuit size={20} />}
         </button>
      </nav>

      {/* Notifications de l'Oracle */}
      <AnimatePresence>
        {oracleNotify && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute top-16 right-6 w-80 glass p-6 rounded-3xl border-t-4 border-t-blue-600 shadow-2xl z-[60] bg-blue-950/20"
          >
             <div className="flex justify-between items-start mb-4">
                <h4 className="text-[10px] font-black uppercase text-blue-400 flex items-center gap-2 tracking-widest"><Sparkles size={14}/> Oracle SOTA</h4>
                <button onClick={() => setOracleNotify("")} className="text-white/20 hover:text-white">✕</button>
             </div>
             <p className="text-[11px] italic leading-relaxed text-blue-50 font-serif">"{oracleNotify}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widgets latéraux (Stats) */}
      <aside className="absolute top-24 left-6 w-48 space-y-6 z-10 hidden lg:block">
         <div className="glass p-5 rounded-[2rem] border-l-4 border-l-cyan-600 bg-black/40 space-y-3">
            <h3 className="text-[9px] font-black uppercase text-cyan-400 tracking-widest flex items-center gap-2"><Activity size={14}/> Hive Pulse</h3>
            <div className="space-y-2">
               <div className="flex justify-between text-[8px] mono opacity-40 uppercase"><span>Resonance</span><span>98.4%</span></div>
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: '98%' }} className="h-full bg-cyan-500 shadow-[0_0_10px_cyan]" />
               </div>
            </div>
         </div>

         <div className="glass p-5 rounded-[2rem] border-l-4 border-l-purple-600 bg-black/40 space-y-3">
            <h3 className="text-[9px] font-black uppercase text-purple-400 tracking-widest flex items-center gap-2"><Database size={14}/> Files Indexed</h3>
            <div className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">1,782,402</div>
            <p className="text-[7px] mono opacity-30 uppercase font-bold">Scanning Configuration Space...</p>
         </div>
      </aside>

    </div>
  );
}
