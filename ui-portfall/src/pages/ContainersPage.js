import React, { useEffect } from 'react';
import ContainerVisualMapCard from '../components/containers/ContainerVisualMapCard';
import ContainerTableCard from '../components/containers/ContainerTableCard';
import ContainerLogCard from '../components/containers/ContainerLogCard';
import ContainerErrorStatusCard from '../components/containers/ContainerErrorStatusCard';
import ContainerTimelineCard from '../components/containers/ContainerTimelineCard';
import ContainerMQTTCard from '../components/containers/ContainerMQTTCard';
import useContainerMessages from '../components/containers/useContainerMessages';
import { useGlobalState } from '../state/globalState';

export default function ContainersPage() {
  // Get container state from the global context
  const { resetContainerState } = useGlobalState();
  
  // Force reset containers on page load but without reload
  useEffect(() => {
    console.log('ContainersPage mounted - resetting container state');
    
    // Use a session flag to only do this once per browsing session
    const alreadyReset = sessionStorage.getItem('containersPageReset');
    
    if (!alreadyReset) {
      localStorage.removeItem('containerTriggered');
      localStorage.removeItem('containerTriggerTime');
      resetContainerState();
      
      // Mark as reset for this session
      sessionStorage.setItem('containersPageReset', 'true');
    }
  }, [resetContainerState]);
  
  // Use container messages hook to get filtered data
  const { containers, logs, errors, systemAlarmTriggered } = useContainerMessages();
  
  // Reset button handler for development mode
  const handleReset = () => {
    // Force clear all container state data
    localStorage.removeItem('containerTriggered');
    localStorage.removeItem('containerTriggerTime');
    
    // Call the global reset function
    resetContainerState();
    
    // Force reload to ensure clean state
    window.location.reload();
  };
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Container Management System</h2>
        
        {/* Development-only reset button */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={handleReset}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
          >
            Reset Container State
          </button>
        )}
      </div>

      {/* Visual terminal layout */}
      <ContainerVisualMapCard />

      {/* Container table and status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContainerTableCard />
        <ContainerErrorStatusCard />
      </div>

      {/* Log and Message Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContainerLogCard />
        <ContainerMQTTCard />
      </div>

      {/* Timeline reference */}
      <ContainerTimelineCard />
    </div>
  );
}