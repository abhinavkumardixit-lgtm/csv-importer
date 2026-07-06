import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType } from 'lucide-react';
import Papa from 'papaparse';

interface UploadStepProps {
  onDataParsed: (data: any[]) => void;
}

export function UploadStep({ onDataParsed }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length && results.data.length === 0) {
          setError('Failed to parse CSV. Please ensure it is valid.');
          return;
        }
        onDataParsed(results.data);
      },
      error: (err) => {
        setError(err.message);
      }
    });
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Upload CSV Data</h2>
        <p className="text-slate-500 mt-2">Import leads from any CRM export or spreadsheet format.</p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors \${
          isDragging ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">Drag & drop your CSV here</p>
            <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
          </div>
        </div>
        
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileInputChange}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 rounded-lg flex items-start space-x-2">
          <FileType className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="mt-8 border-t border-slate-200 pt-8">
        <h3 className="text-sm font-medium text-slate-900 mb-4">Supported formats include:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-500 text-center">
          <div className="p-3 bg-slate-50 rounded-lg">Facebook Leads</div>
          <div className="p-3 bg-slate-50 rounded-lg">Google Ads</div>
          <div className="p-3 bg-slate-50 rounded-lg">Real Estate CRMs</div>
          <div className="p-3 bg-slate-50 rounded-lg">Custom Sheets</div>
        </div>
      </div>
    </div>
  );
}
