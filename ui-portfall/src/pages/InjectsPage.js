import React from 'react';
import { useGlobalState } from '../state/globalState';

export default function InjectsPage() {
  const { injects } = useGlobalState();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Injects Monitor</h2>

      <div className="space-y-2">
        {injects.length === 0 && (
          <div className="text-gray-500">No injects received yet.</div>
        )}

        {injects.map((inject, index) => (
          <div key={index} className="p-4 border rounded bg-white shadow">
            <div className="text-sm text-gray-400">Received Inject:</div>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(inject, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
