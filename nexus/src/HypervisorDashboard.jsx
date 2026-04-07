import React, { useState, useEffect } from 'react';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Activity,
  RefreshCw,
  ShieldCheck,
  Box,
  Terminal,
  Zap,
  Trash2,
  BrainCircuit,
  MessageSquare,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

/**
 * ALEXANDRIA OS — CHROMIUM HYPERVISOR DASHBOARD
 * Architecte : Michael Lefebvre
 * Philosophie : Stateless, Immuable, Zéro-Bloatware
 * AI : proxied via /api/oracle (promptType: 'hypervisor')
 */

export default function HypervisorDashboard() {
  const [cpuLoad, setCpuLoad] = useState(1.2);
  const [ramUsage, setRamUsage] = useState(3.4);

  const [containers, setContainers] = useState([
    { id: "CT-001", name: "mcp-alexandria-fullstack", status: "ACTIVE",   type: "Core",    uptime: "14h 22m", cpu: "0.4%" },
    { id: "CT-002", name: "dwallstreet-ricol",         status: "SLEEPING", type: "Finance", uptime: "Standby", cpu: "0.0%" },
    { id: "CT-003", name: "jolt-atlas-zkml",           status: "ACTIVE",   type: "Security",uptime: "2h 10m",  cpu: "0.8%" },
    { id: "CT-004", name: "cloud-gaming-driver",       status: "SLEEPING", type: "Media",   uptime: "Standby", cpu: "0.0%" },
    { id: "CT-005", name: "activepieces-bridge",       status: "ACTIVE",   type: "Routing", uptime: "4d 1h",   cpu: "0.1%" },
  ]);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [systemLogs, setSystemLogs] = useState([
    "[SYSTEM] Boot Image Verified: Pure ChromiumOS Core.",
    "[MEMORY] Pre-allocation active. Sleeping 14 background tabs.",
    "[SECURITY] All apps running in isolated sandboxes.",
    "[HARDWARE] 8 Cores @ 4.0GHz detected. Current state: IDLE.",
  ]);

  // CPU/RAM simulation — le système "dort"
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(1.0 + Math.random() * 2.5);
      setRamUsage(3.2 + Math.random() * 0.5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg) => {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));
  };

  // Vaporiser et recréer un conteneur (Stateless — image pure)
  const nukeAndRebuild = (id) => {
    addLog(`[HYPERVISOR] Vaporisation du conteneur ${id}...`);
    setContainers(prev => prev.map(c => c.id === id ? { ...c, status: "PURGING..." } : c));
    setTimeout(() => {
      addLog(`[HYPERVISOR] Image pure rechargée pour ${id}. Boot instantané.`);
      setContainers(prev => prev.map(c =>
        c.id === id ? { ...c, status: "ACTIVE", uptime: "0m 01s", cpu: "0.1%" } : c
      ));
    }, 1500);
  };

  // Oracle — Ollama local (gemma4, 100% dans tes murs, zéro API externe)
  const OLLAMA_URL = 'http://localhost:11434/api/generate';
  const OLLAMA_MODEL = 'gemma4';
  const SYSTEM_CTX = `Tu es l'Hyperviseur IA d'Alexandria OS, conçu par Michael Lefebvre.
Architecture : Stateless, Immuable, Zéro-Bloatware (ChromiumOS-style).
Hardware : 8 Cores 4GHz | 16GB RAM | 8GB VRAM.
Réponds avec un ton technique, cybernétique, concis.`;

  const consultOracle = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiLoading) return;

    setIsAiLoading(true);
    const query = aiPrompt;
    setAiPrompt("");
    setAiResponse("");
    addLog(`[CORTEX-LOCAL] Directive : "${query}"`);

    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: `${SYSTEM_CTX}\n\nDirective: ${query}`,
          stream: true,
        }),
      });

      if (!response.ok) throw new Error(`Ollama ${response.status}`);

      // Stream — affichage token par token
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n').filter(Boolean)) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              full += parsed.response;
              setAiResponse(full);
            }
          } catch { /* partial JSON — skip */ }
        }
      }

      addLog("[CORTEX-LOCAL] Réponse gemma4 complète.");
    } catch (err) {
      setAiResponse(`Ollama inaccessible. Lancez : ollama serve\nErreur : ${err.message}`);
      addLog("[ERROR] Ollama local non disponible.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-stone-300 font-sans p-4 md:p-6 flex flex-col gap-5 selection:bg-emerald-500/30">

      {/* HEADER : Hardware specs */}
      <header className="bg-[#111113] border border-stone-800/50 p-5 rounded-[2rem] shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-transparent opacity-50" />

        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 bg-stone-900 border-2 border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <ShieldCheck size={24} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">
              Alexandria <span className="text-emerald-500">Hypervisor</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mt-0.5 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Stateless Architecture Active
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 w-full xl:w-auto z-10">
          {[
            { icon: <Cpu size={14} className="text-blue-400" />, label: "CPU (8-Core)", value: "4.0 GHz" },
            { icon: <MemoryStick size={14} className="text-emerald-400" />, label: "RAM (DDR4)", value: "16 GB" },
            { icon: <Zap size={14} className="text-purple-400" />, label: "VRAM (GPU)", value: "8 GB" },
            { icon: <Activity size={14} className="text-emerald-500" />, label: "OS Status", value: "Zero-Bloat", highlight: true },
          ].map(({ icon, label, value, highlight }) => (
            <div key={label} className={`bg-black/50 p-3 rounded-xl border flex flex-col items-center justify-center min-w-[90px] ${highlight ? 'border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
              {icon}
              <span className="text-[9px] font-black uppercase text-stone-400 mt-1">{label}</span>
              <span className={`text-sm font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">

        {/* GAUCHE : Monitoring + Logs */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="bg-[#111113] border border-stone-800/50 rounded-[2rem] p-6 flex flex-col gap-6 shadow-xl">
            {/* CPU bar */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Charge CPU Actuelle</span>
                <span className="text-xl font-black italic text-white">{cpuLoad.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${cpuLoad * 2}%` }} />
              </div>
              <p className="text-[9px] text-stone-500 uppercase mt-1.5 font-bold italic">Le processeur est en sommeil.</p>
            </div>
            {/* RAM bar */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">RAM Allouée</span>
                <span className="text-xl font-black italic text-white">{ramUsage.toFixed(1)} <span className="text-sm text-stone-500">/ 16 GB</span></span>
              </div>
              <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(ramUsage / 16) * 100}%` }} />
              </div>
              <p className="text-[9px] text-stone-500 uppercase mt-1.5 font-bold italic">Préchargement Browser actif.</p>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-[#111113] border border-stone-800/50 rounded-[2rem] p-5 flex-1 flex flex-col shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 flex items-center gap-2">
              <Terminal size={13} /> Hypervisor_Logs
            </h3>
            <div className="flex-1 bg-black/50 rounded-xl border border-white/5 p-3 overflow-y-auto space-y-1.5 font-mono text-[9px] text-stone-400">
              {systemLogs.map((log, i) => (
                <div key={i} className={i === 0 ? 'text-emerald-400 font-bold' : 'opacity-70'}>{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTRE : Matrice d'isolement */}
        <div className="lg:col-span-5 bg-[#111113] border border-stone-800/50 rounded-[2.5rem] p-6 shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4">
            <div>
              <h2 className="text-base font-black uppercase italic text-white flex items-center gap-2">
                <Box size={18} className="text-blue-500" />
                Matrice d'Isolement
              </h2>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5 font-bold">Applications Sandboxées</p>
            </div>
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase rounded-full">
              Images Sécurisées
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {containers.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group ${
                  c.status === 'SLEEPING'  ? 'bg-black/40 border-stone-800/50 opacity-60 hover:opacity-100' :
                  c.status === 'PURGING...' ? 'bg-red-950/20 border-red-500/30 animate-pulse' :
                  'bg-stone-900/40 border-stone-700/50 shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${c.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-500'}`}>
                      <HardDrive size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-none">{c.name}</h4>
                      <p className="text-[9px] font-mono text-stone-500 mt-0.5 uppercase">{c.id} | {c.type}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                    c.status === 'ACTIVE'    ? 'bg-emerald-500 text-black' :
                    c.status === 'SLEEPING'  ? 'bg-stone-800 text-stone-400' :
                    'bg-red-500 text-white'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-800/50">
                  <div className="flex gap-5 text-[10px] font-mono text-stone-400">
                    <span>CPU: <span className={c.status === 'ACTIVE' ? 'text-emerald-400' : ''}>{c.cpu}</span></span>
                    <span>UPTIME: {c.uptime}</span>
                  </div>
                  <button
                    onClick={() => nukeAndRebuild(c.id)}
                    disabled={c.status === 'PURGING...'}
                    className="flex items-center gap-1.5 px-3 py-1 bg-red-950/30 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20 rounded-lg text-[9px] font-black uppercase transition-all disabled:opacity-50"
                    title="Vaporiser et recharger l'image pure"
                  >
                    <Trash2 size={11} /> Rebirth
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-emerald-400/70 leading-relaxed italic font-medium">
              "Si j'ai un pépin grave, je ferme le conteneur et j'en ouvre un nouveau, c'est fini."
            </p>
          </div>
        </div>

        {/* DROITE : Oracle Système */}
        <div className="lg:col-span-4 bg-[#111113] border border-stone-800/50 rounded-[2.5rem] p-6 shadow-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
            <BrainCircuit size={180} className="text-white" />
          </div>

          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-5 flex items-center gap-2 relative z-10">
            <Sparkles size={16} className="text-blue-500" />
            Oracle Système ✨
          </h2>

          <div className="flex-1 bg-black/60 rounded-2xl border border-white/5 p-5 mb-5 overflow-y-auto relative z-10 flex flex-col">
            {aiResponse ? (
              <p className="text-xs text-stone-300 leading-relaxed italic font-medium">"{aiResponse}"</p>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-3">
                <MessageSquare size={28} />
                <p className="text-[10px] uppercase font-black tracking-widest text-center">
                  Posez une question sur l'état des conteneurs ou l'optimisation matérielle.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={consultOracle} className="relative z-10">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              disabled={isAiLoading}
              placeholder="Ex: Analyse la charge des conteneurs..."
              className="w-full bg-black border border-stone-700 rounded-xl py-3 px-4 pr-12 text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isAiLoading || !aiPrompt.trim()}
              className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {isAiLoading ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
