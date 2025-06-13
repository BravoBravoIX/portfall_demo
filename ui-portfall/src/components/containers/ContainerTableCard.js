import React from 'react';
import useContainerMessages from './useContainerMessages';
import { useGlobalState } from '../../state/globalState';

export default function ContainerTableCard() {
  const { containerGrid, systemAlarmTriggered } = useContainerMessages();
  const { containerAnimationComplete } = useGlobalState();
  
  // Generate table rows based on system status
  const generateTableRows = () => {
    if (!systemAlarmTriggered) {
      // Default static rows when system is normal
      return [
        { id: 'CTN-0923', dock: '8A', status: '⚠️ Misrouted', routing: 'Expected 3B' },
        { id: 'CTN-1141', dock: '—', status: '🔁 Retry', routing: 'Scheduling token lost' },
        { id: 'CTN-3012', dock: '5C', status: '✅ OK', routing: 'Correct' }
      ];
    }
    
    // When system is in alarm state, generate dynamic rows based on container grid
    const errorContainers = containerGrid
      .filter(container => container.status === 'error')
      .slice(0, 5); // Show up to 5 error containers
    
    return errorContainers.map(container => {
      // Generate error details based on container ID
      const issues = [
        'ALERT: Configuration altered',
        'Security breach detected',
        'Authentication bypass attempt',
        'Manifest verification failed',
        'Routing authorization compromised',
        'Hash mismatch - integrity failure',
        'Checksum validation error',
        'Access control violation'
      ];
      
      // Deterministic but seemingly random issue selection
      const issueIndex = parseInt(container.id.charCodeAt(0) + container.id.charCodeAt(1)) % issues.length;
      
      return {
        id: `CTN-${container.id}`,
        dock: `${container.id[0]}${container.id[1]}`,
        status: '🚨 CRITICAL',
        routing: issues[issueIndex]
      };
    });
  };
  
  const tableRows = generateTableRows();
  
  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Live Container Assignment</h3>
        
        {systemAlarmTriggered && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className={`h-2 w-2 mr-1 bg-red-500 rounded-full ${!containerAnimationComplete ? 'animate-pulse' : ''}`}></span>
            ROUTING FAILURE
          </span>
        )}
      </div>
      
      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 border">Container ID</th>
            <th className="px-2 py-1 border">Dock</th>
            <th className="px-2 py-1 border">Status</th>
            <th className="px-2 py-1 border">Routing</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className={systemAlarmTriggered ? 'bg-red-50' : ''}>
              <td className="px-2 py-1 border">{row.id}</td>
              <td className="px-2 py-1 border">{row.dock}</td>
              <td className="px-2 py-1 border">{row.status}</td>
              <td className="px-2 py-1 border">{row.routing}</td>
            </tr>
          ))}
          
          {/* Show additional warning when in alarm state */}
          {systemAlarmTriggered && (
            <tr className="bg-red-100">
              <td colSpan="4" className="px-2 py-1 border text-center text-red-700 font-medium">
                Multiple routing configuration errors detected - system integrity compromised
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}