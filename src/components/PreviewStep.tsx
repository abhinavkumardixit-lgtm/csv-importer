import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

interface PreviewStepProps {
  data: any[];
  onBack: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function PreviewStep({ data, onBack, onConfirm, isProcessing }: PreviewStepProps) {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="w-full flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Preview Data</h2>
          <p className="text-slate-500 mt-1">Found {data.length} rows to process. Our AI will map these to standard CRM fields.</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            onClick={onBack}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center flex-1 sm:flex-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center flex-1 sm:flex-none shadow-sm"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Confirm & Extract
              </>
            )}
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start space-x-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-emerald-900">AI is mapping your data</h4>
            <p className="text-sm text-emerald-700 mt-1">
              Please wait while we extract and normalize names, emails, phones, and metadata from {data.length} rows...
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 w-16 border-r border-slate-200">
                  Row
                </th>
                {headers.map((header, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 whitespace-nowrap border-r border-slate-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400 font-mono text-xs">
                    {rowIndex + 1}
                  </td>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-slate-700 whitespace-nowrap max-w-xs truncate">
                      {row[header] || <span className="text-slate-300 italic">empty</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
