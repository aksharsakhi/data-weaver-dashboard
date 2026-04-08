@echo off
REM =============================================================================
REM  BUILD-WIN.bat  —  Data Weaver Desktop App Builder (Windows)
REM  Double-click this file to build a .exe installer
REM =============================================================================

echo ========================================
echo   Data Weaver — Windows Build Script
echo ========================================

REM ── Move to project root (one level up from deployment\) ─────────────────
cd /d "%~dp0\.."

echo.
echo [1/5] Checking Node.js...
node --version
IF ERRORLEVEL 1 (
  echo ERROR: Node.js not found. Download from https://nodejs.org
  pause
  exit /b 1
)

echo.
echo [2/5] Checking Python...
python --version
IF ERRORLEVEL 1 (
  echo ERROR: Python not found. Download from https://python.org
  pause
  exit /b 1
)

echo.
echo [3/5] Setting up backend Python venv...
cd backend
IF NOT EXIST "venv\" (
  python -m venv venv
)
call venv\Scripts\activate.bat
pip install --upgrade pip -q
pip install -r requirements.txt -q
call venv\Scripts\deactivate.bat
cd ..

echo.
echo [4/5] Installing Node dependencies...
call npm install --legacy-peer-deps
IF ERRORLEVEL 1 (
  echo ERROR: npm install failed
  pause
  exit /b 1
)

echo.
echo [5/5] Building Windows .exe installer...
call npm run electron:build:win
IF ERRORLEVEL 1 (
  echo ERROR: Build failed. Check the output above.
  pause
  exit /b 1
)

echo.
echo ============================================
echo  BUILD COMPLETE!
echo  Installer is in: dist-electron\
echo  Look for:        Data Weaver Setup *.exe
echo ============================================
echo.
echo Send the .exe to any Windows PC.
echo They just double-click to install — no setup needed!
echo.
pause
