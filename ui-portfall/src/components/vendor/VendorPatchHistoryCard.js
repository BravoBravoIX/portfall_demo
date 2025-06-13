import React from 'react';

export default function VendorPatchHistoryCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Patch History</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>🔄 v4.8.2 – Uploaded 09:15 – *TrustedVendor Suite*</li>
        <li>⚠️ v4.8.1 – Missing signature – installed 2 weeks ago</li>
        <li>✅ v4.7.9 – Stable version – 3 months ago</li>
      </ul>
    </div>
  );
}