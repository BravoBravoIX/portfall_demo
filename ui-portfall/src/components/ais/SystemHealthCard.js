import React from 'react';
import useAisState from './useAisState';

export default function SystemHealthCard() {
  const { aisState, systemStatus } = useAisState();
  
  // Get current time
  const currentTime = new Date().toLocaleTimeString();
  
  // Adjust the health items based on the current state
  const healthItems = [
    { 
      id: 1, 
      name: 'AIS Receiver', 
      status: aisState === 'all_missing' ? 'Failed' : 'Operational', 
      lastCheck: currentTime 
    },
    { 
      id: 2, 
      name: 'Data Processing', 
      status: aisState === 'all_missing' ? 'Failed' : 
              aisState === 'alpha_missing' ? 'Degraded' : 'Operational', 
      lastCheck: currentTime 
    },
    { 
      id: 3, 
      name: 'Database Connection', 
      status: 'Operational', 
      lastCheck: currentTime 
    },
    { 
      id: 4, 
      name: 'Map Rendering', 
      status: aisState === 'all_missing' ? 'Degraded' : 'Operational', 
      lastCheck: currentTime 
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">System Health</h3>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {healthItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span 
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    item.status === 'Operational' ? 'bg-green-500' : 
                    item.status === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                ></span>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center">
                <span 
                  className={`text-xs mr-2 ${
                    item.status === 'Operational' ? 'text-green-600' : 
                    item.status === 'Degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xs text-gray-500">{item.lastCheck}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-gray-200">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">View detailed diagnostics</a>
        </div>
      </div>
    </div>
  );
}