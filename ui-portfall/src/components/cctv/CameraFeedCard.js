import React, { useState, useEffect } from 'react';

export default function CameraFeedCard({ title, blackoutTriggered }) {
  // Mapping title to image filenames in public folder
  const imageMap = {
    'Camera 1 – North Gate': '/north_gate.png',
    'Camera 2 – Dockside': '/dock_side.png',
    'Camera 3 – Admin Building': '/admin_building.png',
    'Camera 4 – Storage Yard': '/storage_yard.png',
  };

  const [feedState, setFeedState] = useState('normal'); // 'normal', 'flickering', 'noise'
  
  // Handle blackout trigger
  useEffect(() => {
    if (blackoutTriggered) {
      setFeedState('flickering');
      // After 2 seconds of flickering, switch to noise
      const timer = setTimeout(() => {
        setFeedState('noise');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [blackoutTriggered]);

  const imageSrc = imageMap[title] || '';
  const displayImage = feedState === 'noise' ? '/signaltonoise.jpg' : imageSrc;
  const isOnline = feedState === 'normal';
  const statusText = feedState === 'noise' ? 'Signal Lost' : feedState === 'flickering' ? 'Interference' : 'Live';

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <div className="flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
            isOnline ? 'bg-green-500' : 
            feedState === 'flickering' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></span>
          <span className="text-xs text-gray-500">{statusText}</span>
        </div>
      </div>
      <div className="p-0">
        <div className="relative h-64 bg-gray-900">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={title} 
              className={`object-cover w-full h-full ${
                feedState === 'flickering' ? 'animate-pulse' : ''
              }`}
              style={{
                filter: feedState === 'flickering' ? 'brightness(0.5) contrast(1.5)' : 'none',
                animation: feedState === 'flickering' ? 'flicker 0.2s infinite' : 'none'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">No video signal</p>
            </div>
          )}
          
          {/* CSS Animation for flicker effect */}
          <style jsx>{`
            @keyframes flicker {
              0%, 50%, 100% { opacity: 1; }
              25%, 75% { opacity: 0.3; }
            }
          `}</style>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="flex justify-between text-white text-xs">
              <span>{title}</span>
              <span className={feedState === 'noise' ? 'text-red-400' : feedState === 'flickering' ? 'text-yellow-400' : ''}>
                {feedState === 'noise' ? 'SIGNAL LOST' : 
                 feedState === 'flickering' ? 'INTERFERENCE' : 
                 'Live • 12:42:15'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {/* control buttons (unchanged) */}
            <button className="p-1 rounded hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
            Expand
          </button>
        </div>
      </div>
    </div>
  );
}
