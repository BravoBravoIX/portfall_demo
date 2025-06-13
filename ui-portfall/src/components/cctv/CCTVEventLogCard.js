import React from 'react';

export default function CCTVEventLogCard() {
  // Sample event logs
  const events = [
    { id: 1, time: '12:42:15', camera: 'Camera 2', event: 'Motion Detected', severity: 'Low' },
    { id: 2, time: '12:30:22', camera: 'Camera 1', event: 'Person Detected', severity: 'Medium' },
    { id: 3, time: '12:15:05', camera: 'Camera 3', event: 'Connection Lost', severity: 'High' },
    { id: 4, time: '12:05:58', camera: 'Camera 4', event: 'Motion Detected', severity: 'Low' },
    { id: 5, time: '11:55:12', camera: 'Camera 1', event: 'Recording Started', severity: 'Info' },
    { id: 6, time: '11:45:30', camera: 'Camera 5', event: 'Connection Restored', severity: 'Info' },
  ];

  // Severity badge color mapping
  const severityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-blue-100 text-blue-800',
    Info: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Event Log</h3>
        <span className="text-xs text-gray-500">Last updated: 12:42:15</span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event.id} className="p-3 hover:bg-gray-50">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">{event.time}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${severityColors[event.severity]}`}>
                  {event.severity}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{event.camera}:</span> {event.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All Events
        </button>
      </div>
    </div>
  );
}