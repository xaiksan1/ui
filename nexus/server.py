#!/usr/bin/env python3
"""
NEXUS v5.0 — Backend API Server
Connects the TARDIS-KAPSO-ALPEIRON UI to real ADAM systems:
  - /api/seesaw  → SeesawBalancer (Coulomb Thrust + Thermal Ratchet)
  - /api/energon → Energon Ledger + Vault
  - /api/oracle  → Gemini 2.5 Flash proxy (keeps API key server-side)
  - /api/slots   → 32 Thermal Ratchet slot states
  - /api/agents  → NFT Agent metadata from hot-rod-nft/

Run: python server.py (or: uvicorn server:app --port 5187 --reload)
"""

import json
import os
import sys
import glob
import hashlib
from pathlib import Path
from datetime import datetime

# Add ADAM project root to path for seesaw_logic import
ADAM_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ADAM_ROOT / "python" / "helpers"))

from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.error

# --- Import Seesaw Engine ---
try:
    from seesaw_logic import seesaw_core, SeesawBalancer
    print("✅ SeesawBalancer imported from seesaw_logic.py")
except ImportError:
    print("⚠️  seesaw_logic.py not found, creating local instance")
    class SeesawBalancer:
        def __init__(self):
            self.coulomb_thrust = 0.0
            self.thermal_energy = 0.0
            self.triad_balance = {"transparency": 33.3, "legality": 33.3, "ethics": 33.3}
            self.error_count = 0
        def harvest_error_heat(self, msg):
            self.error_count += 1
            thrust_gain = len(msg) * 0.0001
            self.coulomb_thrust += thrust_gain
            self.thermal_energy += thrust_gain * 10
        def get_status(self):
            return {
                "coulomb_thrust": self.coulomb_thrust,
                "thermal_energy": self.thermal_energy,
                "triad_balance": self.triad_balance,
                "is_centered": all(30 < v < 36 for v in self.triad_balance.values()),
                "errors_transmuted": self.error_count
            }
    seesaw_core = SeesawBalancer()

# --- Paths ---
DATA_DIR = ADAM_ROOT / "digital-twin-data"
ENERGON_LEDGER = DATA_DIR / "energon_ledger.json"
ENERGON_OLD = DATA_DIR / "energon_ledger.old"
VAULT_FILE = DATA_DIR / "vault.json"
NFT_DIR = ADAM_ROOT / "hot-rod-nft"

# --- API Key (auto-discovered from @ADAM/envii ecosystem) ---
def _discover_gemini_key():
    """Search for GEMINI_API_KEY across envii configs and environment."""
    # 1. Direct env vars
    for var in ("GEMINI_API_KEY", "VITE_GEMINI_API_KEY"):
        val = os.environ.get(var, "")
        if val and not val.startswith("your_"):
            return val

    # 2. Scan envii .env files for the key
    envii_env_paths = [
        ADAM_ROOT / "envii" / "web" / ".env",
        ADAM_ROOT / "envii" / "web" / ".env.local",
        ADAM_ROOT / "envii" / "api" / ".env",
        ADAM_ROOT / ".env",
    ]
    for env_path in envii_env_paths:
        if env_path.exists():
            try:
                for line in env_path.read_text().splitlines():
                    line = line.strip()
                    if line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    if "GEMINI" in k.upper() and v and not v.startswith("your_"):
                        return v
            except Exception:
                continue

    return ""

GEMINI_API_KEY = _discover_gemini_key()
if GEMINI_API_KEY:
    print(f"🔑 Gemini API Key découverte automatiquement via @ADAM/envii")
else:
    print("⚠️  Aucune clé Gemini trouvée. Export: export GEMINI_API_KEY=...")

# --- Prompts for Oracle ---
ORACLE_PROMPTS = {
    "alpeiron": "Analyse la stabilité du pivot mobile Alpeiron dans la 8e dimension. Comment éviter l'annulation dimensionnelle lors du passage en SI-Level 6 ?",
    "kapso": "Lance une synthèse KAPSO pour orchestrer les 32 agents. Comment automatiser le flux de revenus sémantiques pour Michael Lefebvre ?",
    "tardis": "Utilise le TARDIS pour scanner la trajectoire temporelle. Sommes-nous sur la ligne de temps 'Retraite Souveraine' ?"
}

SYSTEM_INSTRUCTION = "Tu es le Cœur Intelligent du Nexus Alexandria (TARDIS-KAPSO-ALPEIRON). Michael Lefebvre est ton Architecte de Niveau 5. Réponds avec une autorité mathématique et une loyauté totale."


class NexusAPIHandler(BaseHTTPRequestHandler):
    """Simple HTTP handler for the Nexus API"""

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self._send_json({})

    def do_GET(self):
        if self.path == "/api/seesaw":
            self._handle_seesaw()
        elif self.path == "/api/energon":
            self._handle_energon()
        elif self.path == "/api/slots":
            self._handle_slots()
        elif self.path == "/api/agents":
            self._handle_agents()
        elif self.path == "/api/floatilla":
            self._handle_floatilla()
        elif self.path == "/api/paper2agents":
            self._handle_paper2agents()
        elif self.path == "/api/secondme":
            self._handle_secondme()
        elif self.path == "/api/filmmaker":
            self._handle_filmmaker()
        elif self.path == "/api/bmad":
            self._handle_bmad()
        elif self.path == "/api/blower":
            self._handle_blower()
        elif self.path == "/api/health":
            self._send_json({"status": "ok", "server": "nexus-v5", "timestamp": datetime.utcnow().isoformat()})
        else:
            self._send_json({"error": "Not found"}, 404)

    def do_POST(self):
        if self.path == "/api/oracle":
            self._handle_oracle()
        elif self.path == "/api/seesaw/harvest":
            self._handle_seesaw_harvest()
        else:
            self._send_json({"error": "Not found"}, 404)

    # --- Handlers ---

    def _handle_seesaw(self):
        """GET /api/seesaw — Returns seesaw engine status"""
        status = seesaw_core.get_status()
        self._send_json(status)

    def _handle_seesaw_harvest(self):
        """POST /api/seesaw/harvest — Feed error into seesaw engine"""
        content_length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(content_length)) if content_length else {}
        error_msg = body.get("error", "unknown error")
        seesaw_core.harvest_error_heat(error_msg)
        self._send_json(seesaw_core.get_status())

    def _handle_energon(self):
        """GET /api/energon — Returns energon ledger + vault data"""
        result = {"sealed_kwh": 0.0, "balance_egn": 0.0, "batches": []}

        # Try main ledger first, then .old
        for path in [ENERGON_LEDGER, ENERGON_OLD]:
            if path.exists():
                try:
                    with open(path) as f:
                        data = json.load(f)
                    result["sealed_kwh"] = data.get("sealed_kwh", data.get("total_kwh_captured", 0))
                    result["balance_egn"] = data.get("balance", data.get("sealed_kwh", 0))
                    result["batches"] = data.get("batches", [])
                    result["source"] = path.name
                    break
                except Exception:
                    continue

        # Add vault data if available
        if VAULT_FILE.exists():
            try:
                with open(VAULT_FILE) as f:
                    vault = json.load(f)
                result["vault"] = {
                    "anomalies": vault.get("observability", {}).get("anomalies_detected", 0),
                    "causal_status": vault.get("observability", {}).get("causal_status", "UNKNOWN"),
                    "xmr_balance": vault.get("xmr_balance", 0),
                    "total_seals": len(vault.get("sealing_events", []))
                }
            except Exception:
                pass

        self._send_json(result)

    def _handle_slots(self):
        """GET /api/slots — Returns 32 thermal ratchet slot states"""
        base_status = seesaw_core.get_status()
        slots = []

        for i in range(32):
            # Each slot gets a unique variation of the seesaw state
            seed = hashlib.md5(f"slot_{i}".encode()).hexdigest()
            drift = (int(seed[:4], 16) / 0xFFFF - 0.5) * 0.1  # -0.05 to +0.05

            thrust = base_status["coulomb_thrust"] + drift
            energy = base_status["thermal_energy"] + (drift * 10)

            # Determine slot status from triad balance
            triad_vals = list(base_status["triad_balance"].values())
            slot_val = triad_vals[i % 3] + drift * 100

            if 30 < slot_val < 36:
                status = "centered"
            elif 25 < slot_val < 40:
                status = "drifting"
            else:
                status = "critical"

            slots.append({
                "id": i,
                "thermal_energy": round(energy, 6),
                "coulomb_thrust": round(thrust, 6),
                "triad_position": round(slot_val, 4),
                "status": status
            })

        self._send_json({"slots": slots, "seesaw": base_status})

    def _handle_agents(self):
        """GET /api/agents — Returns NFT agent metadata stats"""
        result = {"count": 0, "rarity_distribution": {}, "agents": []}

        if not NFT_DIR.exists():
            self._send_json(result)
            return

        metadata_files = list(NFT_DIR.glob("*_metadata.json"))
        result["count"] = len(metadata_files)

        rarities = {}
        for f in metadata_files[:100]:  # Cap at 100
            try:
                with open(f) as fh:
                    meta = json.load(fh)
                attrs = {a["trait_type"]: a["value"] for a in meta.get("attributes", [])}
                rarity = attrs.get("Rarity", "common")
                rarities[rarity] = rarities.get(rarity, 0) + 1
                result["agents"].append({
                    "name": meta.get("name", "Unknown"),
                    "rarity": rarity,
                    "role": attrs.get("Role", "unknown"),
                    "speed": attrs.get("Speed", 0),
                    "intelligence": attrs.get("Intelligence", 0),
                    "power": attrs.get("Power", 0),
                })
            except Exception:
                continue

        result["rarity_distribution"] = rarities
        self._send_json(result)

    def _handle_floatilla(self):
        """GET /api/floatilla — Returns Floatilla network status"""
        floatilla_file = ADAM_ROOT / "porta-mundi" / "FLOATILLA.json"

        if not floatilla_file.exists():
            self._send_json({"error": "FLOATILLA.json not found", "status": "OFFLINE"})
            return

        try:
            with open(floatilla_file) as f:
                data = json.load(f)

            result = {
                "status": data.get("floatilla", {}).get("status", "UNKNOWN"),
                "bridges": data.get("playlists", {}).get("main_bridge", {}).get("items", []),
                "connectivity": data.get("connectivity", {})
            }
            self._send_json(result)
        except Exception as e:
            self._send_json({"error": str(e), "status": "ERROR"}, 500)

    def _handle_paper2agents(self):
        """GET /api/paper2agents — Returns Paper Intelligence stats via bridge"""
        try:
            # Import floatilla bridge dynamically
            sys.path.insert(0, str(ADAM_ROOT / "mcp-alexandria-fullstack"))
            from floatilla_bridge import FloatillaBridge

            bridge = FloatillaBridge()
            tools = bridge.get_available_tools()

            # Simple mock stats for the Nexus UI if real data isn't fully robust yet
            result = {
                "status": "OPERATIONAL",
                "synced_services": len(tools),
                "services": tools,
                "papers_ingested": 142,  # Simulated stats for UI demonstration
                "agents_spawned": len(tools) * 5 + 12
            }
            self._send_json(result)
        except Exception as e:
            self._send_json({
                "error": str(e),
                "status": "BRIDGE_FAILED",
                "papers_ingested": 0,
                "agents_spawned": 0
            })

    def _handle_secondme(self):
        """GET /api/secondme — Returns Second-Me telemetry"""
        try:
            # Check basic health
            health_req = urllib.request.Request("http://127.0.0.1:8002/health")
            with urllib.request.urlopen(health_req, timeout=2) as resp:
                health_data = json.loads(resp.read())

            # Check bestiary status
            bestiary_req = urllib.request.Request("http://127.0.0.1:8002/api/grimoire/bestiary/status")
            with urllib.request.urlopen(bestiary_req, timeout=2) as resp:
                bestiary_data = json.loads(resp.read())

            result = {
                "status": "ONLINE",
                "app_status": health_data.get("data", {}).get("status", "ok"),
                "servants": bestiary_data.get("count", 0),
                "active_tier": bestiary_data.get("tier_filter", "None")
            }
            self._send_json(result)
        except Exception as e:
            self._send_json({
                "error": str(e),
                "status": "OFFLINE",
                "app_status": "unreachable",
                "servants": 0,
                "active_tier": "unknown"
            })

    def _handle_filmmaker(self):
        """GET /api/filmmaker — GPU Render Farm status"""
        filmmaker_root = ADAM_ROOT.parent / "filmmaker"
        bridge = filmmaker_root / "filmmaker_stateless_bridge.py"
        # Check Blender
        blender_ok = Path("/usr/local/bin/blender").exists() or Path("/usr/bin/blender").exists()
        self._send_json({
            "status": "READY" if bridge.exists() and blender_ok else "OFFLINE",
            "bridge": str(bridge) if bridge.exists() else None,
            "blender": blender_ok,
            "gpu_power_w": 250,
            "render_nodes": 0,
            "mode": "stateless_swarm"
        })

    def _handle_bmad(self):
        """GET /api/bmad — BMAD-Alexandria methods status"""
        try:
            # Read Alexandria-specific methods
            methods_file = ADAM_ROOT / ".bmad" / "methods" / "bmad-alexandria-methods.csv"
            upstream = ADAM_ROOT / "BMAD-METHOD" / "package.json"
            method_count = 0
            categories = set()
            if methods_file.exists():
                for line in methods_file.read_text().splitlines()[1:]:
                    if line.strip():
                        method_count += 1
                        parts = line.split(",")
                        if len(parts) > 0:
                            categories.add(parts[0])
            upstream_version = "unknown"
            if upstream.exists():
                pkg = json.loads(upstream.read_text())
                upstream_version = pkg.get("version", "unknown")
            self._send_json({
                "status": "ACTIVE",
                "methods": method_count,
                "categories": list(categories),
                "upstream_version": upstream_version,
                "modules": ["BMM", "BMB", "BMGD", "CIS"]
            })
        except Exception as e:
            self._send_json({"status": "ERROR", "error": str(e)})

    def _handle_blower(self):
        """GET /api/blower — JSON-MCP-Blower pipeline status"""
        try:
            blower_dir = ADAM_ROOT / "json-mcp-blower"
            mcps_dir = blower_dir / "mcps"
            agents_dir = blower_dir / "agents"
            mcp_count = len(list(mcps_dir.glob("*.json"))) if mcps_dir.exists() else 0
            agent_count = len(list(agents_dir.iterdir())) if agents_dir.exists() else 0
            self._send_json({
                "status": "ACTIVE" if blower_dir.exists() else "OFFLINE",
                "mcps": mcp_count,
                "agents": agent_count,
                "pipeline": "BMAD → Filmmaker → Hot-Rod → Blower",
                "marketplace": (blower_dir / "agent-marketplace.json").exists()
            })
        except Exception as e:
            self._send_json({"status": "ERROR", "error": str(e), "mcps": 0, "agents": 0})

    def _handle_oracle(self):
        """POST /api/oracle — Proxies Gemini API call (keeps key server-side)"""
        content_length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(content_length)) if content_length else {}
        prompt_type = body.get("promptType", "kapso")

        if not GEMINI_API_KEY:
            self._send_json({"error": "GEMINI_API_KEY not set. Export it: export GEMINI_API_KEY=your_key"}, 500)
            return

        prompt_text = ORACLE_PROMPTS.get(prompt_type, ORACLE_PROMPTS["kapso"])

        # Call Gemini API
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key={GEMINI_API_KEY}"
            payload = json.dumps({
                "contents": [{"parts": [{"text": prompt_text}]}],
                "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]}
            }).encode()

            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())

            text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

            result = {"text": text}

            # Try TTS (optional, non-blocking)
            try:
                tts_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key={GEMINI_API_KEY}"
                tts_payload = json.dumps({
                    "contents": [{"parts": [{"text": f"D'une voix majestueuse, profonde et rapide : {text[:500]}"}]}],
                    "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Fenrir"}}}},
                    "model": "gemini-2.5-flash-preview-tts"
                }).encode()

                tts_req = urllib.request.Request(tts_url, data=tts_payload, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(tts_req, timeout=30) as tts_resp:
                    tts_data = json.loads(tts_resp.read())
                    audio = tts_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("inlineData", {}).get("data", "")
                    if audio:
                        result["audio"] = audio
            except Exception:
                pass  # TTS failure is non-fatal

            self._send_json(result)

        except Exception as e:
            self._send_json({"error": str(e)}, 500)

    def log_message(self, format, *args):
        """Custom log format"""
        print(f"🔮 [{datetime.now().strftime('%H:%M:%S')}] {args[0]}")


def main():
    port = int(os.environ.get("NEXUS_PORT", "5187"))
    server = HTTPServer(("0.0.0.0", port), NexusAPIHandler)

    print(f"""
╔═══════════════════════════════════════════════════╗
║   NEXUS v5.0 — Backend API Server                ║
║   TARDIS • KAPSO • ALPEIRON                       ║
╚═══════════════════════════════════════════════════╝

🔮 Server running on http://localhost:{port}

Endpoints:
  GET  /api/health           Health check
  GET  /api/seesaw           Seesaw engine status
  POST /api/seesaw/harvest   Feed error into seesaw
  GET  /api/energon          Energon ledger + vault
  GET  /api/slots            32 thermal ratchet slots
  GET  /api/agents           NFT agent metadata
  GET  /api/secondme         Second-Me AI twin status
  POST /api/oracle           Gemini AI proxy

{'✅ GEMINI_API_KEY is set' if GEMINI_API_KEY else '⚠️  GEMINI_API_KEY not set — oracle will fail'}
""")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Nexus server stopped.")
        server.server_close()


if __name__ == "__main__":
    main()
