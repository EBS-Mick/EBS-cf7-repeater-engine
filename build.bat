@echo off
set OUTPUT=js\cf7-repeater-engine.js

copy /b ^
src\banner.js+^
src\engine.js+^
src\config.js+^
src\init.js ^
%OUTPUT%

echo Build completed.
pause