import React from 'react';

export default function CriticalAlertsCard({ alerts }) {
  const getSeverityColors = (severity) => {
    switch (severity) {
      case 'danger': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'info': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getBadgeColor = (severity) => {
    switch (severity) {
      case 'danger': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'danger': return <span className="text-red-500">●</span>;
      case 'warning': return <span className="text-yellow-500">●</span>;
      case 'info': return <span className="text-blue-500">●</span>;
      default: return <span className="text-gray-500">●</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="bg-gray-800 text-white p-4 rounded-t-xl">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">▲</span>
          Critical System Alerts
          <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm">{alerts.length}</span>
        </h3>
      </div>
      <div className="overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-2 text-green-500">✓</div>
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border-l-4 ${getSeverityColors(alert.severity)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <span className="mr-2">{getSeverityIcon(alert.severity)}</span>
                      <span className="text-xs text-gray-600">{alert.timestamp}</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getBadgeColor(alert.severity)}`}>
                        {alert.system?.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-gray-800">{alert.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}