import { useState, useEffect } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useCommsMessages() {
  // Get all injects from global state
  const { injects } = useGlobalState();
  
  // Filter for comms-specific injects (but store all for reference)
  const commsInjects = injects.filter(inject => 
    inject.dashboard === 'comms' || inject.dashboard === 'communications'
  );
  
  // State for comms-specific data
  const [latency, setLatency] = useState({
    current: 24,
    history: [22, 24, 23, 25, 27, 26, 24, 25, 28, 29, 32, 35],
    status: 'normal' // 'normal', 'warning', 'critical'
  });
  
  const [servers, setServers] = useState({
    'srv-comm-01': { status: 'Online', load: 42, lastUpdate: '12:04:23' },
    'srv-comm-02': { status: 'Online', load: 38, lastUpdate: '12:04:23' },
    'srv-proxy-01': { status: 'Online', load: 56, lastUpdate: '12:04:23' }, 
    'srv-backup-01': { status: 'Offline', load: 0, lastUpdate: '09:22:17' }
  });
  
  const [bounces, setBounces] = useState([
    { id: 1, timestamp: '12:03:10', source: 'terminal-5', destination: 'control', status: 'Delivered' },
    { id: 2, timestamp: '12:02:45', source: 'admin', destination: 'all-staff', status: 'Bounced' }
  ]);
  
  const [chats, setChats] = useState([
    { id: 1, timestamp: '12:00:00', user: 'system', message: 'Communications channel initialized' },
    { id: 2, timestamp: '12:01:15', user: 'admin', message: 'Daily status check - please confirm systems' },
    { id: 3, timestamp: '12:01:30', user: 'security', message: 'Security systems nominal' }
  ]);
  
  const [timeline, setTimeline] = useState([]);
  
  // Process all injects, not just comms-specific ones
  useEffect(() => {
    if (injects.length === 0) return;
    
    // Create copies of current state
    const updatedLatency = { ...latency };
    const updatedServers = { ...servers };
    const updatedBounces = [...bounces];
    const updatedChats = [...chats];
    const updatedTimeline = [...timeline];
    
    // Process each inject
    injects.forEach(inject => {
      const { command, parameters, receivedAt, dashboard } = inject;
      
      // Format timestamp for display
      const timestamp = new Date(receivedAt).toLocaleTimeString();
      
      // Handle direct comms injects
      if (command === 'update_dashboard' && (parameters?.dashboard === 'comms' || parameters?.dashboard === 'communications')) {
        const { change, server_id, message, user, source, destination, value } = parameters || {};
        
        // Handle latency changes
        if (change === 'latency') {
          const newLatency = parseInt(value) || updatedLatency.current;
          
          // Update latency
          updatedLatency.history.push(updatedLatency.current);
          updatedLatency.current = newLatency;
          
          // Keep only the last 12 history points
          if (updatedLatency.history.length > 12) {
            updatedLatency.history.shift();
          }
          
          // Determine status based on latency value
          if (newLatency > 50) {
            updatedLatency.status = 'critical';
          } else if (newLatency > 30) {
            updatedLatency.status = 'warning';
          } else {
            updatedLatency.status = 'normal';
          }
          
          // Add to timeline
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp,
            event: `Latency changed to ${newLatency}ms`,
            status: updatedLatency.status
          });
        }
        
        // Handle server status changes
        if (change === 'server_status' && server_id) {
          const status = parameters.status || 'Unknown';
          const load = parseInt(parameters.load) || 0;
          
          // Update or create server
          updatedServers[server_id] = {
            status,
            load,
            lastUpdate: timestamp
          };
          
          // Add to timeline
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp,
            event: `Server ${server_id} status: ${status}`,
            details: `Load: ${load}%`
          });
        }
        
        // Handle message bounces
        if (change === 'message_bounce' && source && destination) {
          const status = parameters.status || 'Bounced';
          
          // Add new bounce
          updatedBounces.push({
            id: Date.now() + Math.random(),
            timestamp,
            source,
            destination,
            status
          });
          
          // Add to timeline
          updatedTimeline.push({
            id: Date.now() + Math.random(),
            timestamp,
            event: `Message ${status}: ${source} → ${destination}`,
            details: message || ''
          });
        }
        
        // Handle chat messages
        if (change === 'chat_message' && user) {
          // Add new chat
          updatedChats.push({
            id: Date.now() + Math.random(),
            timestamp,
            user,
            message: message || '(No message content)'
          });
          
          // Don't add chats to timeline to avoid clutter
        }
      }
      
      // Also monitor relevant events from other dashboards that might affect comms
      if (dashboard !== 'comms' && dashboard !== 'communications') {
        // Extract dashboard name for event description
        const dashboardName = dashboard || 'system';
        
        // For significant events in other systems that might impact comms
        if (command === 'update_dashboard') {
          const eventType = parameters?.change || 'update';
          
          // Add significant events from other dashboards to timeline
          // This helps comms personnel correlate issues with events elsewhere
          if (
            eventType === 'system_health' || 
            eventType === 'hide_all_ships' || 
            eventType === 'camera_status' ||
            eventType === 'container_status' && parameters?.status === 'Error'
          ) {
            updatedTimeline.push({
              id: Date.now() + Math.random(),
              timestamp,
              event: `${dashboardName.toUpperCase()} event: ${eventType}`,
              details: `May impact communications - monitor for effects`,
              external: true // Flag to mark this as an external event
            });
          }
        }
      }
    });
    
    // Sort and limit each data collection
    const sortedBounces = updatedBounces
      .sort((a, b) => new Date(`1970/01/01 ${b.timestamp}`) - new Date(`1970/01/01 ${a.timestamp}`))
      .slice(0, 20);
      
    const sortedChats = updatedChats
      .sort((a, b) => new Date(`1970/01/01 ${b.timestamp}`) - new Date(`1970/01/01 ${a.timestamp}`))
      .slice(0, 50);
      
    const sortedTimeline = updatedTimeline
      .sort((a, b) => new Date(`1970/01/01 ${b.timestamp}`) - new Date(`1970/01/01 ${a.timestamp}`))
      .slice(0, 50);
    
    // Update state
    setLatency(updatedLatency);
    setServers(updatedServers);
    setBounces(sortedBounces);
    setChats(sortedChats);
    setTimeline(sortedTimeline);
    
  }, [injects]); // Watch ALL injects, not just comms ones
  
  return {
    latency,
    servers,
    bounces,
    chats,
    timeline,
    commsInjects,  // Just the comms-specific injects
    allInjects: injects  // ALL injects for reference
  };
}