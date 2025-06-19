import React from 'react';

export default function VendorPatchHistoryCard({ patches = [] }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied': return '✅';
      case 'pending': return '🔄';
      case 'failed': return '❌';
      default: return '⚠️';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Patch History</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        {patches.map((patch) => (
          <li key={patch.id}>
            {getStatusIcon(patch.status)} {patch.version} – {patch.status} {patch.timestamp} – {patch.system}
            {patch.user && ` (by ${patch.user})`}
          </li>
        ))}
        {patches.length === 0 && (
          <li className="text-gray-500">No patch history available</li>
        )}
      </ul>
    </div>
  );
}