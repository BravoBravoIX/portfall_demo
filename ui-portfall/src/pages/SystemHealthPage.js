import React from 'react';
import SystemStatusCard from '../components/systemhealth/SystemStatusCard';
import CriticalAlertsCard from '../components/systemhealth/CriticalAlertsCard';
import SystemMetricsCard from '../components/systemhealth/SystemMetricsCard';
import InvestigationLinksCard from '../components/systemhealth/InvestigationLinksCard';
import { useGlobalState } from '../state/globalState';

export default function SystemHealthPage() {
  // Get system health data from global state
  const { 
    systemHealthAlerts,
    getOverallSystemStatus
  } = useGlobalState();

  // Get current system status from global state calculation
  const systemStatus = getOverallSystemStatus();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">System Health Dashboard</h2>
        <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium">Monitoring Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SystemStatusCard systemStatus={systemStatus} />
        <SystemMetricsCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CriticalAlertsCard alerts={systemHealthAlerts} />
        <InvestigationLinksCard />
      </div>
    </div>
  );
}