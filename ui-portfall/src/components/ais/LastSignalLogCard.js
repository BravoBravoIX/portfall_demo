import React from 'react';
import useAisState from './useAisState';

export default function LastSignalLogCard() {
  const { signalLogs, aisState } = useAisState();
  
  // Default logs to show when there are no real logs yet
  const defaultLogs = [
    { id: 1, timestamp: '10:42:15', ship: 'Ship_Alpha', event: 'Position Update', status: 'Received' },
    { id: 2, timestamp: '10:40:30', ship: 'Ship_Bravo', event: 'Course Change', status: 'Received' },
    { id: 3, timestamp: '10:39:22', ship: 'Ship_Charlie', event: 'Static Data', status: 'Received' },
    { id: 4, timestamp: '10:38:05', ship: 'Ship_Delta', event: 'Position Update', status: 'Received' },
    { id: 5, timestamp: '10:37:51', ship: 'Ship_Echo', event: 'Position Update', status: 'Received' },
  ];
  
  // Use real logs if we have them, otherwise use defaults
  const logsToDisplay = signalLogs.length > 0 ? signalLogs : defaultLogs;
  
  // Get the timestamp from the most recent log
  const lastUpdated = logsToDisplay.length > 0 ? logsToDisplay[0].timestamp : '10:42:15';
  
  // Map ship IDs to friendly names
  const shipNames = {
    'Ship_Alpha': 'Pacific Voyager',
    'Ship_Bravo': 'Atlantic Carrier',
    'Ship_Charlie': 'Southern Mariner',
    'Ship_Delta': 'Northern Trader', 
    'Ship_Echo': 'Eastern Explorer',
    'ALL VESSELS': 'ALL VESSELS'
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Last Signal Log</h3>
        <span className="text-xs text-gray-500">Last updated: {lastUpdated}</span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
        <div className="divide-y divide-gray-200">
          {logsToDisplay.map((log) => {
            // Determine the status color based on event type
            const isError = log.event.includes('Lost') || log.event.includes('Error');
            const statusColor = isError ? 'text-red-600' : 'text-gray-500';
            
            return (
              <div key={log.id} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">{log.timestamp}</span>
                  <span className={`text-xs ${statusColor}`}>{isError ? 'Error' : 'Received'}</span>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-gray-600">
                    {shipNames[log.ship] || log.ship} - {log.event}
                  </p>
                  {log.details && (
                    <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}