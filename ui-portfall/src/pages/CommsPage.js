import React from 'react';
import CommsLatencyCard from '../components/comms/CommsLatencyCard';
import CommsBounceLogCard from '../components/comms/CommsBounceLogCard';
import CommsServerStatusCard from '../components/comms/CommsServerStatusCard';
import CommsChatLogCard from '../components/comms/CommsChatLogCard';
import CommsTimelineCard from '../components/comms/CommsTimelineCard';
import CommsMQTTCard from '../components/comms/CommsMQTTCard';
import useCommsMessages from '../components/comms/useCommsMessages';

export default function CommsPage() {
  // Use comms messages hook to get filtered data
  const { latency, servers, bounces, chats, timeline } = useCommsMessages();
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Internal Comms Monitor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CommsLatencyCard />
        <CommsServerStatusCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CommsBounceLogCard />
        <CommsChatLogCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CommsTimelineCard />
        <CommsMQTTCard />
      </div>
    </div>
  );
}