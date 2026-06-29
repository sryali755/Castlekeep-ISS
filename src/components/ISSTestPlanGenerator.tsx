'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, Download, FileSpreadsheet } from '@/lib/icons';

interface GenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
}

export default function ISSTestPlanGenerator() {
  const [issNumber, setIssNumber] = useState('ISS0004636');
  const [steps, setSteps] = useState<GenerationStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const generateTestPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issNumber.trim()) {
      setError('Please enter an ISS ticket number');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess(false);
    setSteps([]);

    const initialSteps: GenerationStep[] = [
      { id: 'fetch', name: 'Fetch Offers from CastleKeep', status: 'pending' },
      { id: 'analyze', name: 'Analyze with Writer AI', status: 'pending' },
      { id: 'process', name: 'Process & Classify Offers', status: 'pending' },
      { id: 'generate', name: 'Generate Test Cases', status: 'pending' },
      { id: 'enrich', name: 'Enrich with AI Insights', status: 'pending' },
      { id: 'excel', name: 'Generate Excel Workbook', status: 'pending' },
      { id: 'download', name: 'Ready for Download', status: 'pending' },
    ];
    setSteps(initialSteps);

    try {
      for (let i = 0; i < initialSteps.length; i++) {
        const stepId = initialSteps[i].id;
        setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, status: 'running' } : s)));
        await new Promise((resolve) => setTimeout(resolve, 1500 + i * 300));
        setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, status: 'completed' } : s)));
      }

      // Call the orchestration API
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestNumber: issNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate test plan');
      }

      // Download the Excel file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Atlas_Test_Plan_${issNumber}_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setSteps((prev) =>
        prev.map((s) => (s.status === 'running' ? { ...s, status: 'failed', error: errorMsg } : s))
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-700 to-fuchsia-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 p-8 rounded-xl bg-gradient-to-r from-purple-700 to-purple-600 border-2 border-fuchsia-400 shadow-2xl">
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center gap-3">
            <FileSpreadsheet size={40} className="text-fuchsia-300" />
            ISS Test Plan Generator
          </h1>
          <p className="text-xl text-fuchsia-100">
            Type an ISS ticket number → Get a ready-to-execute Excel test plan in seconds
          </p>
        </div>

        <form onSubmit={generateTestPlan} className="mb-8">
          <div className="bg-purple-800/50 rounded-xl p-6 border-2 border-fuchsia-400 shadow-lg">
            <label className="text-fuchsia-200 font-semibold mb-3 block">ISS Ticket Number</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={issNumber}
                onChange={(e) => setIssNumber(e.target.value.toUpperCase())}
                placeholder="e.g., ISS0004636"
                className="flex-1 px-4 py-4 bg-purple-900/60 border-2 border-fuchsia-400 rounded-lg text-white placeholder-purple-300 focus:outline-none text-lg font-semibold"
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={isGenerating || !issNumber.trim()}
                className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white rounded-lg font-bold disabled:opacity-50 transition flex items-center gap-2 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Generate Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-900/20 border-2 border-red-400 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white">❌ Generation Failed</h3>
              <p className="text-red-200 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border-2 border-green-400 rounded-xl p-4 mb-8 flex items-start gap-3">
            <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white">✅ Test Plan Generated Successfully!</h3>
              <p className="text-green-200 text-sm mt-1">Excel file downloaded and ready to use.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
