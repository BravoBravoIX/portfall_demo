import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../../state/globalState';
import MQTTClient from '../../services/MQTTClient';

// Keep messages in localStorage
const STORAGE_KEY = 'mqtt_debug_messages';

// Load existing messages from localStorage
const loadSavedMessages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error loading saved messages:', e);
    return [];
  }
};

// Save messages to localStorage
const saveMessages = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving messages:', e);
  }
};

export default function TimelineCard() {
  const { incomingMessage, updateAISState } = useGlobalState();
  const [messages, setMessages] = useState(loadSavedMessages());
  const [directSubscription, setDirectSubscription] = useState(false);
  
  // Set up direct MQTT subscription to verify message reception
  useEffect(() => {
    const mqttClient = new MQTTClient();
    
    mqttClient.connect()
      .then(() => {
        console.log('[TimelineDebug] Direct MQTT connection successful');
        mqttClient.subscribe('ui_update/vm-ui');
        setDirectSubscription(true);
        
        // This callback will be called for every message on the topic
        mqttClient.onMessage((topic, message) => {
          console.log('[TimelineDebug] Direct MQTT message received:', message);
          
          // Add message to our display list
          const newMessage = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            command: message.command,
            parameters: message.parameters || {},
            type: 'mqtt-direct'
          };
          
          // Update messages state with this new message
          setMessages(prev => {
            const updated = [newMessage, ...prev].slice(0, 20);
            saveMessages(updated);
            return updated;
          });
        });
      })
      .catch(err => {
        console.error('[TimelineDebug] Direct MQTT connect error:', err);
      });
      
    return () => {
      mqttClient.disconnect();
    };
  }, []);
  
  // Also track messages from the globalState as before
  useEffect(() => {
    if (incomingMessage && incomingMessage.command) {
      const newMessage = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        command: incomingMessage.command,
        parameters: incomingMessage.parameters || {},
        type: 'mqtt-global'
      };
      
      setMessages(prev => {
        const updated = [newMessage, ...prev].slice(0, 20);
        saveMessages(updated);
        return updated;
      });
    }
  }, [incomingMessage]);
  
  // Create a singleton MQTT client for test buttons
  const [testMqttClient, setTestMqttClient] = useState(null);
  
  // Initialize the test MQTT client when component mounts
  useEffect(() => {
    const client = new MQTTClient();
    client.connect()
      .then(() => {
        console.log('[TimelineDebug] Test MQTT client connected');
        setTestMqttClient(client);
      })
      .catch(err => {
        console.error('[TimelineDebug] Test MQTT client connection error:', err);
      });
      
    return () => {
      if (client) client.disconnect();
    };
  }, []);
  
  // Test button handler for hiding all ships
  const handleSendTestHideAll = () => {
    // First directly update the AIS state for immediate effect
    console.log('[TimelineDebug] Directly updating AIS state: hide_all_ships');
    updateAISState('hide_all_ships');
    
    // Create the message for MQTT
    const testMessage = {
      command: 'update_dashboard',
      parameters: {
        dashboard: 'ais',
        change: 'hide_all_ships'
      }
    };
    
    // Log locally
    const logMessage = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      command: testMessage.command,
      parameters: testMessage.parameters,
      type: 'mqtt-test-sent'
    };
    
    // Add it to our log
    setMessages(prev => {
      const updated = [logMessage, ...prev].slice(0, 20);
      saveMessages(updated);
      return updated;
    });
    
    // Also send it via MQTT if client is connected
    if (testMqttClient) {
      console.log('[TimelineDebug] Also publishing hide_all_ships to MQTT:', testMessage);
      testMqttClient.publish('ui_update/vm-ui', testMessage)
        .then(() => console.log('[TimelineDebug] Published successfully'))
        .catch(err => console.error('[TimelineDebug] Publish error:', err));
    }
  };
  
  const handleSendTestHideFirstShip = () => {
    // First directly update the AIS state for immediate effect
    console.log('[TimelineDebug] Directly updating AIS state: hide_ship Ship_Alpha');
    updateAISState('hide_ship', ['Ship_Alpha']);
    
    // Create the message for MQTT
    const testMessage = {
      command: 'update_dashboard',
      parameters: {
        dashboard: 'ais',
        change: 'hide_ship',
        target_ships: ['Ship_Alpha']
      }
    };
    
    // Log locally
    const logMessage = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      command: testMessage.command,
      parameters: testMessage.parameters,
      type: 'mqtt-test-sent'
    };
    
    // Add it to our log
    setMessages(prev => {
      const updated = [logMessage, ...prev].slice(0, 20);
      saveMessages(updated);
      return updated;
    });
    
    // Also send it via MQTT if client is connected
    if (testMqttClient) {
      console.log('[TimelineDebug] Also publishing hide_ship to MQTT:', testMessage);
      testMqttClient.publish('ui_update/vm-ui', testMessage)
        .then(() => console.log('[TimelineDebug] Published successfully'))
        .catch(err => console.error('[TimelineDebug] Publish error:', err));
    }
  };
  
  const handleSendTestShowAll = () => {
    // First directly update the AIS state for immediate effect
    console.log('[TimelineDebug] Directly updating AIS state: show_all_ships');
    updateAISState('show_all_ships');
    
    // Create the message for MQTT
    const testMessage = {
      command: 'update_dashboard',
      parameters: {
        dashboard: 'ais',
        change: 'show_all_ships'
      }
    };
    
    // Log locally
    const logMessage = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      command: testMessage.command,
      parameters: testMessage.parameters,
      type: 'mqtt-test-sent'
    };
    
    // Add it to our log
    setMessages(prev => {
      const updated = [logMessage, ...prev].slice(0, 20);
      saveMessages(updated);
      return updated;
    });
    
    // Also send it via MQTT if client is connected
    if (testMqttClient) {
      console.log('[TimelineDebug] Also publishing show_all_ships to MQTT:', testMessage);
      testMqttClient.publish('ui_update/vm-ui', testMessage)
        .then(() => console.log('[TimelineDebug] Published successfully'))
        .catch(err => console.error('[TimelineDebug] Publish error:', err));
    }
  };
  
  const handleClearMessages = () => {
    setMessages([]);
    saveMessages([]);
  };
  
  // Use our messages array, or show a waiting message if empty
  const events = messages.length > 0 ? messages : [
    { 
      id: 1, 
      time: new Date().toLocaleTimeString(), 
      type: 'info',
      command: 'waiting', 
      description: 'Waiting for MQTT messages...' 
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">MQTT Debug Log</h3>
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${directSubscription ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-xs text-gray-500">
            Messages: {messages.length} | Last: {messages.length > 0 ? messages[0].time : 'None'}
          </span>
        </div>
      </div>
      
      {/* Debug controls */}
      <div className="p-2 border-b border-gray-200 bg-gray-100 flex space-x-2 flex-wrap">
        <button 
          onClick={handleSendTestHideFirstShip}
          className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 mb-1"
        >
          Test: Hide First Ship
        </button>
        <button 
          onClick={handleSendTestHideAll}
          className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 mb-1"
        >
          Test: Hide All Ships
        </button>
        <button 
          onClick={handleSendTestShowAll}
          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 mb-1"
        >
          Test: Show All Ships
        </button>
        <button 
          onClick={handleClearMessages}
          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 ml-auto mb-1"
        >
          Clear Log
        </button>
      </div>
      
      {/* Message log */}
      <div className="p-4 max-h-[300px] overflow-y-auto">
        <div className="flow-root">
          <ul className="-mb-8">
            {events.map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== events.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        event.type === 'mqtt-direct' ? 'bg-blue-500' : 
                        event.type === 'mqtt-global' ? 'bg-purple-500' : 
                        event.type === 'mqtt-test' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500">
                          {event.time} <span className="font-medium text-gray-900">{event.command || 'Message'}</span>
                        </p>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          {event.type}
                        </span>
                      </div>
                      <div className="mt-1">
                        {/* Show raw MQTT message */}
                        {event.type.startsWith('mqtt') ? (
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {`command: ${event.command}
parameters: ${JSON.stringify(event.parameters, null, 2)}`}
                          </pre>
                        ) : (
                          <p className="text-sm text-gray-600">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}