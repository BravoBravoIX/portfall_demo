import React from 'react';
import useContainerState from './useContainerState';

export default function ContainerVisualMapCard() {
  const {
    containerGrid,
    systemStatus,
    isAnimating
  } = useContainerState();

  // Get status color for container
  const getContainerColor = (status) => {
    // Force all containers to green if not in alarm state
    if (systemStatus.status === 'Normal') {
      return 'bg-green-500 border-green-700';
    }

    // We're in alarm state, use the container's actual status
    switch (status) {
      case 'error':
        return 'bg-red-500 border-red-700';
      case 'warning':
        return 'bg-yellow-400 border-yellow-600';
      case 'normal':
      default:
        return 'bg-green-500 border-green-700';
    }
  };

  // Get animation class for flickering effect during animation
  const getAnimationClass = (status) => {
    if (isAnimating && status === 'error') {
      return 'container-flicker';
    }
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold">Terminal Visual Map</h3>

        {/* Status indicator */}
        <div className="flex items-center">
          <span className="text-sm mr-2">System Status:</span>
          {systemStatus.status === 'ALARM' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <span className={`h-2 w-2 mr-1 bg-red-500 rounded-full ${isAnimating ? 'animate-pulse' : ''}`}></span>
              ALARM
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="h-2 w-2 mr-1 bg-green-500 rounded-full"></span>
              Normal
            </span>
          )}
        </div>
      </div>

      {/* Container grid */}
      <div className="w-full h-64 overflow-auto border border-gray-300 rounded bg-gray-100 p-1">
        <div className="grid grid-cols-20 gap-1 w-full">
          {containerGrid && containerGrid.map((container) => (
            <div
              key={container.id}
              className={`relative flex items-center justify-center h-6 border ${getContainerColor(container.status)} ${getAnimationClass(container.status)} text-xs font-mono text-white transition-colors duration-300`}
              title={`Container ID: ${container.id}, Status: ${container.status}`}
            >
              {container.id}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex space-x-4 mt-2 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="h-3 w-3 bg-green-500 mr-1"></div> Normal
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-yellow-400 mr-1"></div> Warning
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-red-500 mr-1"></div> Error
        </div>
      </div>

      {/* Alert message during animation */}
      {isAnimating && (
        <div className="mt-3 p-2 bg-red-50 border border-red-300 text-red-800 text-sm rounded">
          <p className="font-medium">ALERT: Container routing system breach in progress</p>
        </div>
      )}
    </div>
  );
}