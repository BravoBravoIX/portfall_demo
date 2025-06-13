import React from 'react';
import useAisState from './useAisState';

export default function VesselStatusCard() {
  const { shipStates, aisState } = useAisState();
  
  // Define vessel data that updates based on ship visibility state
  const vessels = [
    { 
      id: 'Ship_Alpha', 
      name: 'Pacific Voyager', 
      status: !shipStates.Ship_Alpha || shipStates.Ship_Alpha === 'hidden' ? 'Signal Lost' : 'Active', 
      position: '37.7749° N, 122.4194° W', 
      speed: 12.5 
    },
    { 
      id: 'Ship_Bravo', 
      name: 'Atlantic Carrier', 
      status: !shipStates.Ship_Bravo || shipStates.Ship_Bravo === 'hidden' ? 'Signal Lost' : 'Docked', 
      position: '40.7128° N, 74.0060° W', 
      speed: 0 
    },
    { 
      id: 'Ship_Charlie', 
      name: 'Southern Mariner', 
      status: !shipStates.Ship_Charlie || shipStates.Ship_Charlie === 'hidden' ? 'Signal Lost' : 'Active', 
      position: '32.7157° N, 117.1611° W', 
      speed: 8.2 
    },
    { 
      id: 'Ship_Delta', 
      name: 'Northern Trader', 
      status: !shipStates.Ship_Delta || shipStates.Ship_Delta === 'hidden' ? 'Signal Lost' : 'Active', 
      position: '47.6062° N, 122.3321° W', 
      speed: 10.7 
    },
    { 
      id: 'Ship_Echo', 
      name: 'Eastern Explorer', 
      status: !shipStates.Ship_Echo || shipStates.Ship_Echo === 'hidden' ? 'Signal Lost' : 'Active', 
      position: '34.0522° N, 118.2437° W', 
      speed: 9.3 
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">Vessel Status</h3>
      </div>
      <div className="overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed (kn)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vessels.map((vessel) => (
              <tr key={vessel.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vessel.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vessel.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vessel.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vessel.speed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}