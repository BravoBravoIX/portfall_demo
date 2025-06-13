import React, { useState } from 'react';
import useCommsMessages from './useCommsMessages';

export default function CommsMQTTCard() {
  const { commsInjects, allInjects } = useCommsMessages();
  const [showAllInjects, setShowAllInjects] = useState(false);
  
  // Choose which injects to display based on toggle
  const injectsToShow = showAllInjects ? allInjects : commsInjects;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Communications Message Monitor</h3>
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={showAllInjects}
              onChange={() => setShowAllInjects(!showAllInjects)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {showAllInjects ? 'All Messages' : 'Comms Only'}
            </span>
          </label>
        </div>
      </div>
      
      <div className="p-4">
        {injectsToShow.length === 0 ? (
          <div className="text-gray-500">No messages received yet.</div>
        ) : (
          <div className="space-y-2 max-h-[28rem] overflow-y-auto">
            {injectsToShow.map((inject, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded bg-white shadow ${
                  inject.dashboard === 'comms' || inject.dashboard === 'communications' 
                    ? 'border-blue-200' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-400">
                    {inject.dashboard === 'comms' || inject.dashboard === 'communications' 
                      ? 'Comms Inject:' 
                      : `${inject.dashboard || 'System'} Inject:`}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(inject.receivedAt).toLocaleTimeString()}
                  </div>
                </div>
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