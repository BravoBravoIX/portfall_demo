import React from 'react';
import VendorAccessLogCard from '../components/vendor/VendorAccessLogCard';
import VendorPatchHistoryCard from '../components/vendor/VendorPatchHistoryCard';
import VendorRiskAlertCard from '../components/vendor/VendorRiskAlertCard';
import VendorTimelineCard from '../components/vendor/VendorTimelineCard';
import VendorMQTTCard from '../components/vendor/VendorMQTTCard';
import useVendorMessages from '../components/vendor/useVendorMessages';

export default function VendorPage() {
  // Use vendor messages hook to get filtered data
  const { accessLogs, patches, alerts, timeline } = useVendorMessages();
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Vendor Access Portal</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VendorAccessLogCard />
        <VendorPatchHistoryCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VendorRiskAlertCard />
        <VendorMQTTCard />
      </div>

      <VendorTimelineCard />
    </div>
  );
}