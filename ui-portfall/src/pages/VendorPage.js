import React from 'react';
import VendorAccessLogCard from '../components/vendor/VendorAccessLogCard';
import VendorPatchHistoryCard from '../components/vendor/VendorPatchHistoryCard';
import VendorRiskAlertCard from '../components/vendor/VendorRiskAlertCard';
import { useGlobalState } from '../state/globalState';

export default function VendorPage() {
  // Get vendor data from global state
  const { vendorAccessLogs, vendorPatches, vendorAlerts, vendorTimeline } = useGlobalState();
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Vendor Access Portal</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VendorAccessLogCard accessLogs={vendorAccessLogs} />
        <VendorPatchHistoryCard patches={vendorPatches} />
      </div>

      <VendorRiskAlertCard alerts={vendorAlerts} />
    </div>
  );
}