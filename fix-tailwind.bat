@echo off
echo Fixing Tailwind CSS configuration...
echo.

echo Step 1: Removing cache...
rmdir /s /q .next 2>nul
echo Cache cleared!
echo.

echo Step 2: Reinstalling dependencies...
call npm install
echo.

echo Step 3: All done!
echo.
echo Now run: npm run dev
echo.
pause
