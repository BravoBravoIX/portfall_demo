import React from 'react';
import useContainerMessages from './useContainerMessages';

export default function ContainerLogCard() {
  const { logs, systemAlarmTriggered } = useContainerMessages();
  
  // Default log entries to show when no alerts are active
  const defaultLogs = [
    { timestamp: '09:32:44', event: 'CTN-0923 rerouted to dock 8A – mismatch with manifest' },
    { timestamp: '09:33:02', event: 'CTN-1141 lost scheduling token – retrying' },
    { timestamp: '09:33:27', event: 'CTN-3012 scheduled to dock 5C – success' },
    { timestamp: '09:34:00', event: 'Config flag anomaly detected – review required' }
  ];
  
  // Decide which logs to show - real logs once system is triggered, otherwise default
  const logsToShow = systemAlarmTriggered && logs.length > 0 ? logs : defaultLogs;
  
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Container Scheduler Log</h3>
        
        {/* Show alert status when triggered */}
        {systemAlarmTriggered && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="h-2 w-2 mr-1 bg-red-500 rounded-full animate-pulse"></span>
            ALERT
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 space-y-1 font-mono max-h-52 overflow-y-auto">
        {logsToShow.map((log, index) => (
          <p key={log.id || index}>
            [{log.timestamp}] {log.event}
          </p>
        ))}
      </div>
    </div>
  );
}