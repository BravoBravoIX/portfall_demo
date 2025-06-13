import { useState, useEffect } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useVendorMessages() {
  const { getInjectsForDashboard } = useGlobalState();
  const vendorInjects = getInjectsForDashboard('vendor');
  
  const [accessLogs, setAccessLogs] = useState([
    { id: 1, timestamp: '09:12:15', user: 'vendor_user@trustedvendor.com', ip: '203.55.142.19', status: 'Success', details: '' },
    { id: 2, timestamp: '09:13:02', user: 'vendor_user', ip: '', status: 'Failed', details: 'invalid token' },
    { id: 3, timestamp: '09:15:22', user: 'vendor_patch_agent', ip: '203.55.142.19', status: 'Success', details: 'Patch upload started' }
  ]);
  
  const [patches, setPatches] = useState([
    { id: 1, version: 'v1.2.3', timestamp: '08:30:00', status: 'Applied', system: 'AIS Control Panel', user: 'system_auto' },
    { id: 2, version: 'v0.9.8', timestamp: '09:15:22', status: 'Pending', system: 'Container Management', user: 'vendor_patch_agent' }
  ]);
  
  const [alerts, setAlerts] = useState([
    { id: 1, level: 'Medium', timestamp: '09:20:33', message: 'Unusual patch activity detected', seen: true }
  ]);
  
  const [timeline, setTimeline] = useState([]);
  
  // Process vendor injects
  useEffect(() => {
    if (vendorInjects.length === 0) return;
    
    // Create copies of current state
    const updatedAccessLogs = [...accessLogs];
    const updatedPatches = [...patches];
    const updatedAlerts = [...alerts];
    const updatedTimeline = [...timeline];
    
    // Process each inject in chronological order
    vendorInjects.forEach(inject => {
      const { command, parameters, receivedAt } = inject;
      
      if (command === 'update_dashboard' && parameters?.dashboard === 'vendor') {
        const { change, message, level, user, ip, status, version, system } = parameters || {};
        
        // Format timestamp for display
        const timestamp = new Date(receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        
        // Handle access log entries
        if (change === 'access_log') {
          const newLog = {
            id: Date.now() + Math.random(),
            timestamp,
            user: user || 'unknown_user',
            ip: ip || '',
            status: status || 'Unknown',
            details: message || ''
          };
          
          updatedAccessLogs.push(newLog);
          
          // Add to timeline
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp,
            event: `Access log: ${user} - ${status}`,
            details: message || ''
          });
        }
        
        // Handle patch updates
        if (change === 'patch') {
          const newPatch = {
            id: Date.now() + Math.random(),
            version: version || 'unknown',
            timestamp,
            status: status || 'Pending',
            system: system || 'Unknown System',
            user: user || 'unknown_user'
          };
          
          updatedPatches.push(newPatch);
          
          // Add to timeline
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp,
            event: `Patch ${version} - ${status}`,
            details: `For ${system} by ${user}`
          });
        }
        
        // Handle risk alerts
        if (change === 'risk_alert') {
          const newAlert = {
            id: Date.now() + Math.random(),
            level: level || 'Low',
            timestamp,
            message: message || 'Unspecified risk alert',
            seen: false
          };
          
          updatedAlerts.push(newAlert);
          
          // Add to timeline
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp,
            event: `${level} risk alert`,
            details: message || ''
          });
        }
        
        // Handle direct timeline events
        if (change === 'timeline_event') {
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp,
            event: message || 'Unspecified event',
            details: ''
          });
        }
      }
    });
    
    // Sort and limit each data collection
    const sortedLogs = updatedAccessLogs
      .sort((a, b) => new Date(`1970/01/01 ${b.timestamp}`) - new Date(`1970/01/01 ${a.timestamp}`))
      .slice(0, 50);
      
    const sortedPatches = updatedPatches
      .sort((a, b) => new Date(`1970/01/01 ${b.timestamp}`) - new Date(`1970/01/01 ${a.timestamp}`))
      .slice(0, 20);
      
    const sortedAlerts = updatedAlerts
      .sort((a, b) => new Date(`1970/01/01 ${b.timestamp}`) - new Date(`1970/01/01 ${a.timestamp}`))
      .slice(0, 20);
      
    const sortedTimeline = updatedTimeline
      .sort((a, b) => new Date(`1970/01/01 ${b.timestamp}`) - new Date(`1970/01/01 ${a.timestamp}`))
      .slice(0, 50);
    
    // Update state
    setAccessLogs(sortedLogs);
    setPatches(sortedPatches);
    setAlerts(sortedAlerts);
    setTimeline(sortedTimeline);
    
  }, [vendorInjects]);
  
  return {
    accessLogs,
    patches,
    alerts,
    timeline,
    raw: vendorInjects
  };
}