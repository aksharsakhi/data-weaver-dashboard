#!/bin/bash
# =============================================================================
#  BUILD-MAC.sh  —  Data Weaver Desktop App Builder (macOS)
#  Run this on your Mac to produce a .dmg installer
# =============================================================================
set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Data Weaver — macOS Build Script${NC}"
echo -e "${CYAN}========================================${NC}"

# ── Move to project root (one level up from deployment/) ──────────────────
cd "$(dirname "$0")/.."

echo -e "\n${CYAN}[1/5] Checking Node.js...${NC}"
node --version || { echo -e "${RED}ERROR: Node.js not found. Install from https://nodejs.org${NC}"; exit 1; }

echo -e "\n${CYAN}[2/5] Checking Python...${NC}"
PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then
  echo -e "${RED}ERROR: Python not found. Install from https://python.org${NC}"
  exit 1
fi
echo "Using Python: $PYTHON"

echo -e "\n${CYAN}[3/5] Setting up backend Python venv...${NC}"
cd backend
if [ ! -d "venv" ]; then
  $PYTHON -m venv venv
fi
source venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt
deactivate
cd ..

echo -e "\n${CYAN}[4/5] Installing Node dependencies...${NC}"
npm install --legacy-peer-deps

echo -e "\n${CYAN}[5/5] Building macOS .dmg installer...${NC}"
npm run electron:build:mac

echo ""
echo -e "${GREEN}✅  Build complete!${NC}"
echo -e "${GREEN}    Installer location: dist-electron/${NC}"
echo -e "${GREEN}    Look for: Data Weaver-*.dmg${NC}"
echo ""
echo "Copy the .dmg to any Mac, open it, drag the app to Applications, and launch."
