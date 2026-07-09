@echo off

set OUTPUT=js\cf7-repeater-engine.js

copy /b ^
src\banner.js+^
src\engine.js+^
src\utils.js+^
src\dom.js+^
src\rules.js+^
src\summary.js+^
src\events.js+^
src\observer.js+^
src\debug.js+^
src\validation.js+^
src\config.js+^
src\config-ebs.js+^
src\init.js ^
%OUTPUT%

echo.
echo Build completed.
pause