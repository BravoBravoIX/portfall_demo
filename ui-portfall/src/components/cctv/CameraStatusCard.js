import React from 'react';

export default function CameraStatusCard() {
  // Sample camera status data
  const cameras = [
    { id: 1, name: 'Camera 1 – North Gate', status: 'Online', lastPing: '5s ago', recording: true },
    { id: 2, name: 'Camera 2 – Dockside', status: 'Online', lastPing: '3s ago', recording: true },
    { id: 3, name: 'Camera 3 – Admin Building', status: 'Online', lastPing: '7s ago', recording: true },
    { id: 4, name: 'Camera 4 – Storage Yard', status: 'Online', lastPing: '4s ago', recording: true },
    { id: 5, name: 'Camera 5 – Engine Room', status: 'Offline', lastPing: '4h ago', recording: false },
    { id: 6, name: 'Camera 6 – Crew Quarters', status: 'Degraded', lastPing: '15s ago', recording: true },
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">Camera Status</h3>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camera</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Ping</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recording</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cameras.map((camera) => (
              <tr key={camera.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{camera.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    camera.status === 'Online' ? 'bg-green-100 text-green-800' : 
                    camera.status === 'Degraded' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {camera.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{camera.lastPing}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {camera.recording ? (
                    <span className="inline-flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
                      Recording
                    </span>
                  ) : 'Not Recording'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}