#!/bin/bash

echo "🚀 ===== ALEXANDRIA SYSTEMS DEPLOYMENT ====="
echo ""

# Terminal 1: Virtual Desktop
echo "📦 Installing Virtual Desktop dependencies..."
cd /home/ichigo/alexandria/ADAM/ui/virtual-desktop
npm install > /dev/null 2>&1 &
VD_PID=$!

# Terminal 2: Straight-Pipe OS
echo "📦 Installing Straight-Pipe OS dependencies..."
cd /home/ichigo/alexandria/ADAM/ui/straight-pipe-os
npm install > /dev/null 2>&1 &
SP_PID=$!

wait $VD_PID $SP_PID
echo "✅ Dependencies installed"
echo ""

echo "🔥 Launching Virtual Desktop on http://localhost:3006"
cd /home/ichigo/alexandria/ADAM/ui/virtual-desktop
npm run dev > /tmp/vd.log 2>&1 &
echo "   PID: $!"

echo "🔥 Launching Straight-Pipe OS on http://localhost:3007"
cd /home/ichigo/alexandria/ADAM/ui/straight-pipe-os
npm run dev > /tmp/sp.log 2>&1 &
echo "   PID: $!"

echo ""
echo "✨ ===== ALEXANDRIA DOUBLE BANKAI ACTIVATED ====="
echo ""
echo "🎮 Virtual Desktop:  http://localhost:3012"
echo "🔥 Straight-Pipe OS: http://localhost:3013"
echo "🧠 ADAM Backend:     http://localhost:5000"
echo "⚡ Agent Zero:       http://localhost:50001"
echo ""
echo "Logs:"
echo "  tail -f /tmp/vd.log"
echo "  tail -f /tmp/sp.log"
