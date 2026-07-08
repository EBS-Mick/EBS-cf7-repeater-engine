#!/bin/sh

cat \
src/banner.js \
src/engine.js \
src/config.js \
src/init.js \
> js/cf7-repeater-engine.js

echo "Build completed."