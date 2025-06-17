import { useState, useEffect } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useCCTVMessages() {
  const { getInjectsForDashboard } = useGlobalState();
  const cctvInjects = getInjectsForDashboard('cctv');
  
  const [cameras, setCameras] = useState({
    'Camera 1 – North Gate': { id: 1, status: 'Online', lastPing: '5s ago', recording: true },
    'Camera 2 – Dockside': { id: 2, status: 'Online', lastPing: '3s ago', recording: true },
    'Camera 3 – Admin Building': { id: 3, status: 'Online', lastPing: '7s ago', recording: true },
    'Camera 4 – Storage Yard': { id: 4, status: 'Online', lastPing: '4s ago', recording: true },
    'Camera 5 – Engine Room': { id: 5, status: 'Offline', lastPing: '4h ago', recording: false },
    'Camera 6 – Crew Quarters': { id: 6, status: 'Degraded', lastPing: '15s ago', recording: true }
  });
  
  const [events, setEvents] = useState([]);
  const [blackoutTriggered, setBlackoutTriggered] = useState(false);
  
  // Process CCTV injects
  useEffect(() => {
    if (cctvInjects.length === 0) return;
    
    // Create copies of current state
    const updatedCameras = { ...cameras };
    const updatedEvents = [...events];
    
    // Process each inject in chronological order
    cctvInjects.forEach(inject => {
      const { command, parameters, receivedAt } = inject;
      
      if (command === 'update_dashboard' && parameters?.dashboard === 'cctv') {
        const { change, camera_id, camera_name, event_type, details } = parameters || {};
        
        // Format timestamp for display
        const timestamp = new Date(receivedAt).toLocaleTimeString();
        
        // Handle camera status changes
        if (change === 'camera_status' && camera_name && updatedCameras[camera_name]) {
          const status = parameters.status || 'Online';
          const oldStatus = updatedCameras[camera_name].status;
          
          // Update camera status
          updatedCameras[camera_name] = {
            ...updatedCameras[camera_name],
            status,
            lastPing: '1s ago'
          };
          
          // Add event for status change if it's different
          if (oldStatus !== status) {
            updatedEvents.push({
              id: Date.now() + Math.random(),
              timestamp,
              camera: camera_name,
              event: `Status changed to ${status}`,
              details: details || ''
            });
          }
        }
        
        // Handle recording status changes
        if (change === 'recording_status' && camera_name && updatedCameras[camera_name]) {
          const recording = parameters.recording === 'true' || parameters.recording === true;
          const oldRecording = updatedCameras[camera_name].recording;
          
          // Update recording status
          updatedCameras[camera_name] = {
            ...updatedCameras[camera_name],
            recording
          };
          
          // Add event for recording change if it's different
          if (oldRecording !== recording) {
            updatedEvents.push({
              id: Date.now() + Math.random(),
              timestamp,
              camera: camera_name,
              event: recording ? 'Recording started' : 'Recording stopped',
              details: details || ''
            });
          }
        }
        
        // Handle direct events
        if (change === 'event' && camera_name) {
          updatedEvents.push({
            id: Date.now() + Math.random(),
            timestamp,
            camera: camera_name,
            event: event_type || 'Unspecified event',
            details: details || ''
          });
        }
        
        // Handle motion detection
        if (change === 'motion_detected' && camera_name) {
          updatedEvents.push({
            id: Date.now() + Math.random(),
            timestamp,
            camera: camera_name,
            event: 'Motion detected',
            details: details || ''
          });
        }
        
        // Handle blackout trigger
        if (change === 'trigger_blackout') {
          setBlackoutTriggered(true);
          
          // Add blackout event
          updatedEvents.push({
            id: Date.now() + Math.random(),
            timestamp,
            camera: 'All Cameras',
            event: 'Signal interference detected',
            details: 'RF interference causing feed disruption'
          });
          
          // Update all main camera statuses
          ['Camera 1 – North Gate', 'Camera 2 – Dockside', 'Camera 3 – Admin Building', 'Camera 4 – Storage Yard'].forEach(cameraName => {
            if (updatedCameras[cameraName]) {
              updatedCameras[cameraName] = {
                ...updatedCameras[cameraName],
                status: 'Interference',
                lastPing: 'Signal lost',
                recording: false
              };
            }
          });
        }
      }
    });
    
    // Keep only the most recent 50 events, sorted by timestamp (newest first)
    const sortedEvents = updatedEvents
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);
    
    // Update state
    setCameras(updatedCameras);
    setEvents(sortedEvents);
    
  }, [cctvInjects]);
  
  return {
    cameras,
    events,
    blackoutTriggered,
    raw: cctvInjects
  };
}