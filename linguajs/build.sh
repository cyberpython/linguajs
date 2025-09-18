#!/bin/bash

cd ../glossa-interpreter-js
./gradlew clean generateJavaScript
cd ../linguajs
cp -f ../glossa-interpreter-js/src/main/js/outputHandler.js ./src/interpreter/outputHandler.js
cp -f ../glossa-interpreter-js/build/generated/teavm/js/glossa-interpreter.js ./src/interpreter/glossa-interpreter.js
npm run build

