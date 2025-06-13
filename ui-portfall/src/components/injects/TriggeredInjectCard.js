import React from 'react';
import { useGlobalState } from '../../state/globalState';
import injectDescriptions from './injects.json';

// Direct mapping function with debugging
function mapMessageToInject(message) {
  const { command, parameters } = message;
  
  console.log("Checking message for inject:", command, parameters);
  
  if (!command || !parameters) return null;
  
  // Start scenario
  if (command === 'start_scenario') {
    console.log("Matched: INJ_START");
    return 'INJ_START';
  }
  
  // Handle dashboard updates
  if (command === 'update_dashboard') {
    const { dashboard, change } = parameters;
    
    if (dashboard === 'ais' && change === 'hide_ship') {
      console.log("Matched: INJ001");
      return 'INJ001';
    }
    if (dashboard === 'cctv' && change === 'trigger_blackout') {
      console.log("Matched: INJ003");
      return 'INJ003';
    }
    if (dashboard === 'media' && change === 'publish_tweet') {
      console.log("Matched: INJ005");
      return 'INJ005';
    }
    if (dashboard === 'ais' && change === 'hide_all_ships') {
      console.log("Matched: INJ006");
      return 'INJ006';
    }
    if (dashboard === 'container' && change === 'log_config_manipulation') {
      console.log("Matched: INJ007");
      return 'INJ007';
    }
    if (dashboard === 'media' && change === 'publish_news') {
      console.log("Matched: INJ009");
      return 'INJ009';
    }
    if (dashboard === 'media' && change === 'air_interview') {
      console.log("Matched: INJ012");
      return 'INJ012';
    }
  }
  
  // Handle emails based on subject
  if (command === 'send_email' && parameters.subject) {
    const subject = parameters.subject;
    
    if (subject === 'Delayed Packet Routing') {
      console.log("Matched: INJ002");
      return 'INJ002';
    }
    if (subject === 'Vendor Email Leak') {
      console.log("Matched: INJ004");
      return 'INJ004';
    }
    if (subject === 'Past Vendor Incidents') {
      console.log("Matched: INJ008");
      return 'INJ008';
    }
    if (subject === 'Insurer Inquiry') {
      console.log("Matched: INJ010");
      return 'INJ010';
    }
    if (subject === 'Journalist Inquiry') {
      console.log("Matched: INJ011");
      return 'INJ011';
    }
    if (subject === 'Government Formal Request') {
      console.log("Matched: INJ013");
      return 'INJ013';
    }
  }
  
  console.log("No match found for:", command, parameters);
  return null;
}

export default function TriggeredInjectCard() {
  const { eventHistory } = useGlobalState();
  const [triggeredInjects, setTriggeredInjects] = React.useState([]);
  
  // Use a ref to track if we've initialized
  const initialized = React.useRef(false);
  
  // On mount, load triggered injects from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('triggeredInjects');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("Loaded triggered injects from localStorage:", parsed.length);
        setTriggeredInjects(parsed);
      } else {
        console.log("No stored injects found, initializing empty array");
        setTriggeredInjects([]);
      }
      // Mark as initialized regardless of whether we loaded data
      initialized.current = true;
    } catch (e) {
      console.error("Error loading from localStorage:", e);
      // Still mark as initialized so we can start processing new messages
      initialized.current = true;
      setTriggeredInjects([]);
    }
  }, []);
  
  // Process new messages and update triggered injects
  React.useEffect(() => {
    // Wait until we're initialized
    if (!initialized.current) return;
    
    console.log("Processing messages for injects, eventHistory size:", eventHistory.length);
    
    // Get all messages
    const mqttMessages = eventHistory.filter(event => 
      event.type === 'mqtt-message' || event.command
    );
    
    // Track if we've added any new injects
    let added = false;
    
    // Create a map from current triggered injects for lookups
    const currentInjects = new Map(
      triggeredInjects.map(inject => [inject.id, inject])
    );
    
    // Process each message to find new injects
    mqttMessages.forEach(message => {
      const injectId = mapMessageToInject(message);
      
      // If we found a matching inject that's not already in our list
      if (injectId && !currentInjects.has(injectId)) {
        const newInject = {
          id: injectId,
          description: injectDescriptions[injectId]?.description || 'Unknown inject',
          time: message.time,
          timestamp: message.timestamp || message.received || Date.now(),
          message
        };
        
        // Add to our map
        currentInjects.set(injectId, newInject);
        console.log(`Added new inject: ${injectId} - ${newInject.description}`);
        added = true;
      }
    });
    
    // If we added any new injects, update state and localStorage
    if (added) {
      const newTriggeredInjects = Array.from(currentInjects.values()).sort((a, b) => {
        // Sort most recent first
        const aTime = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp;
        const bTime = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp;
        return bTime - aTime;
      });
      
      // Update state
      setTriggeredInjects(newTriggeredInjects);
      
      // Persist to localStorage
      try {
        localStorage.setItem('triggeredInjects', JSON.stringify(newTriggeredInjects));
        console.log("Saved triggered injects to localStorage:", newTriggeredInjects.length);
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  }, [eventHistory, triggeredInjects]);
  
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Triggered Injects</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {triggeredInjects.length} / {Object.keys(injectDescriptions).length} triggered
        </span>
      </div>
      <button 
        onClick={() => {
          localStorage.removeItem('triggeredInjects');
          setTriggeredInjects([]);
          initialized.current = true;
          console.log("Cleared all triggered injects");
        }}
        className="mb-3 text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
      >
        Clear All Injects
      </button>
      <div className="text-sm font-mono text-gray-700 space-y-1 max-h-[45rem] overflow-y-auto">
        {triggeredInjects.length > 0 ? (
          triggeredInjects.map(inject => (
            <div key={inject.id} className="border-b border-gray-200 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{inject.time}</span>
                <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  {inject.id}
                </span>
              </div>
              <p className="font-medium text-sm mb-1">{inject.description}</p>
              
              {/* Show compact message source info */}
              <div className="text-xs bg-gray-50 p-2 rounded">
                <div>
                  <span className="font-semibold">Command:</span> {inject.message.command}
                </div>
                {inject.message.topic && (
                  <div>
                    <span className="font-semibold">Topic:</span> {inject.message.topic}
                  </div>
                )}
                {inject.message.parameters && (
                  <div className="mt-1 truncate">
                    <span className="font-semibold">Parameters:</span> {JSON.stringify(inject.message.parameters)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No injects have been triggered yet.</p>
        )}
      </div>
    </div>
  );
}