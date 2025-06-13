import React, { useState, useEffect, useRef } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function MQTTMessageCard() {
  const { eventHistory } = useGlobalState();
  const [mqttMessages, setMqttMessages] = useState([]);
  
  // Use a ref to track if we've initialized
  const initialized = useRef(false);
  
  // On mount, load mqtt messages from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mqttMessages');
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("Loaded MQTT messages from localStorage:", parsed.length);
        setMqttMessages(parsed);
      } else {
        console.log("No stored MQTT messages found, initializing empty array");
        setMqttMessages([]);
      }
      // Mark as initialized regardless of whether we loaded data
      initialized.current = true;
    } catch (e) {
      console.error("Error loading from localStorage:", e);
      // Still mark as initialized so we can start processing new messages
      initialized.current = true;
      setMqttMessages([]);
    }
  }, []);
  
  // Process new messages from event history
  useEffect(() => {
    // Wait until we're initialized
    if (!initialized.current) return;
    
    // Get new messages
    const messagesMap = new Map(
      mqttMessages.map(msg => [msg.id, msg])
    );
    
    // Track if we've added any messages
    let added = false;
    
    // Check for new messages
    eventHistory.forEach(message => {
      // Only process MQTT messages
      if ((message.type === 'mqtt-message' || message.command) && !messagesMap.has(message.id)) {
        // Add to our map
        messagesMap.set(message.id, message);
        added = true;
      }
    });
    
    // If we added messages, update state and localStorage
    if (added) {
      const newMessages = Array.from(messagesMap.values()).sort((a, b) => {
        // Sort by timestamp - most recent first
        const aTime = a.received || (a.timestamp ? new Date(a.timestamp).getTime() : a.id);
        const bTime = b.received || (b.timestamp ? new Date(b.timestamp).getTime() : b.id);
        return bTime - aTime;
      });
      
      // Update state
      setMqttMessages(newMessages);
      
      // Persist to localStorage
      try {
        localStorage.setItem('mqttMessages', JSON.stringify(newMessages));
        console.log("Saved MQTT messages to localStorage:", newMessages.length);
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    }
  }, [eventHistory, mqttMessages]);
  
  // Handler for clearing the message log
  const handleClearLog = () => {
    if (window.confirm('Are you sure you want to clear the message log?')) {
      localStorage.removeItem('mqttMessages');
      setMqttMessages([]);
      initialized.current = true;
      console.log("Cleared all MQTT messages");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">MQTT Messages</h3>
        <button 
          onClick={handleClearLog}
          className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded focus:outline-none"
        >
          Clear Log
        </button>
      </div>
      <div className="text-sm font-mono text-gray-700 space-y-1 max-h-[45rem] overflow-y-auto">
        {mqttMessages.length > 0 ? (
          mqttMessages.map(message => (
            <div key={message.id} className="border-b border-gray-200 py-2">
              <div className="flex flex-col mb-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{message.time}</span>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {message.command || message.action || message.event || 'unknown'}
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    {message.topic || 'unknown topic'}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    {message.type || 'unknown type'}
                  </span>
                </div>
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(message.parameters || message.targets || message.description || {}, null, 2)}
              </pre>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No MQTT messages received yet.</p>
        )}
      </div>
    </div>
  );
}