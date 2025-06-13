import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { connectWebSocket, onInjectReceived, removeListener, disconnectWebSocket } from '../services/websocketClient';
// MQTT client import removed

// Generate container grid data (row A-J, column 1-20 = 200 containers)
const generateContainerGrid = () => {
  const grid = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = Array.from({ length: 20 }, (_, i) => i + 1);
  
  rows.forEach(row => {
    cols.forEach(col => {
      const id = `${col}${row}`;
      grid.push({
        id,
        status: 'normal', // normal, warning, error
        x: col,
        y: rows.indexOf(row) + 1
      });
    });
  });
  
  return grid;
};

const GlobalStateContext = createContext();

export function GlobalStateProvider({ children }) {
  const [injects, setInjects] = useState([]);
  // Track processed inject IDs
  const processedInjectIds = useRef(new Set());
  
  // Add global container state
  const [containerGrid, setContainerGrid] = useState(() => generateContainerGrid());
  const [containerLogs, setContainerLogs] = useState([]);
  const [containerErrors, setContainerErrors] = useState([]);
  const [containerAlarmTriggered, setContainerAlarmTriggered] = useState(false);
  const [containerAnimationComplete, setContainerAnimationComplete] = useState(true); // Initialize as true like AIS state
  
  // Add global AIS state
  const [aisState, setAisState] = useState('initial'); // 'initial', 'alpha_missing', 'all_missing', 'restored'
  const [aisShipVisibility, setAisShipVisibility] = useState({
    Ship_Alpha: true,
    Ship_Bravo: true,
    Ship_Charlie: true,
    Ship_Delta: true,
    Ship_Echo: true
  });
  const [aisShipStatus, setAisShipStatus] = useState({
    Ship_Alpha: 'normal',
    Ship_Bravo: 'normal',
    Ship_Charlie: 'normal',
    Ship_Delta: 'normal',
    Ship_Echo: 'normal'
  });
  const [aisLogs, setAisLogs] = useState([]);
  const [aisAnimationComplete, setAisAnimationComplete] = useState(true);

  // Initialize state on component mount
  useEffect(() => {
    console.log('Initializing state');
    try {
      // CRITICAL: ALWAYS clear container state for this demo
      // This ensures that we always start fresh when the application loads
      localStorage.removeItem('containerTriggered');
      console.log('Forcing clean container state on initialization');

      // Reset container state to initial values
      setContainerAlarmTriggered(false);
      setContainerAnimationComplete(true); // Animation complete in initial state (nothing to animate)
      setContainerGrid(generateContainerGrid());
      setContainerLogs([]);
      setContainerErrors([]);

      console.log('Container state initialization complete, starting in normal (green) state');
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }, []);
  
  // MQTT connection removed
  
  // Set up WebSocket connection
  useEffect(() => {
    console.log('Setting up WebSocket connection');
    
    // First disconnect any existing connection
    disconnectWebSocket();
    
    // Then connect fresh
    connectWebSocket();
    
    // Set up message handler
    const handleWebSocketMessage = (message) => {
      try {
        // Generate an ID for this message if it doesn't have one
        if (!message.id) {
          message.id = `ws_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        }
        
        // Skip if already processed
        if (processedInjectIds.current.has(message.id)) {
          console.log('Skipping duplicate WebSocket message:', message.id);
          return;
        }
        
        // Mark as processed
        processedInjectIds.current.add(message.id);
        
        // Add receivedAt timestamp if not present
        if (!message.receivedAt) {
          message.receivedAt = new Date().toISOString();
        }
        
        // Process command
        handleIncomingMessage(message);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    // Register the handler
    const listener = onInjectReceived(handleWebSocketMessage);
    
    // Clean up on unmount
    return () => {
      removeListener(listener);
      disconnectWebSocket();
    };
  }, []);

  // Handle incoming messages from any source
  const handleIncomingMessage = useCallback((message) => {
    console.log('Processing message:', message);

    // DEBUGGING: Log all container-related messages
    if (message.parameters?.dashboard === 'container' || message.parameters?.dashboard === 'containers') {
      console.log('CONTAINER MESSAGE RECEIVED:', JSON.stringify(message));
    }

    // Handle AIS updates
    if (message.command === 'update_dashboard' && 
        message.parameters?.dashboard === 'ais') {
      const { change } = message.parameters || {};
      
      if (change === 'hide_ship' && message.parameters?.target_ships?.includes('Ship_Alpha')) {
        changeAisState('alpha_missing');
      } 
      else if (change === 'hide_all_ships') {
        changeAisState('all_missing');
      }
      else if (change === 'show_all_ships') {
        changeAisState('restored');
      }
    }
    
    // Handle container triggers
    if (message.command === 'update_dashboard' &&
        (message.parameters?.dashboard === 'container' || message.parameters?.dashboard === 'containers') &&
        message.parameters?.change === 'log_config_manipulation') {

      // Ensure we have a unique ID for this specific message
      const messageId = message.id || `container_trigger_${Date.now()}`;

      console.log(`CRITICAL MESSAGE RECEIVED: container log_config_manipulation from ${messageId}`);

      // IMPORTANT: Always try to trigger animation for this demo
      // This ensures that animation runs every time the log_config_manipulation message is received
      console.log(`CONTAINER MESSAGE: Triggering container alarm from message ${messageId}`);

      // Force clear any previously processed IDs for this demo
      processedInjectIds.current.clear();

      // Trigger the alarm regardless of previous state
      const result = triggerContainerAlarm();
      console.log(`Trigger result: ${result ? 'animation started' : 'already in alarm state'}`);

      // Add this message ID to processed list after triggering
      processedInjectIds.current.add(messageId);

      // Always add to injects list regardless of processing status
    }
    
    // Add message to injects list
    setInjects(prev => {
      const updated = [...prev, message];
      // Keep the list from growing too large
      if (updated.length > 200) {
        return updated.slice(-200);
      }
      return updated;
    });
  }, []);
  
  // Utility to get injects filtered by dashboard type
  const getInjectsForDashboard = useCallback((dashboard) => {
    return injects.filter(inject => inject.dashboard === dashboard);
  }, [injects]);
  
  // Container animation functions
  const triggerContainerAlarm = useCallback(() => {
    console.log('CONTAINER TRIGGER: Triggering container alarm');
    console.log('CONTAINER TRIGGER: Current state - alarmTriggered:', containerAlarmTriggered, 'animationComplete:', containerAnimationComplete);

    // Skip if already in alarm state
    if (containerAlarmTriggered) {
      console.log('CONTAINER TRIGGER: Container alarm already triggered, ignoring');
      return false;
    }

    // Force clear localStorage to ensure we don't have stale state
    localStorage.removeItem('containerTriggered');

    // Update state to trigger animation
    console.log('CONTAINER TRIGGER: Setting state to start animation');
    setContainerAlarmTriggered(true);
    setContainerAnimationComplete(false);

    // Ensure containers are in normal state to start animation from fresh state
    setContainerGrid(generateContainerGrid());

    // Do NOT set localStorage here - only after animation completes
    console.log('CONTAINER TRIGGER: Successfully triggered, animation should start');
    return true;
  }, [containerAlarmTriggered, containerAnimationComplete]);

  const completeContainerAnimation = useCallback(() => {
    console.log('Container animation complete - setting final state');
    setContainerAnimationComplete(true);

    // Set all containers to error state
    setContainerGrid(current =>
      current.map(container => ({
        ...container,
        status: 'error'
      }))
    );

    // Set localStorage flag only after animation completes
    localStorage.setItem('containerTriggered', 'true');
    console.log('Container animation completed and state persisted');
  }, []);
  
  // AIS state functions
  const changeAisState = useCallback((newState) => {
    // Validate the state
    const validStates = ['initial', 'alpha_missing', 'all_missing', 'restored'];
    if (!validStates.includes(newState)) {
      console.error(`Invalid AIS state: ${newState}`);
      return false;
    }
    
    console.log(`Changing AIS state to: ${newState}`);
    setAisState(newState);
    setAisAnimationComplete(false);
    
    // Update ship visibility
    if (newState === 'alpha_missing') {
      setAisShipVisibility({
        Ship_Alpha: false,
        Ship_Bravo: true,
        Ship_Charlie: true,
        Ship_Delta: true,
        Ship_Echo: true
      });
    } 
    else if (newState === 'all_missing') {
      setAisShipVisibility({
        Ship_Alpha: false,
        Ship_Bravo: false,
        Ship_Charlie: false,
        Ship_Delta: false,
        Ship_Echo: false
      });
    }
    else if (newState === 'restored' || newState === 'initial') {
      setAisShipVisibility({
        Ship_Alpha: true,
        Ship_Bravo: true,
        Ship_Charlie: true,
        Ship_Delta: true,
        Ship_Echo: true
      });
    }
    
    return true;
  }, []);
  
  const completeAisAnimation = useCallback(() => {
    console.log('AIS animation complete');
    setAisAnimationComplete(true);
  }, []);
  
  // Reset functions
  const resetContainerState = useCallback(() => {
    console.log('Resetting container state');
    // Remove localStorage flag to ensure fresh start
    localStorage.removeItem('containerTriggered');

    // Reset all state variables
    setContainerAlarmTriggered(false);
    setContainerAnimationComplete(true);
    setContainerGrid(generateContainerGrid());
    setContainerLogs([]);
    setContainerErrors([]);

    console.log('Container state fully reset, including localStorage');
  }, []);
  
  const resetAisState = useCallback(() => {
    console.log('Resetting AIS state');
    setAisState('initial');
    setAisAnimationComplete(true);
    setAisShipVisibility({
      Ship_Alpha: true,
      Ship_Bravo: true,
      Ship_Charlie: true,
      Ship_Delta: true,
      Ship_Echo: true
    });
    setAisShipStatus({
      Ship_Alpha: 'normal',
      Ship_Bravo: 'normal',
      Ship_Charlie: 'normal',
      Ship_Delta: 'normal',
      Ship_Echo: 'normal'
    });
    setAisLogs([]);
  }, []);

  return (
    <GlobalStateContext.Provider value={{ 
      injects, 
      getInjectsForDashboard,
      
      // Container state
      containerGrid,
      setContainerGrid,
      containerLogs,
      setContainerLogs,
      containerErrors,
      setContainerErrors,
      containerAlarmTriggered,
      containerAnimationComplete,
      triggerContainerAlarm,
      completeContainerAnimation,
      resetContainerState,
      
      // AIS state
      aisState,
      aisShipVisibility,
      aisShipStatus,
      aisLogs,
      aisAnimationComplete,
      changeAisState,
      completeAisAnimation,
      resetAisState
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}