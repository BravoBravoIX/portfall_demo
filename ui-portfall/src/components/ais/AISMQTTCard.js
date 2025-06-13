import React from 'react';
import useAISMessages from './useAISMessages';

export default function AISMQTTCard() {
  const { raw } = useAISMessages();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">AIS Message Monitor</h3>
      </div>
      
      <div className="p-4">
        {raw.length === 0 ? (
          <div className="text-gray-500">No AIS messages received yet.</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {raw.map((inject, index) => (
              <div key={index} className="p-4 border rounded bg-white shadow">
                <div className="text-sm text-gray-400">Received AIS Inject:</div>
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(inject, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}