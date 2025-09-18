glossa-interpreter-js
=====================

## Description

This project provides the required build scripts and environment to transpile 
the [glossa-interpreter](https://github.com/cyberpython/glossa-interpreter) 
interpreter for the educational ΓΛΩΣΣΑ programming language from Java to 
JavaScript using [TeaVM](https://github.com/konsoletyper/teavm).

A JS module that is required to handle interpreter standard output is available
under `src/main/js`.


## Build requirements

JDK 21+

## Build instructions

Run `./gradlew clean generateJavaScript`. The resulting JS library will be 
available under `build/generated/teavm/glossa-interpreter.js`.
