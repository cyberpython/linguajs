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

import { Box, Button, Menu, MenuItem, Paper, TextField } from '@mui/material';
import { Resizable } from 're-resizable';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { registerOnNewline, registerOnPrint, registerOnPrintln } from '../interpreter/outputHandler';
import { submitInputLine } from '../interpreter/glossa-interpreter';

function Console( { consolePanelHeight, setConsolePanelHeight } ) {
  
  const [menuPosition, setMenuPosition] = useState(null);
  
  const [consoleText, setConsoleText] = useState("");
  const [inputText, setInputText] = useState("");

  const textFieldRef = useRef(null);
  const consoleFieldRef = useRef(null);

  const submit = () => {
    appendText(inputText+"\n");
    submitInputLine(inputText);
    setInputText("");
  };

  const appendText = useCallback((text) => {
    setConsoleText((prevConsoleText) => prevConsoleText + text);
  }, [setConsoleText]);

  // Handle right-click to open custom context menu
  const handleContextMenu = (event) => {
    console.log("CONTEXT");
    event.preventDefault();
    setMenuPosition({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  // Handle menu close
  const handleCloseMenu = () => {
    setMenuPosition(null);
  };

  // Menu actions
  const handleCut = () => {
    if(textFieldRef.current){
      const input = textFieldRef.current.querySelector("textarea");
      if (input) {
        const selectedText = input.value.substring(
          input.selectionStart,
          input.selectionEnd
        );
        if (selectedText) {
          navigator.clipboard.writeText(selectedText);
          const before = input.value.substring(0, input.selectionStart);
          const after = input.value.substring(input.selectionEnd);
          setConsoleText(before + after);
        }
      }
      handleCloseMenu();
    }
  };

  const handleCopy = () => {
    if(textFieldRef.current){
      const input = textFieldRef.current.querySelector("textarea");
      if (input) {
        const selectedText = input.value.substring(
          input.selectionStart,
          input.selectionEnd
        );
        if (selectedText) {
          navigator.clipboard.writeText(selectedText);
        }
      }
      handleCloseMenu();
    }
  };

  const handleClear = () => {
    setConsoleText("");
    handleCloseMenu();
  };

  // Utility functions to determine menu item states
  const hasSelection = () => {
    if(textFieldRef.current){
      const input = textFieldRef.current.querySelector("textarea");
      return input && input.selectionStart !== input.selectionEnd;
    }
  };

  const isClipboardNotEmpty = async () => {
    const clipboardText = await navigator.clipboard.readText();
    return clipboardText.length > 0;
  };



  useEffect(() => {
    registerOnPrint((text)=>{ 
      appendText(text); 
    });

    registerOnPrintln((text)=>{ 
      appendText(text+"\n"); 
    });

    registerOnNewline(()=>{ 
      appendText("\n"); 
    });
  }, [appendText]);


  useEffect(() => {
    if (consoleFieldRef.current) {
      const concoleElement = consoleFieldRef.current;
      concoleElement.scrollTop = concoleElement.scrollHeight;
    }
  }, [consoleText, consoleFieldRef]);

  return (
    <Resizable
      size={{ height: consolePanelHeight, width: '100%' }}
      onResizeStop={(e, direction, ref, d) => {
        setConsolePanelHeight(consolePanelHeight + d.height);
      }}
      enable={{ top: true }}
    >
      <Paper elevation={3} sx={{ height: consolePanelHeight, display: 'flex', flexDirection: 'column' }}
        // onContextMenu={handleContextMenu}
      >
        <Box flexGrow={1} p={'8px'}
          // onContextMenu={handleContextMenu}
        >
          <Box 
            sx={{border: '1px solid #777', overflow: 'scroll', height: consolePanelHeight-64}}
            ref={consoleFieldRef}
            // onContextMenu={handleContextMenu}
          >
            <TextField
              multiline
              // disabled
              fullWidth
              value={consoleText}
              onChange={(e) => setConsoleText(e.target.value)}
              onContextMenu={handleContextMenu}
              ref={textFieldRef}
              slotProps={{
                input:{
                  readOnly: true
                }
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline':{
                  border: 'none!important'
                },
                '& .MuiInputBase-input':{
                  fontFamily: 'Source Code Pro, monospace',
                  fontSize: '16px',
                  color: '#ddd!important',
                  height: consolePanelHeight - 100,
                  minHeight: consolePanelHeight - 100,
                },
                '& .MuiInputBase-input.Mui-disabled':{
                  color: '#ddd!important',
                  '-webkit-text-fill-color': 'inherit'
                }
              }} 
            />
            <Menu
              open={menuPosition !== null}
              onClose={handleCloseMenu}
              anchorReference="anchorPosition"
              anchorPosition={
                menuPosition
                  ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
                  : undefined
              }
            >
              <MenuItem
                onClick={handleCut}
                disabled={!hasSelection()}
              >
                Αποκοπή
              </MenuItem>
              <MenuItem
                onClick={handleCopy}
                disabled={!hasSelection()}
              >
                Αντιγραφή
              </MenuItem>
              <MenuItem onClick={handleClear}>Καθαρισμός</MenuItem>
            </Menu>
          </Box>
          <Box paddingY={'8px'} 
            sx={{
              height: 48,
              display: "flex",
              alignItems: "center",
              gap: 1, // Space between textfield and button
            }}
          >
            <TextField 
              fullWidth 
              value={inputText} 
              onChange={(evt)=>{setInputText(evt.target.value);}}
              onKeyDown={(evt)=>{if(evt.key == 'Enter'){submit();}}}
              sx={{
                flexGrow: 1, 
                '& .MuiInputBase-root':{
                  height: '32px', 
                  minHeight: '32px'
                }
              }}
            />
            <Button 
              variant='outlined'
              sx={{
                whiteSpace: "nowrap", 
                height: '32px', 
                minHeight: '32px'
              }}
              onClick={()=>{submit();}}
            >
              Υποβολή
            </Button>
          </Box>
        </Box>
      </Paper>
    </Resizable>
  )
}

export default Console