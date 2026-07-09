@echo off
echo ===================================================
echo   ASE Workbook - Android APK Build Automation Tool
echo ===================================================
echo.
echo [1/3] Installing NPM Dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install NPM packages. Please make sure Node.js is installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Building Web assets with Vite...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error: Web build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Syncing assets with Capacitor Android...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo Error: Capacitor sync failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo   SUCCESS: Web assets synchronized to Android project!
echo ===================================================
echo.
echo We will now open the android project in Android Studio.
echo Inside Android Studio, follow these steps to build the APK:
echo 1. Wait for Gradle Sync to complete.
echo 2. Click "Build" in the top menu bar.
echo 3. Select "Build Bundle(s) / APK(s)" -> "Build APK(s)".
echo 4. After completion, a notification will appear. Click "Locate" to find your real, physical APK!
echo.
pause
call npx cap open android
