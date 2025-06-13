import { useState, useEffect, useRef, useMemo } from 'react';
import { useGlobalState } from '../../state/globalState';

// Legacy container data (kept for backward compatibility)
const defaultContainers = {
  'CONT001': { id: 'CONT001', status: 'Normal', location: 'Bay A-3', manifest: 'Electronics', error: null },
  'CONT002': { id: 'CONT002', status: 'Normal', location: 'Bay B-7', manifest: 'Machinery', error: null },
  'CONT003': { id: 'CONT003', status: 'Normal', location: 'Bay C-2', manifest: 'Textiles', error: null },
  'CONT004': { id: 'CONT004', status: 'Warning', location: 'Bay A-5', manifest: 'Chemicals', error: 'Temperature Alert' },
  'CONT005': { id: 'CONT005', status: 'Normal', location: 'Bay D-1', manifest: 'Automotive', error: null }
};

export default function useContainerMessages() {
  // Get container state from global context - simplified
  const { 
    injects,
    containerGrid,
    containerLogs, 
    containerErrors,
    containerAlarmTriggered,
    resetContainerState: globalResetContainerState
  } = useGlobalState();
  
  // Legacy container data (kept for backward compatibility)
  const [containers, setContainers] = useState(defaultContainers);
  
  // Reference to track processed injects to avoid duplicates
  const processedInjectIds = useRef(new Set());
  
  // Filter container injects
  const containerInjects = useMemo(() => {
    return injects.filter(inject => 
      inject.dashboard === 'containers' || inject.dashboard === 'container'
    );
  }, [injects]);
  
  // Process any container injects to update logs
  useEffect(() => {
    if (containerInjects.length === 0) return;
    
    // For debugging
    console.log(`Processing ${containerInjects.length} container injects for message display`);
    
    // Process all injects to ensure message cards are updated
    // Note: Animation logic is now handled in useContainerState.js
    
  }, [containerInjects]);
  
  // Make reset function available globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.resetContainerState = globalResetContainerState;
    }
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        delete window.resetContainerState;
      }
    };
  }, [globalResetContainerState]);
  
  return {
    containers,
    logs: containerLogs,
    errors: containerErrors,
    containerGrid,
    systemAlarmTriggered: containerAlarmTriggered,
    resetContainerState: globalResetContainerState,
    raw: containerInjects // This is what the message card uses
  };
}