import React from 'react';

export default function VendorTimelineCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Inject Timeline Reference</h3>
      <p className="text-sm text-gray-700 mb-1">
        <strong>T+30:</strong> INJ005 — Vendor email leaked (logic anomaly warning).
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>T+65:</strong> INJ010 — Memo surfaces detailing prior patch risk history.
      </p>
      <p className="text-sm text-gray-500">
        Related Roles: <em>Tech, Legal, CEO</em>
      </p>
    </div>
  );
}