import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle, TrendingUp, Shield, Globe, Anchor } from 'lucide-react';
import useMediaMessages from '../components/media/useMediaMessages';
import { useGlobalState } from '../state/globalState';

const PublicMediaDisplay = () => {
  const { mediaItems, timeline } = useMediaMessages();
  const { injects } = useGlobalState();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertLevel, setAlertLevel] = useState('normal');
  const [scenarioStartTime, setScenarioStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

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

  // Determine alert level based on recent media
  useEffect(() => {
    const recentItems = mediaItems.slice(0, 5);
    const hasCritical = recentItems.some(item => 
      item.title?.toLowerCase().includes('critical') || 
      item.title?.toLowerCase().includes('emergency') ||
      item.title?.toLowerCase().includes('attack')
    );
    const hasWarning = recentItems.some(item => 
      item.title?.toLowerCase().includes('warning') || 
      item.title?.toLowerCase().includes('alert') ||
      item.title?.toLowerCase().includes('incident')
    );
    
    if (hasCritical) {
      setAlertLevel('critical');
    } else if (hasWarning) {
      setAlertLevel('warning');
    } else {
      setAlertLevel('normal');
    }
  }, [mediaItems]);

  // Deduplicate timeline events
  const uniqueTimeline = timeline.reduce((acc, event) => {
    const exists = acc.find(item => item.mediaId === event.mediaId && item.event === event.event);
    if (!exists) {
      acc.push(event);
    }
    return acc;
  }, []);

  // Note: MQTT connection is handled by GlobalStateProvider in App.js

  // Debug logging
  useEffect(() => {
    console.log('PublicMediaDisplay - Media items:', mediaItems.length, mediaItems);
    if (mediaItems.length > 0) {
      console.log('First media item structure:', mediaItems[0]);
    }
    console.log('PublicMediaDisplay - Timeline:', timeline.length, timeline);
    if (timeline.length > 0) {
      console.log('First timeline event structure:', timeline[0]);
    }
    console.log('PublicMediaDisplay - Injects:', injects.length, injects);
    console.log('PublicMediaDisplay - Scenario start time:', scenarioStartTime);
  }, [mediaItems, timeline, injects, scenarioStartTime]);

  // Removed color-changing background - keep consistent styling

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Portfall Header - Similar to main app but without navigation */}
      <header className="bg-gray-900 text-white border-b border-gray-700">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Anchor className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">Southgate</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-300">
                <Globe className="w-5 h-5" />
                <span className="text-lg font-medium">Media Monitoring Display</span>
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
              
              {/* Alert Status */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                alertLevel === 'critical' ? 'bg-red-800 animate-pulse' :
                alertLevel === 'warning' ? 'bg-orange-800' : 'bg-green-800'
              }`}>
                {alertLevel !== 'normal' ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                <div className="text-center">
                  <div className="text-xs opacity-90">Alert Level</div>
                  <div className="text-sm font-bold uppercase">
                    {alertLevel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Latest Media Feed - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border border-gray-200 h-full">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold flex items-center text-gray-900">
                  <TrendingUp className="mr-3 w-6 h-6" />
                  Latest Media Updates
                </h2>
              </div>
              <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto bg-white">
                {mediaItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="mb-8">
                      <TrendingUp className="w-20 h-20 mx-auto mb-4 opacity-30" />
                      <h3 className="text-2xl font-bold mb-2 text-gray-300">Monitoring Media Channels</h3>
                      <p className="text-lg mb-4">Awaiting media updates from scenario events...</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>• Social media monitoring active</p>
                        <p>• News feed scanning enabled</p>
                        <p>• Alert systems ready</p>
                        <p>• Media events typically occur 10-15 minutes into scenario</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
                      <div className="flex items-center justify-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium">System Status: Active</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <div className="flex justify-between mb-1">
                          <span>MQTT Connection:</span>
                          <span className="text-green-400">Connected</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Data Channels:</span>
                          <span className="text-green-400">Listening</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Auto-refresh:</span>
                          <span className="text-green-400">Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  mediaItems.slice().reverse().slice(0, 10).map((item, index) => {
                    const isHero = index === 0; // Only the very first (latest) item is hero
                    return (
                    <div 
                      key={item.id || index} 
                      className={`bg-gray-900 border border-gray-600 rounded-lg hover:border-gray-500 transition-all duration-700 ease-in-out ${
                        isHero ? 'mb-16 border-blue-500 shadow-2xl p-6' : 'mb-4 p-4'
                      }`}
                      style={{ 
                        minHeight: isHero ? 'auto' : 'auto',
                        overflow: 'visible'
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-white mb-2">{item.title || 'Media Update'}</h3>
                          <div className="mb-3">
                            <span className="inline-block bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-medium uppercase">
                              {item.type || 'Media'}
                            </span>
                            {item.type === 'image' && item.imageSrc && (
                              <div className={`mt-2 ${isHero ? 'mb-8' : ''}`} style={{ 
                                overflow: 'hidden',
                                padding: isHero ? '20px' : '0'
                              }}>
                                <img 
                                  src={item.imageSrc} 
                                  alt={item.title} 
                                  className="max-w-full h-auto rounded border border-gray-600 mx-auto block"
                                  style={{ 
                                    maxHeight: isHero ? '480px' : '200px',
                                    width: isHero ? 'auto' : 'auto',
                                    maxWidth: isHero ? '100%' : '100%'
                                  }}
                                />
                              </div>
                            )}
                            {item.type === 'video' && item.videoSrc && (
                              <div className={`mt-2 ${isHero ? 'mb-8' : ''}`} style={{ 
                                overflow: 'hidden',
                                padding: isHero ? '20px' : '0'
                              }}>
                                <video 
                                  controls 
                                  className="max-w-full h-auto rounded border border-gray-600 mx-auto block"
                                  style={{ 
                                    maxHeight: isHero ? '480px' : '200px',
                                    width: isHero ? 'auto' : 'auto',
                                    maxWidth: isHero ? '100%' : '100%'
                                  }}
                                >
                                  <source src={item.videoSrc} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}
                            {item.type === 'tweet' && item.imageSrc && (
                              <div className={`mt-2 ${isHero ? 'mb-8' : ''}`} style={{ 
                                overflow: 'hidden',
                                padding: isHero ? '20px' : '0'
                              }}>
                                <img 
                                  src={item.imageSrc} 
                                  alt={item.title} 
                                  className="max-w-full h-auto rounded border border-gray-600 mx-auto block"
                                  style={{ 
                                    maxHeight: isHero ? '480px' : '200px',
                                    width: isHero ? 'auto' : 'auto',
                                    maxWidth: isHero ? '100%' : '100%'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-400">
                            <span>{item.source || 'Unknown Source'}</span>
                            <span>{item.timestamp || 'Now'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Timeline - Takes up 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg shadow border border-gray-200 h-full">
              <div className="p-4 border-b border-gray-200 bg-gray-100">
                <h2 className="text-2xl font-bold flex items-center text-gray-900">
                  <Clock className="mr-3 w-6 h-6" />
                  Event Timeline
                </h2>
              </div>
              <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto bg-gray-50">
                {uniqueTimeline.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <h4 className="text-lg font-semibold mb-2">Event Timeline</h4>
                    <p className="text-sm mb-4">Monitoring for events...</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Scenario events will appear here</p>
                      <p>as they unfold in real-time</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uniqueTimeline.slice().reverse().slice(0, 20).map((event, index) => (
                      <div key={`${event.mediaId}-${index}`} className="border-l-2 border-blue-500 pl-4 py-2">
                        <div className="text-xs text-gray-500 mb-1">
                          {event.timestamp || 'Recent'}
                        </div>
                        <div className="text-sm text-gray-900 font-medium">
                          {event.event || 'Timeline Event'}
                        </div>
                        {event.mediaId && (
                          <div className="text-xs text-blue-600 mt-1">
                            Media ID: {event.mediaId}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200 shadow">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-900">System Active</span>
              </div>
              <div className="text-sm text-gray-600">
                Total Updates: {mediaItems.length}
              </div>
              <div className="text-sm text-gray-600">
                Last Update: {mediaItems[0]?.timestamp || 'N/A'}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Auto-refresh enabled (5 min)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMediaDisplay;