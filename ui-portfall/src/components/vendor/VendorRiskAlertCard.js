import React from 'react';

export default function VendorRiskAlertCard({ alerts = [] }) {
  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': case 'critical': return '🔴';
      case 'medium': case 'moderate': return '🟠';
      case 'low': return '🟡';
      default: return '⚠️';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Access Risk Summary</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        {alerts.map((alert) => (
          <li key={alert.id} className={alert.seen ? 'opacity-60' : ''}>
            {getLevelIcon(alert.level)} {alert.message}
            <span className="text-xs text-gray-500 ml-2">({alert.timestamp})</span>
          </li>
        ))}
        {alerts.length === 0 && (
          <li className="text-gray-500">No risk alerts</li>
        )}
      </ul>
    </div>
  );
}