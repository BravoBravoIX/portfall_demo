import React from 'react';

export default function VendorAccessLogCard({ accessLogs = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Login Access Logs</h3>
      <div className="text-sm font-mono text-gray-700 space-y-1 max-h-52 overflow-y-auto">
        {accessLogs.map((log) => (
          <p key={log.id}>
            [{log.timestamp}] {log.user}{log.ip && ` – IP ${log.ip}`} – {log.status}
            {log.details && ` – ${log.details}`}
          </p>
        ))}
        {accessLogs.length === 0 && (
          <p className="text-gray-500">No access logs available</p>
        )}
      </div>
    </div>
  );
}