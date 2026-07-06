import React, { useState } from 'react';
import { UploadStep } from './components/UploadStep';
import { PreviewStep } from './components/PreviewStep';
import { ResultStep } from './components/ResultStep';
import { ImportResult } from './types';
import { Database } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleDataParsed = (data: any[]) => {
    setParsedData(data);
    setStep(2);
    setGlobalError(null);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    setGlobalError(null);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedData }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process import on server');
      }
      
      setResult(data);
      setStep(3);
    } catch (err: any) {
      setGlobalError(err.message || 'An unexpected error occurred during AI processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setParsedData([]);
    setResult(null);
    setGlobalError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">GrowEasy<span className="text-emerald-600">.ai</span></span>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center \${step === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>1</span>
            <span className="hidden sm:inline text-slate-600">Upload</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-slate-300"></div>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center \${step === 2 ? 'bg-emerald-600 text-white' : (step > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400')}`}>2</span>
            <span className={`hidden sm:inline \${step >= 2 ? 'text-slate-600' : 'text-slate-400'}`}>Preview</span>
          </div>
          <div className="w-4 sm:w-8 h-px bg-slate-300"></div>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center \${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
            <span className={`hidden sm:inline \${step === 3 ? 'text-slate-600' : 'text-slate-400'}`}>Result</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto p-6 sm:p-8 flex flex-col items-center justify-start min-w-0">
        {globalError && (
          <div className="w-full mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
            <span>{globalError}</span>
            <button onClick={() => setGlobalError(null)} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        )}

        {step === 1 && (
          <UploadStep onDataParsed={handleDataParsed} />
        )}
        
        {step === 2 && (
          <PreviewStep 
            data={parsedData} 
            onBack={() => setStep(1)} 
            onConfirm={handleConfirm}
            isProcessing={isProcessing}
          />
        )}
        
        {step === 3 && result && (
          <ResultStep result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
