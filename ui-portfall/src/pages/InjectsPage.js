import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../state/globalState';
import MQTTClient from '../services/MQTTClient';

export default function InjectsPage() {
  const { injects } = useGlobalState();
  const [mqttClient, setMqttClient] = useState(null);
  const [scenarioStatus, setScenarioStatus] = useState('Unknown');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new MQTTClient();
    
    client.connect().then(() => {
      setIsConnected(true);
      client.subscribe('scenario/status');
    }).catch(error => {
      console.error('Failed to connect to MQTT:', error);
    });

    client.onMessage((topic, message) => {
      if (topic === 'scenario/status') {
        setScenarioStatus(message.status || 'Unknown');
      }
    });

    setMqttClient(client);

    return () => {
      client.disconnect();
    };
  }, []);

  const sendCommand = (command) => {
    if (!mqttClient || !isConnected) {
      alert('MQTT not connected');
      return;
    }

    mqttClient.publish('scenario/control', { command })
      .then(() => {
        console.log(`Sent ${command} command`);
      })
      .catch(error => {
        console.error(`Failed to send ${command} command:`, error);
        alert(`Failed to send ${command} command`);
      });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Injects Monitor</h2>

      {/* Scenario Control Panel */}
      <div className="bg-white p-4 border rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Scenario Control</h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">MQTT:</span>
            <span className={`px-2 py-1 text-xs rounded ${
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
              {scenarioStatus}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => sendCommand('start')}
            disabled={!isConnected}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Start Scenario
          </button>
          <button
            onClick={() => sendCommand('stop')}
            disabled={!isConnected}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Stop Scenario
          </button>
          <button
            onClick={() => sendCommand('reset')}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Reset Scenario
          </button>
        </div>
      </div>

      {/* Injects Monitor */}
      <div className="space-y-2">
        {injects.length === 0 && (
          <div className="text-gray-500">No injects received yet.</div>
        )}

        {injects.map((inject, index) => (
          <div key={index} className="p-4 border rounded bg-white shadow">
            <div className="text-sm text-gray-400">Received Inject:</div>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(inject, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
