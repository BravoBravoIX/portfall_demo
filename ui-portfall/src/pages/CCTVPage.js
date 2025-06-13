import React from 'react';
import CameraFeedCard from '../components/cctv/CameraFeedCard';
import CameraStatusCard from '../components/cctv/CameraStatusCard';
import CCTVEventLogCard from '../components/cctv/CCTVEventLogCard';
import CCTVTimelineCard from '../components/cctv/CCTVTimelineCard';
import CCTVMQTTCard from '../components/cctv/CCTVMQTTCard';
import useCCTVMessages from '../components/cctv/useCCTVMessages';

export default function CCTVPage() {
  // Use CCTV messages hook to get filtered data
  const { cameras, events } = useCCTVMessages();
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">CCTV Surveillance Dashboard</h2>

      {/* Camera Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CameraFeedCard title="Camera 1 – North Gate" />
        <CameraFeedCard title="Camera 2 – Dockside" />
        <CameraFeedCard title="Camera 3 – Admin Building" />
        <CameraFeedCard title="Camera 4 – Storage Yard" />
      </div>

      {/* Status + Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CameraStatusCard />
        <CCTVEventLogCard />
      </div>

      {/* Timeline + Message Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CCTVTimelineCard />
        <CCTVMQTTCard />
      </div>
    </div>
  );
}