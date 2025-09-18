/*
 * MIT License
 * 
 * Copyright (c) 2025 Georgios Migdos
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE. 
 */

import { Editor, useMonaco } from '@monaco-editor/react';
import { AppBar, Box, Button, Toolbar } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog.jsx';
import GlossaTokensProvider from './GlossaTokenizer.js';
import { runProgram } from '../interpreter/glossa-interpreter.js';

function GlossaEditor( { consolePanelHeight } ) {

  const DEFAULT_FILENAME = "Ανώνυμο.gls";

  const [currentFileName, setCurrentFileName] = useState(DEFAULT_FILENAME);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({title: "", message: "", confirmText: "", cancelText: "", onConfirm: ()=>{}});

  const fileInputRef = useRef(null);

  const monaco = useMonaco();

  const setFilenameAndContent = (filename, content) => {
    if(monaco){
      monaco.editor.getModels()[0].setValue(content);
      setCurrentFileName(filename);
      monaco.editor.getEditors()[0].setScrollPosition({scrollTop: 0});
      monaco.editor.getEditors()[0].setPosition({column: 1, lineNumber: 1});
    }
  };

  const handleConfirmNewFile = () => {
    setDialogOpen(false);
    setFilenameAndContent(DEFAULT_FILENAME, "");
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const newFile = () => {
    if(monaco){
      if(monaco.editor.getModels()[0].getValue() !== ""){
        setDialogConfig({
          title: "Επιβεβαίωση",
          message: "Τα περιεχόμενα του επεξεργαστή θα διαγραφούν!\n\nΣυνέχιση;",
          confirmText: "Ναι",
          cancelText: "Όχι",
          onConfirm: handleConfirmNewFile
        })
        setDialogOpen(true);
      } else {
        setFilenameAndContent(DEFAULT_FILENAME, "");
      }
    }
  };

  const openFile = (event) => {
    if(monaco){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilenameAndContent(file.name, e.target.result);
      }
      reader.readAsText(file);
    }
  };

  const handleConfirmOpenFile = () => {
    setDialogOpen(false);
    if(fileInputRef.current){
      fileInputRef.current.click(); // Programmatically trigger the file input click
    }
  };

  const handleOpenFile = () => {
    if(monaco){
      if(monaco.editor.getModels()[0].getValue() !== ""){
        setDialogConfig({
          title: "Επιβεβαίωση",
          message: "Τα περιεχόμενα του επεξεργαστή θα αντικατασταθούν!\n\nΣυνέχιση;",
          confirmText: "Ναι",
          cancelText: "Όχι",
          onConfirm: handleConfirmOpenFile
        })
        setDialogOpen(true);
      } else {
        if(fileInputRef.current){
          fileInputRef.current.click(); // Programmatically trigger the file input click
        }
      }
    }
  };

  const saveFile = () => {
    if(monaco){
      if(monaco.editor.getModels()[0].getValue() !== ""){
        const content = monaco.editor.getModels()[0].getValue();

        // Create a blob from the string
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.href = url;
        a.download = currentFileName;

        // Programmatically click the anchor to trigger the download
        a.click();

        // Clean up the URL object
        URL.revokeObjectURL(url);
      }
    }
  };

  const run = () =>{
    if(monaco){
      runProgram(monaco.editor.getModels()[0].getValue()+"\n");
    }
  };

  useEffect(() => {
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    if (monaco) {

      monaco.editor.defineTheme("GlossaDark", {
        base: "vs-dark", // can be vs, vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
          {
            token: "operator",
            foreground: "ff0000",
            // fontStyle: "bold",
          },
          {
            token: "delimiter",
            foreground: "ffff00",
            // fontStyle: "bold",
          }
        ],
        colors: {}
      });

      // Register a new language
      monaco.languages.register({ id: "Glossa" });
      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider("Glossa", GlossaTokensProvider);
      monaco.editor.setTheme("GlossaDark");

    }
  }, [monaco]);

  return (
    <>
        <AppBar position="static" sx={{ height: '56px'}}>
          <Toolbar variant="dense" sx={{ minHeight: '56px', paddingTop: '8px', paddingBottom: '8px' }} >
            <Button variant="outlined" color="info" onClick={newFile}>Νέο Αρχείο</Button>
            <Button variant="outlined" color="info" sx={{marginLeft: '16px'}} onClick={()=>{handleOpenFile()}}>Άνοιγμα</Button>
            <Button variant="outlined" color="info" onClick={saveFile} sx={{marginLeft: '16px'}}>Αποθήκευση</Button>
            {/* <Button variant="outlined" color="info" sx={{marginLeft: '16px'}}>Εκτύπωση</Button> */}
            <Button variant="contained" color="success" onClick={run} sx={{marginLeft: '16px'}}>Εκτέλεση</Button>
          </Toolbar>
        </AppBar>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }} // Hide the input element
          onChange={openFile}
        />

        <ConfirmationDialog
          open={dialogOpen}
          title={dialogConfig.title}
          message={dialogConfig.message}
          confirmationText={dialogConfig.confirmText}
          cancelationText={dialogConfig.cancelText}
          onConfirm={dialogConfig.onConfirm}
          onCancel={handleCancel}
        />

        {/* Main Pane */}
        <Box flexDirection={'row'} sx={{height: `calc( 100% - ${consolePanelHeight + 56}px )`}}  padding={0}>
          <Editor
            height="100%"
            defaultLanguage="Glossa"
            theme="vs-dark"
            defaultValue=""
            options={{
              fontSize: 16,
              contextmenu: false,
              unicodeHighlight: {
                ambiguousCharacters: false
              }
            }}
          />
        </Box>
    </>
  )
}

export default GlossaEditor