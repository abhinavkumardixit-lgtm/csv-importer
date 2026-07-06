import React, { useState } from 'react';
import { ImportResult } from '../types';
import { CheckCircle, XCircle, ArrowLeft, Download, AlertTriangle } from 'lucide-react';

interface ResultStepProps {
  result: ImportResult;
  onReset: () => void;
}

export function ResultStep({ result, onReset }: ResultStepProps) {
  const [activeTab, setActiveTab] = useState<'success' | 'skipped'>('success');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'GOOD_LEAD_FOLLOW_UP': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Good Lead</span>;
      case 'DID_NOT_CONNECT': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">No Connect</span>;
      case 'BAD_LEAD': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Bad Lead</span>;
      case 'SALE_DONE': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Sale Done</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Unknown</span>;
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Import Complete</h2>
          <p className="text-slate-500 mt-1">AI extraction finished successfully.</p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Import Another File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4 cursor-pointer hover:border-green-300 transition-colors" onClick={() => setActiveTab('success')}>
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Successfully Parsed</p>
            <p className="text-3xl font-semibold text-slate-900">{result.totalImported}</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4 cursor-pointer hover:border-amber-300 transition-colors" onClick={() => setActiveTab('skipped')}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Skipped Records</p>
            <p className="text-3xl font-semibold text-slate-900">{result.totalSkipped}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-4 border-b border-slate-200">
        <button
          className={`pb-3 text-sm font-medium border-b-2 transition-colors \${activeTab === 'success' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('success')}
        >
          Success ({result.totalImported})
        </button>
        {result.totalSkipped > 0 && (
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors \${activeTab === 'skipped' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('skipped')}
          >
            Skipped ({result.totalSkipped})
          </button>
        )}
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
        <div className="overflow-auto flex-1">
          {activeTab === 'success' ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Name</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Email</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Phone</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Source</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {result.successfullyParsed.map((record, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">{record.name || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{record.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {record.country_code} {record.mobile_without_country_code || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {record.crm_status ? getStatusBadge(record.crm_status) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">{record.data_source || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 min-w-[200px] truncate max-w-xs">{record.crm_note || '-'}</td>
                  </tr>
                ))}
                {result.successfullyParsed.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      No records were successfully imported.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">Reason</th>
                  <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Original Data Snapshot</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {result.skippedRecords.map((skip, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap text-amber-700 font-medium">
                      {skip.reason}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                      {JSON.stringify(skip.original).substring(0, 100)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
