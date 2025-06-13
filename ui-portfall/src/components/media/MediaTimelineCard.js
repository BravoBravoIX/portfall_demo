import React from 'react';

export default function MediaTimelineCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Inject Timeline Reference</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li><strong>T+35:</strong> INJ006 — Public tweet on GPS drift</li>
        <li><strong>T+75:</strong> INJ011 — News outlet reports sabotage claim</li>
        <li><strong>T+105:</strong> INJ014 — Viral chaos video appears online</li>
        <li><strong>T+110:</strong> INJ016 — CEO interview published</li>
      </ul>
    </div>
  );
}