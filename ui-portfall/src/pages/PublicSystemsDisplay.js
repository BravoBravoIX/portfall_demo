import React, { useEffect, useState } from 'react';
import { Clock, Shield, Anchor, Monitor, MapPin, Container } from 'lucide-react';
import { useGlobalState } from '../state/globalState';
import AISMapCard from '../components/ais/AISMapCard';
import CCTVGridCard from '../components/cctv/CCTVGridCard';
import ContainerVisualMapCard from '../components/containers/ContainerVisualMapCard';

const PublicSystemsDisplay = () => {
  const { injects } = useGlobalState();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scenarioStartTime, setScenarioStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [systemStatus, setSystemStatus] = useState('normal');

  // Update clock and elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      if (scenarioStartTime) {
        setElapsedTime(Math.floor((now - scenarioStartTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [scenarioStartTime]);

  // Detect scenario start when start_scenario inject is received
  useEffect(() => {
    if (!scenarioStartTime) {
      const startScenarioInject = injects.find(inject => 
        inject.command === 'start_scenario'
      );
      if (startScenarioInject) {
        setScenarioStartTime(new Date(startScenarioInject.receivedAt));
      }
    }
  }, [injects, scenarioStartTime]);

  // Auto-refresh page every 5 minutes to prevent any memory leaks
  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      window.location.reload();
    }, 5 * 60 * 1000);
    return () => clearTimeout(refreshTimer);
  }, []);

  // Determine system status based on recent activity
  useEffect(() => {
    // Check for recent injects that indicate system issues
    const recentInjects = injects.slice(-10); // Last 10 injects
    const hasIssues = recentInjects.some(inject => 
      inject.command === 'update_dashboard' && (
        inject.parameters?.dashboard === 'ais' ||
        inject.parameters?.dashboard === 'cctv' ||
        inject.parameters?.dashboard === 'container'
      )
    );
    
    if (hasIssues) {
      setSystemStatus('warning');
    } else {
      setSystemStatus('normal');
    }
  }, [injects]);

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white border-b border-gray-700">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Anchor className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Southgate</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-300">
                <Monitor className="w-5 h-5" />
                <span className="text-lg font-medium">Operations Center Display</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Scenario Timer */}
              <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-green-400" />
                <div className="text-center">
                  <div className="text-xs text-gray-400">Scenario Time</div>
                  <div className="text-lg font-mono text-green-400">
                    {scenarioStartTime ? formatElapsedTime(elapsedTime) : 'Waiting...'}
                  </div>
                </div>
              </div>
              
              {/* Current Time */}
              <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
                <div className="text-center">
                  <div className="text-xs text-gray-400">Current Time</div>
                  <div className="text-lg font-mono text-white">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {/* System Status */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                systemStatus === 'warning' ? 'bg-orange-800' : 'bg-green-800'
              }`}>
                <Shield className="w-5 h-5" />
                <div className="text-center">
                  <div className="text-xs opacity-90">System Status</div>
                  <div className="text-sm font-bold uppercase">
                    {systemStatus === 'warning' ? 'Alert' : 'Normal'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - TV Optimized Layout */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left side - AIS Map and Containers */}
          <div className="col-span-8 flex flex-col gap-6">
            {/* AIS Map - Top */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Vessel Tracking</h2>
              </div>
              <div className="h-[calc(100%-60px)]">
                <AISMapCard />
              </div>
            </div>

            {/* Container Terminal - Bottom */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Container className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Container Terminal</h2>
              </div>
              <div className="h-[calc(100%-60px)]">
                <ContainerVisualMapCard />
              </div>
            </div>
          </div>

          {/* Right side - CCTV */}
          <div className="col-span-4">
            <div className="bg-white rounded-xl shadow-lg h-full p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Monitor className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Security Cameras</h2>
              </div>
              <div className="h-[calc(100%-60px)]">
                <CCTVGridCard />
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  systemStatus === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-900">
                  {systemStatus === 'warning' ? 'Systems Alert' : 'All Systems Normal'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Vessels: 5
              </div>
              <div className="text-sm text-gray-600">
                Cameras: 4/4 Online
              </div>
              <div className="text-sm text-gray-600">
                Containers: 200 Total
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Auto-refresh enabled (5 min) • Public Display
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicSystemsDisplay;