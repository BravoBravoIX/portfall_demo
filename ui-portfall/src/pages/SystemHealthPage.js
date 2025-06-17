import React, { useState, useEffect } from 'react';
import SystemStatusCard from '../components/systemhealth/SystemStatusCard';
import CriticalAlertsCard from '../components/systemhealth/CriticalAlertsCard';
import SystemMetricsCard from '../components/systemhealth/SystemMetricsCard';
import InvestigationLinksCard from '../components/systemhealth/InvestigationLinksCard';
import useSystemHealthMessages from '../components/systemhealth/useSystemHealthMessages';

export default function SystemHealthPage() {
  const [alerts, setAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    ais: 'healthy',
    cctv: 'healthy', 
    container: 'healthy',
    network: 'healthy',
    auth: 'healthy'
  });

  // Use system health messages hook to get filtered data
  const { logEvents } = useSystemHealthMessages();

  // Handle new log events
  useEffect(() => {
    if (logEvents && logEvents.length > 0) {
      const latestEvent = logEvents[logEvents.length - 1];
      handleLogEvent(latestEvent);
    }
  }, [logEvents]);

  const handleLogEvent = (event) => {
    const timestamp = new Date().toLocaleTimeString();
    let alertMessage = '';
    let severity = 'warning';
    let systemAffected = '';

    switch (event.change) {
      case 'log_auth_failure':
        alertMessage = `CRITICAL: Authentication failures detected on ${event.user || 'system'} from ${event.source}`;
        severity = 'danger';
        systemAffected = 'auth';
        break;
      case 'log_ping_loss':
        alertMessage = `WARNING: Network connectivity lost to ${event.source}`;
        severity = 'warning';
        systemAffected = 'network';
        break;
      case 'cronjob_detected':
        alertMessage = `CRITICAL: Suspicious automated task detected: ${event.task}`;
        severity = 'danger';
        systemAffected = 'network';
        break;
      case 'log_container_reroute':
        alertMessage = `ALERT: Container routing configuration compromised`;
        severity = 'warning';
        systemAffected = 'container';
        break;
      case 'unauthorised_access':
        alertMessage = `CRITICAL: Unauthorized access attempt from ${event.ip} to ${event.source}`;
        severity = 'danger';
        systemAffected = 'network';
        break;
      case 'log_deletion_alert':
        alertMessage = `CRITICAL: Log tampering detected - ${event.file} modified by ${event.user}`;
        severity = 'danger';
        systemAffected = 'auth';
        break;
      default:
        alertMessage = `SYSTEM: ${event.change} detected on ${event.source || 'system'}`;
        severity = 'info';
        systemAffected = 'network';
    }

    // Add new alert
    const newAlert = {
      id: Date.now(),
      timestamp,
      message: alertMessage,
      severity,
      system: systemAffected
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts

    // Update system status
    setSystemStatus(prev => ({
      ...prev,
      [systemAffected]: severity === 'danger' ? 'critical' : 'degraded'
    }));
  };

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
        <CriticalAlertsCard alerts={alerts} />
        <InvestigationLinksCard />
      </div>
    </div>
  );
}