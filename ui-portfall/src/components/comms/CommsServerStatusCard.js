import React from 'react';

export default function CommsServerStatusCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Server Health Overview</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>Mail Relay A: 🟢 Healthy</li>
        <li>Mail Relay B: 🟡 Intermittent</li>
        <li>Relay Node 3: 🔴 Down</li>
      </ul>
    </div>
  );
}