import React, { useState, useEffect } from 'react';

export default function SystemMetricsCard() {
  const [metrics, setMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
    networkThroughput: 78
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        diskUsage: Math.max(15, Math.min(85, prev.diskUsage + (Math.random() - 0.5) * 5)),
        networkThroughput: Math.max(40, Math.min(95, prev.networkThroughput + (Math.random() - 0.5) * 15))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getProgressColor = (value) => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressIcon = (value) => {
    if (value > 80) return <span className="text-red-500">●</span>;
    if (value > 60) return <span className="text-yellow-500">●</span>;
    return <span className="text-green-500">●</span>;
  };

  const ProgressBar = ({ value, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${color}`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg h-full">
      <div className="bg-gray-800 text-white p-4 rounded-t-xl">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">▬</span>
          System Performance Metrics
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">CPU Usage</span>
                <div className="flex items-center">
                  <span className="mr-1">{getProgressIcon(metrics.cpuUsage)}</span>
                  <span className="text-sm">{Math.round(metrics.cpuUsage)}%</span>
                </div>
              </div>
              <ProgressBar value={metrics.cpuUsage} color={getProgressColor(metrics.cpuUsage)} />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Memory Usage</span>
                <div className="flex items-center">
                  <span className="mr-1">{getProgressIcon(metrics.memoryUsage)}</span>
                  <span className="text-sm">{Math.round(metrics.memoryUsage)}%</span>
                </div>
              </div>
              <ProgressBar value={metrics.memoryUsage} color={getProgressColor(metrics.memoryUsage)} />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Disk Usage</span>
                <div className="flex items-center">
                  <span className="mr-1">{getProgressIcon(metrics.diskUsage)}</span>
                  <span className="text-sm">{Math.round(metrics.diskUsage)}%</span>
                </div>
              </div>
              <ProgressBar value={metrics.diskUsage} color={getProgressColor(metrics.diskUsage)} />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Network Load</span>
                <div className="flex items-center">
                  <span className="mr-1">{getProgressIcon(metrics.networkThroughput)}</span>
                  <span className="text-sm">{Math.round(metrics.networkThroughput)}%</span>
                </div>
              </div>
              <ProgressBar value={metrics.networkThroughput} color={getProgressColor(metrics.networkThroughput)} />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              <span className="mr-1">⟲</span>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <span>
              <span className="mr-1">□</span>
              4 nodes monitored
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}