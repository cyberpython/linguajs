Lingua JS
=========

An online code editor with embedded interpreter for the educational ΓΛΩΣΣΑ 
programming language.

The editor is based on VSCode's Monaco Editor.

## Build dependencies

- NodeJS 22.0.0 with NPM 10.5.1

- See `../glossa-interpreter-js/README.md` for its build dependencies.

## Build instructions

Run `./build.sh`. This will build `../glossa-interpreter-js`, copy the generated
interpreter source files and then build this application.

The resulting application can be found in the `dist` folder (a web server is 
required to serve it).

