#!/bin/bash
set -e

echo "==================================================="
echo "  ASE Workbook - Android APK Build Automation Tool"
echo "==================================================="
echo

echo "[1/3] Installing NPM Dependencies..."
npm install

echo
echo "[2/3] Building Web assets with Vite..."
npm run build

echo
echo "[3/3] Syncing assets with Capacitor Android..."
npx cap sync android

echo
echo "==================================================="
echo "  SUCCESS: Web assets synchronized to Android project!"
echo "==================================================="
echo
echo "We will now open the android project in Android Studio."
echo "Inside Android Studio, follow these steps to build the APK:"
echo "1. Wait for Gradle Sync to complete."
echo "2. Click 'Build' in the top menu bar."
echo "3. Select 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'."
echo "4. After completion, click 'Locate' to find your real, physical APK!"
echo
read -p "Press Enter to open Android Studio..."
npx cap open android
