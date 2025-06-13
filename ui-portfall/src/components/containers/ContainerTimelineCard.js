import React from 'react';

export default function ContainerTimelineCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Inject Timeline Reference</h3>
      <p className="text-sm text-gray-700 mb-1">
        <strong>T+60:</strong> INJ009 — Scheduler config manipulation detected. Containers misrouted or delayed.
      </p>
      <p className="text-sm text-gray-500">
        Related Roles: <em>Tech, Ops, CEO</em>
      </p>
    </div>
  );
}