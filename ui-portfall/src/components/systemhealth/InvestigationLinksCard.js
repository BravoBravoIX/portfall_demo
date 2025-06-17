import React from 'react';

export default function InvestigationLinksCard() {
  const vmSystems = [
    {
      name: 'Gateway VM',
      hostname: 'vm-secure1.southgate.local',
      description: 'Network gateway and authentication logs',
      status: 'operational',
      logs: ['/var/log/auth.log', '/var/log/syslog'],
      credentials: 'support / Trust3dV3ndor'
    },
    {
      name: 'CoreTech VM', 
      hostname: 'vm-coretech.southgate.local',
      description: 'Core infrastructure and crane systems',
      status: 'operational',
      logs: ['/var/log/cron.log', '/var/log/system.log'],
      credentials: 'admin / CT2024secure'
    },
    {
      name: 'OpsNode VM',
      hostname: 'vm-opsnode.southgate.local', 
      description: 'Container management and routing',
      status: 'operational',
      logs: ['/var/log/docker.log', '/var/log/routing.log'],
      credentials: 'operator / OpsN0de2024'
    }
  ];

  const getStatusColors = (status) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'degraded': return 'border-blue-500 bg-blue-50';
      case 'operational': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'degraded': return 'bg-blue-500 text-white';
      case 'operational': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getButtonColor = (status) => {
    switch (status) {
      case 'critical': return 'border-red-500 text-red-700 hover:bg-red-50';
      case 'warning': return 'border-yellow-500 text-yellow-700 hover:bg-yellow-50';
      case 'degraded': return 'border-blue-500 text-blue-700 hover:bg-blue-50';
      case 'operational': return 'border-green-500 text-green-700 hover:bg-green-50';
      default: return 'border-gray-500 text-gray-700 hover:bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <span className="text-red-500">●</span>;
      case 'warning': return <span className="text-yellow-500">●</span>;
      case 'degraded': return <span className="text-blue-500">●</span>;
      case 'operational': return <span className="text-green-500">●</span>;
      default: return <span className="text-gray-500">●</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full">
      <div className="bg-gray-800 text-white p-4 rounded-t-xl">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">⊞</span>
          Investigation Resources
        </h3>
      </div>
      <div className="p-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-4">
          <div className="flex items-center">
            <span className="mr-2">i</span>
            <div>
              <strong>VM Access:</strong> Use the credentials below to investigate system anomalies when alerts are triggered.
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {vmSystems.map((vm, index) => (
            <div key={index} className={`border-2 rounded-lg p-3 ${getStatusColors(vm.status)}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm flex items-center">
                    {getStatusIcon(vm.status)}
                    <span className="ml-2">{vm.name}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getBadgeColor(vm.status)}`}>
                      {vm.status.toUpperCase()}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-600">{vm.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Hostname:</p>
                  <p className="font-mono text-xs">{vm.hostname}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Credentials:</p>
                  <p className="font-mono text-xs">{vm.credentials}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Priority Log Files:</p>
                <div className="flex flex-wrap gap-1">
                  {vm.logs.map((log, logIndex) => (
                    <span key={logIndex} className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-mono">
                      {log}
                    </span>
                  ))}
                </div>
              </div>

              <button className={`w-full py-2 px-3 border-2 rounded-lg text-sm font-medium transition-colors ${getButtonColor(vm.status)}`}>
                <span className="mr-1">□</span>
                SSH Access Available
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="mr-1">!</span>
            <strong>Security Notice:</strong> All VM access is logged. Follow incident response protocols.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <span className="mr-1">⟲</span>
            Escalate findings immediately to incident coordinator.
          </p>
        </div>
      </div>
    </div>
  );
}