import React from 'react';
import CameraFeedCard from './CameraFeedCard';
import useCCTVMessages from './useCCTVMessages';

export default function CCTVGridCard({ feeds }) {
  const { blackoutTriggered } = useCCTVMessages();

  // Default camera configuration if no feeds provided
  const defaultCameras = [
    { id: 1, title: 'Camera 1 – North Gate', status: 'online' },
    { id: 2, title: 'Camera 2 – Dockside', status: 'online' },
    { id: 3, title: 'Camera 3 – Admin Building', status: 'online' },
    { id: 4, title: 'Camera 4 – Storage Yard', status: 'online' }
  ];

  const cameras = feeds || defaultCameras;

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-2 h-full">
        {cameras.slice(0, 4).map((camera, index) => (
          <div key={camera.id || index} className="h-full">
            <CameraFeedCard 
              title={camera.title} 
              blackoutTriggered={blackoutTriggered}
            />
          </div>
        ))}
      </div>
    </div>
  );
}