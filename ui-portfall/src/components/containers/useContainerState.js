import { useCallback, useEffect, useRef } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useContainerState() {
  const {
    containerGrid,
    containerAlarmTriggered,
    containerAnimationComplete,
    containerLogs,
    containerErrors,
    triggerContainerAlarm,
    completeContainerAnimation,
    resetContainerState
  } = useGlobalState();
  
  // Animation refs to track state between renders
  const animationTimeoutRef = useRef(null);
  const animationRunningRef = useRef(false);
  const animationCompletedRef = useRef(false);
  
  // Get system status information for UI components
  const getSystemStatus = useCallback(() => {
    if (!containerAlarmTriggered) {
      return {
        status: 'Normal',
        message: 'System operating within normal parameters',
        color: 'success',
        severity: 1
      };
    }
    
    // In alarm state
    return {
      status: 'ALARM',
      message: 'Critical system breach detected',
      color: 'error',
      severity: 3
    };
  }, [containerAlarmTriggered]);
  
  // Calculate container status counts
  const getContainerStats = useCallback(() => {
    if (!containerGrid || containerGrid.length === 0) {
      return { normal: 0, warning: 0, error: 0 };
    }
    
    const counts = {
      normal: 0,
      warning: 0,
      error: 0
    };
    
    containerGrid.forEach(container => {
      counts[container.status]++;
    });
    
    return counts;
  }, [containerGrid]);
  
  // Handle animation completion
  const completeAnimation = useCallback(() => {
    console.log('Container state: calling completeContainerAnimation()');
    completeContainerAnimation();
    animationCompletedRef.current = true;
    animationRunningRef.current = false;
    
    // Clear any existing timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, [completeContainerAnimation]);
  
  // Start animation process when containerAlarmTriggered changes to true
  useEffect(() => {
    if (containerAlarmTriggered && !containerAnimationComplete && !animationRunningRef.current) {
      console.log('Container alarm triggered - starting animation sequence');
      animationRunningRef.current = true;
      
      // Use timeout instead of interval for more reliable animation completion
      // This mimics the AIS implementation pattern
      const animationDuration = 8000; // 8 seconds for the cascading effect
      
      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      // Set up timeout to complete animation after duration
      animationTimeoutRef.current = setTimeout(() => {
        console.log('Container animation timeout completed, calling completeAnimation()');
        completeAnimation();
      }, animationDuration);
      
      return () => {
        // Clean up timeout if component unmounts during animation
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
          animationTimeoutRef.current = null;
        }
      };
    }
    
    // Reset animation state when alarm is reset
    if (!containerAlarmTriggered) {
      animationCompletedRef.current = false;
      animationRunningRef.current = false;
    }
  }, [containerAlarmTriggered, containerAnimationComplete, completeAnimation]);
  
  return {
    containerGrid,
    systemStatus: getSystemStatus(),
    containerStats: getContainerStats(),
    isAnimating: containerAlarmTriggered && !containerAnimationComplete,
    logs: containerLogs,
    errors: containerErrors,
    triggerAlarm: triggerContainerAlarm,
    completeAnimation,
    resetState: resetContainerState
  };
}