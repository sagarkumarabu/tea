@echo off
setlocal

python -m pip install -r requirements.txt

python -m PyInstaller --noconfirm --clean ^
  --name CubicleApp ^
  --windowed ^
  --onefile ^
  --icon="icon.ico" ^
  --add-data "index.html;." ^
  --add-data "style.css;." ^
  --add-data "main.js;." ^
  --add-data "calculate.html;." ^
  --add-data "locker.html;." ^
  --add-data "login.html;." ^
  --add-data "cube.html;." ^
  --add-data "upp.webp;." ^
  --hidden-import=webview ^
  --hidden-import=flask ^
  app.py

echo.
echo Build complete: dist\CubicleApp.exe
echo Database file cubicle_data.db is created next to the exe when you save data.
pause
