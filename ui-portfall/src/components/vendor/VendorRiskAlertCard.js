import React from 'react';

export default function VendorRiskAlertCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Access Risk Summary</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>⚠️ Logic anomaly detected in v4.8.2</li>
        <li>🟠 Access from unexpected IP range at 09:12</li>
        <li>🔴 Prior vendor incident noted in internal memo (T+65)</li>
      </ul>
    </div>
  );
}