import React from 'react';

export default function CCTVTimelineCard() {
  // Sample timeline events
  const events = [
    { id: 1, time: '12:30 PM', camera: 'Camera 1', event: 'Person Detected', description: 'Person detected at north gate entrance' },
    { id: 2, time: '12:15 PM', camera: 'Camera 3', event: 'Connection Lost', description: 'Camera connection lost for 2 minutes' },
    { id: 3, time: '11:45 AM', camera: 'Camera 5', event: 'Connection Restored', description: 'Camera back online after maintenance' },
    { id: 4, time: '11:20 AM', camera: 'Camera 2', event: 'Motion Detected', description: 'Motion detected in restricted area' },
  ];

  // Event icon and color mapping
  const getEventIcon = (eventType) => {
    switch(eventType) {
      case 'Person Detected':
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
            <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'Connection Lost':
        return (
          <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
            <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.07m-4.95.005l-1.414 1.414m0-4.242L9.878 6.42m4.242 4.242l1.414 1.414m-5.656 0l1.414-1.414m0 4.242l-1.414-1.414m4.242-4.242l-1.414-1.414" />
            </svg>
          </div>
        );
      case 'Connection Restored':
        return (
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
            <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'Motion Detected':
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
            <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">CCTV Timeline</h3>
      </div>
      <div className="p-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {events.map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== events.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      {getEventIcon(event.event)}
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          {event.time} • <span className="font-medium text-gray-900">{event.camera}</span>
                        </p>
                        <p className="font-medium text-gray-900 mt-1">{event.event}</p>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <div className="mt-2">
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          View Recording
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}