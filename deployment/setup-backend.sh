#!/bin/bash
# =============================================================================
#  SETUP-BACKEND.sh  —  First-time Python environment setup
#  Run once before doing any build. Works on Mac and Linux.
# =============================================================================
set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

cd "$(dirname "$0")/.."

echo -e "${CYAN}=== Data Weaver Backend Setup ===${NC}"

PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then
  echo -e "${RED}Python not found. Install Python 3.10+ from https://python.org${NC}"
  exit 1
fi

echo "Python: $($PYTHON --version)"

cd backend
echo -e "${CYAN}Creating virtual environment...${NC}"
$PYTHON -m venv venv

echo -e "${CYAN}Activating venv and installing dependencies...${NC}"
source venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt

echo ""
echo -e "${GREEN}✅  Backend setup complete!${NC}"
echo ""
echo "Now run one of the following:"
echo "  Dev mode:       npm run electron:dev"
echo "  Build Mac:      deployment/build-mac.sh"
