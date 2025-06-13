import React from 'react';

export default function CommsTimelineCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Inject Timeline Reference</h3>
      <p className="text-sm text-gray-700 mb-1">
        <strong>T+90:</strong> INJ012 — Internal communications degradation. Mail delay, chat errors, SMTP queue spike.
      </p>
      <p className="text-sm text-gray-500">
        Related Roles: <em>Tech, Ops, Legal, CEO</em>
      </p>
    </div>
  );
}