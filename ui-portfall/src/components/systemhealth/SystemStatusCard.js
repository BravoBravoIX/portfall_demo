import React from 'react';

export default function SystemStatusCard({ systemStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'border-green-500 bg-green-50';
      case 'degraded': return 'border-yellow-500 bg-yellow-50';
      case 'critical': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'OPERATIONAL';
      case 'degraded': return 'DEGRADED';
      case 'critical': return 'CRITICAL';
      default: return 'UNKNOWN';
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500 text-white';
      case 'degraded': return 'bg-yellow-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <span className="text-green-500">●</span>;
      case 'degraded': return <span className="text-yellow-500">●</span>;
      case 'critical': return <span className="text-red-500">●</span>;
      default: return <span className="text-gray-500">●</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full">
      <div className="bg-gray-800 text-white p-4 rounded-t-xl">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">■</span>
          System Status Overview
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`border-2 rounded-lg p-3 ${getStatusColor(systemStatus.ais)}`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm">AIS Tracking</h4>
                <p className="text-xs text-gray-600">Vessel positioning</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{getStatusIcon(systemStatus.ais)}</div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeColor(systemStatus.ais)}`}>
                  {getStatusText(systemStatus.ais)}
                </span>
              </div>
            </div>
          </div>
          
          <div className={`border-2 rounded-lg p-3 ${getStatusColor(systemStatus.cctv)}`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm">CCTV Systems</h4>
                <p className="text-xs text-gray-600">Security monitoring</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{getStatusIcon(systemStatus.cctv)}</div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeColor(systemStatus.cctv)}`}>
                  {getStatusText(systemStatus.cctv)}
                </span>
              </div>
            </div>
          </div>
          
          <div className={`border-2 rounded-lg p-3 ${getStatusColor(systemStatus.container)}`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm">Container Management</h4>
                <p className="text-xs text-gray-600">Routing & logistics</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{getStatusIcon(systemStatus.container)}</div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeColor(systemStatus.container)}`}>
                  {getStatusText(systemStatus.container)}
                </span>
              </div>
            </div>
          </div>
          
          <div className={`border-2 rounded-lg p-3 ${getStatusColor(systemStatus.network)}`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm">Network Infrastructure</h4>
                <p className="text-xs text-gray-600">Connectivity & routing</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{getStatusIcon(systemStatus.network)}</div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeColor(systemStatus.network)}`}>
                  {getStatusText(systemStatus.network)}
                </span>
              </div>
            </div>
          </div>
          
          <div className={`border-2 rounded-lg p-3 md:col-span-2 ${getStatusColor(systemStatus.auth)}`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm">Authentication & Security</h4>
                <p className="text-xs text-gray-600">Access control & audit logs</p>
              </div>
              <div className="text-right">
                <div className="text-2xl">{getStatusIcon(systemStatus.auth)}</div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeColor(systemStatus.auth)}`}>
                  {getStatusText(systemStatus.auth)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}