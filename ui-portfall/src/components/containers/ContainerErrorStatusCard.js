import React, { useEffect } from 'react';
import useContainerMessages from './useContainerMessages';
import { useGlobalState } from '../../state/globalState';

export default function ContainerErrorStatusCard() {
  const { containerGrid, systemAlarmTriggered } = useContainerMessages();
  const { containerAnimationComplete } = useGlobalState();
  
  // Calculate status counts
  const calculateContainerStatuses = () => {
    if (!containerGrid || containerGrid.length === 0) {
      return { normal: 18, warning: 1, error: 2 };
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
  };
  
  const statusCounts = calculateContainerStatuses();
  const totalContainers = containerGrid?.length || 21;
  
  // Calculate system status based on error percentages
  const getSystemStatus = () => {
    if (!systemAlarmTriggered) {
      return { 
        status: 'Normal',
        color: 'text-green-500',
        message: 'System operating within normal parameters'
      };
    }
    
    const errorPercentage = (statusCounts.error / totalContainers) * 100;
    
    // If we've completed the animation, we're in critical state
    if (containerAnimationComplete) {
      return {
        status: 'CRITICAL',
        color: 'text-red-600 font-bold', // No animation in critical state
        message: 'Severe system breach - emergency response required'
      };
    }
    
    // During animation (caution state)
    if (errorPercentage > 75) {
      return {
        status: 'CRITICAL',
        color: 'text-red-600 font-bold animate-pulse', // Animate during caution state
        message: 'Severe system breach - emergency response required'
      };
    } else if (errorPercentage > 30) {
      return {
        status: 'Severe',
        color: 'text-red-500',
        message: 'Major system anomalies detected - urgent action required'
      };
    } else if (errorPercentage > 10) {
      return {
        status: 'Degraded',
        color: 'text-orange-500',
        message: 'Multiple anomalies detected - investigation recommended'
      };
    } else {
      return {
        status: 'Warning',
        color: 'text-yellow-500',
        message: 'Minor anomalies detected - monitoring recommended'
      };
    }
  };
  
  const systemStatus = getSystemStatus();
  
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-2">System Routing Anomalies</h3>
      
      {/* Container counts */}
      <ul className="text-sm text-gray-700 space-y-1 mb-3">
        <li className="text-red-600">🔴 {statusCounts.error} Error{statusCounts.error !== 1 ? 's' : ''} {statusCounts.error > 0 && systemAlarmTriggered && '(Security breach)'}</li>
        <li className="text-yellow-600">🟠 {statusCounts.warning} Warning{statusCounts.warning !== 1 ? 's' : ''} {statusCounts.warning > 0 && systemAlarmTriggered && '(Configuration anomaly)'}</li>
        <li className="text-green-600">🟢 {statusCounts.normal} Normal</li>
      </ul>
      
      {/* Overall system status */}
      <div className="border-t pt-2">
        <div className="font-medium text-sm">System Status: <span className={systemStatus.color}>{systemStatus.status}</span></div>
        <p className="text-xs text-gray-600 mt-1">{systemStatus.message}</p>
      </div>
    </div>
  );
}