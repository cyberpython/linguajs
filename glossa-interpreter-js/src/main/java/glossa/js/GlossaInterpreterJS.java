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
package glossa.js;

import java.io.IOException;
import java.util.concurrent.ArrayBlockingQueue;

import org.teavm.jso.JSClass;
import org.teavm.jso.JSExport;
import org.teavm.jso.JSModule;
import org.teavm.jso.JSObject;
import org.teavm.jso.JSTopLevel;

import glossa.interpreter.Interpreter;
import glossa.interpreter.InterpreterListener;
import glossa.interpreter.io.IInputProvider;
import glossa.interpreter.io.IOutputPrinter;
import glossa.interpreter.symboltable.SymbolTable;

public class GlossaInterpreterJS {


    @JSClass
    @JSModule("./outputHandler.js")
    public class OutputHandler implements JSObject {

        @JSTopLevel
        public static native void print(String text);

        @JSTopLevel
        public static native void println(String text);

        @JSTopLevel
        public static native void newline();
        
    }

    
    
    private static class InputQueue implements IInputProvider {

        private ArrayBlockingQueue<String> inputQueue;

        public InputQueue() {
            this.inputQueue = new ArrayBlockingQueue<String>(100);
        }

        public void clear(){
            this.inputQueue.clear();
        }

        public void write(String s){
            try{
                inputQueue.put(s);
            }catch(InterruptedException e){
            }
        }


        @Override
        public String readLine() throws IOException {
            try{
                return inputQueue.take();
            }catch(InterruptedException e){
                return "";
            }
        }
    }

    private static class ConsoleOutputPrinter implements IOutputPrinter {
        
        @Override
        public void print(String text) {
            OutputHandler.print(text);
        }

        @Override
        public void println(String text) {
            OutputHandler.println(text);
        }

        @Override
        public void println() {
            OutputHandler.newline();
        }
    }

    private static InputQueue inputQueue = new InputQueue();
    private static ConsoleOutputPrinter consoleOutPrinter = new ConsoleOutputPrinter();
    private static ConsoleOutputPrinter consoleErrPrinter = new ConsoleOutputPrinter();


    private GlossaInterpreterJS() {
    }

    @JSExport
    public static void submitInputLine(String line){
        inputQueue.write(line);
    }

    
    @JSExport
    public static void runProgram(String code) {

        inputQueue.clear();

        Thread t = new Thread(() -> {
            Interpreter inter = new Interpreter(code, consoleOutPrinter, consoleErrPrinter, consoleOutPrinter, consoleErrPrinter, inputQueue);

            inter.addListener(new InterpreterListener() {

                @Override
                public void parsingAndSemanticAnalysisFinished(Interpreter arg0, boolean arg1) {
                }
                
                @Override
                public void executionPaused(Interpreter sender, Integer line, Boolean wasPrintStatement){
                    sender.resume();
                }

                @Override
                public void executionStarted(Interpreter sender) {

                }

                @Override
                public void executionStopped(Interpreter sender) {

                }

                @Override
                public void stackPopped() {
                }

                @Override
                public void stackPushed(SymbolTable newSymbolTable) {
                }

                @Override
                public void readStatementExecuted(Interpreter arg0, Integer arg1) {
                }

                @Override
                public void runtimeError() {
                }
            });

            if (inter.parseAndAnalyzeSemantics(false)) {
                inter.execSync(false);                
            } 
        });
        

        t.start();
        
    }

}
