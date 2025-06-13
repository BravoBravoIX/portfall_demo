import { useCallback } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useAisState() {
  const { 
    aisState, 
    aisShipVisibility,
    aisShipStatus,
    aisLogs,
    aisAnimationComplete,
    changeAisState,
    completeAisAnimation,
    resetAisState
  } = useGlobalState();
  
  // Converting the ship visibility to the format expected by the map component
  const getShipVisibilityMap = useCallback(() => {
    const map = {};
    
    // Convert boolean visibility to string status for the map component
    Object.entries(aisShipVisibility).forEach(([shipId, isVisible]) => {
      if (!isVisible) {
        map[shipId] = 'hidden';
      } else {
        // For visible ships, check if they should be flashing
        map[shipId] = aisState === 'alpha_missing' || aisState === 'all_missing' ? 'flashing' : 'normal';
      }
    });
    
    return map;
  }, [aisShipVisibility, aisState]);
  
  // Status information for UI components
  const getSystemStatus = useCallback(() => {
    switch (aisState) {
      case 'alpha_missing':
        return {
          status: 'Warning',
          message: 'Ship Alpha signal lost - Possible tracking system anomaly',
          color: 'warning',
          severity: 2
        };
      case 'all_missing':
        return {
          status: 'Critical',
          message: 'All vessel signals lost - AIS system failure',
          color: 'critical',
          severity: 3
        };
      case 'restored':
        return {
          status: 'Operational',
          message: 'All systems restored - monitoring active',
          color: 'success',
          severity: 1
        };
      case 'initial':
      default:
        return {
          status: 'Normal',
          message: 'System operating within normal parameters',
          color: 'success',
          severity: 1
        };
    }
  }, [aisState]);
  
  // Handle animations completion
  const completeAnimation = useCallback(() => {
    completeAisAnimation();
  }, [completeAisAnimation]);
  
  // Helper function to trigger state transitions
  const triggerStateChange = useCallback((newState) => {
    return changeAisState(newState);
  }, [changeAisState]);
  
  return {
    aisState,
    systemStatus: getSystemStatus(),
    shipStates: getShipVisibilityMap(),
    isAnimating: !aisAnimationComplete,
    signalLogs: aisLogs,
    triggerStateChange,
    completeAnimation,
    resetAisState
  };
}