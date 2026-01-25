'use client';

import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, X, Terminal, Loader2 } from 'lucide-react';
import type { Problem } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface CodeEditorProps {
  problem: Problem;
  isOpen: boolean;
  onClose: () => void;
  onSaveSolution: (problemId: string, solution: string) => void;
}

export default function CodeEditor({ problem, isOpen, onClose, onSaveSolution }: CodeEditorProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState(
    problem.solution || `// Solution for: ${problem.title}\n\nfunction solve() {\n  // Write your code here\n  \n}\n\nsolve();`
  );
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    
    // Capture console.log outputs
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Override console methods
    console.log = (...args) => {
      logs.push(args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' '));
    };

    console.error = (...args) => {
      logs.push('❌ Error: ' + args.join(' '));
    };

    console.warn = (...args) => {
      logs.push('⚠️ Warning: ' + args.join(' '));
    };

    try {
      // Create a function from the code and execute it
      const func = new Function(code);
      func();
      
      if (logs.length === 0) {
        logs.push('✓ Code executed successfully (no output)');
      }
    } catch (error: any) {
      logs.push(`❌ Runtime Error: ${error.message}`);
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      setOutput(logs);
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    onSaveSolution(problem.id, code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Code Editor
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{problem.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Editor and Output */}
        <div className="flex-1 grid md:grid-cols-2 gap-4 p-6 overflow-hidden">
          {/* Code Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                JavaScript Editor
              </h3>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Code
                  </>
                )}
              </button>
            </div>
            <div className="flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Console Output */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Console Output
            </h3>
            <div className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-xl overflow-auto">
              {output.length === 0 ? (
                <p className="text-gray-500">Run your code to see output here...</p>
              ) : (
                output.map((line, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-600 mr-2">{'>'}</span>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>💡 Tip: Use console.log() to debug your solution</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
            >
              <Save className="w-4 h-4" />
              Save Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}