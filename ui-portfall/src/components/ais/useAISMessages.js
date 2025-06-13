import { useState, useEffect } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useAISMessages() {
  const { getInjectsForDashboard } = useGlobalState();
  const aisInjects = getInjectsForDashboard('ais');
  
  const [ships, setShips] = useState({
    Ship_Alpha: { visible: true, status: 'normal' },
    Ship_Bravo: { visible: true, status: 'normal' },
    Ship_Charlie: { visible: true, status: 'normal' },
    Ship_Delta: { visible: true, status: 'normal' },
    Ship_Echo: { visible: true, status: 'normal' }
  });
  
  const [systemHealth, setSystemHealth] = useState({
    AIS_Receiver: { status: 'Operational', lastUpdate: new Date().toLocaleTimeString() },
    Data_Processing: { status: 'Operational', lastUpdate: new Date().toLocaleTimeString() },
    Database_Connection: { status: 'Operational', lastUpdate: new Date().toLocaleTimeString() },
    Map_Rendering: { status: 'Degraded', lastUpdate: new Date().toLocaleTimeString() }
  });
  
  const [lastSignals, setLastSignals] = useState([]);
  
  // Process injects and update state
  useEffect(() => {
    // Create a copy of the current state to modify
    const updatedShips = { ...ships };
    const updatedHealth = { ...systemHealth };
    const signals = [...lastSignals];
    
    // Process each inject in chronological order
    aisInjects.forEach(inject => {
      const { command, parameters, receivedAt } = inject;
      
      if (command === 'update_dashboard') {
        const { change, target_ships, system_component, system_status } = parameters || {};
        
        // Handle ship visibility changes
        if (change === 'hide_ship' && target_ships) {
          target_ships.forEach(ship => {
            if (updatedShips[ship]) {
              updatedShips[ship] = { 
                ...updatedShips[ship], 
                visible: false 
              };
              
              // Add to last signals
              signals.push({
                id: Date.now() + Math.random(),
                ship,
                event: 'Signal Lost',
                timestamp: receivedAt
              });
            }
          });
        }
        
        // Handle ship status changes
        if (change === 'change_ship_status' && target_ships) {
          const status = parameters.status || 'normal';
          target_ships.forEach(ship => {
            if (updatedShips[ship]) {
              updatedShips[ship] = { 
                ...updatedShips[ship], 
                status 
              };
              
              // Add to last signals
              signals.push({
                id: Date.now() + Math.random(),
                ship,
                event: `Status changed to ${status}`,
                timestamp: receivedAt
              });
            }
          });
        }
        
        // Handle hiding all ships
        if (change === 'hide_all_ships') {
          Object.keys(updatedShips).forEach(ship => {
            updatedShips[ship] = { 
              ...updatedShips[ship], 
              visible: false 
            };
          });
          
          // Add to last signals
          signals.push({
            id: Date.now() + Math.random(),
            ship: 'ALL VESSELS',
            event: 'Signal Lost',
            timestamp: receivedAt
          });
        }
        
        // Handle showing all ships
        if (change === 'show_all_ships') {
          Object.keys(updatedShips).forEach(ship => {
            updatedShips[ship] = { 
              ...updatedShips[ship], 
              visible: true 
            };
          });
          
          // Add to last signals
          signals.push({
            id: Date.now() + Math.random(),
            ship: 'ALL VESSELS',
            event: 'Signal Restored',
            timestamp: receivedAt
          });
        }
        
        // Handle system health changes
        if (change === 'system_health' && system_component) {
          if (updatedHealth[system_component]) {
            updatedHealth[system_component] = {
              status: system_status || 'Operational',
              lastUpdate: new Date(receivedAt).toLocaleTimeString()
            };
          }
        }
      }
    });
    
    // Keep only the last 20 signals, sorted by timestamp (newest first)
    const limitedSignals = signals
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);
    
    // Update all states
    setShips(updatedShips);
    setSystemHealth(updatedHealth);
    setLastSignals(limitedSignals);
    
  }, [aisInjects]);
  
  // Return the processed data
  return {
    ships,
    systemHealth,
    lastSignals,
    raw: aisInjects // Include the raw data for debugging
  };
}