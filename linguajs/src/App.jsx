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

import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState } from 'react';
import Console from './components/Console.jsx';
import GlossaEditor from './components/GlossaEditor.jsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});

function App() {

  const [consolePanelHeight, setConsolePanelHeight] = useState(340);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      <Box display="flex" flexDirection="column" height="100vh">

        <GlossaEditor consolePanelHeight={consolePanelHeight}/>

        <Console consolePanelHeight={consolePanelHeight} setConsolePanelHeight={setConsolePanelHeight} />
        
      </Box>
    </ThemeProvider>

  )
}

export default App
