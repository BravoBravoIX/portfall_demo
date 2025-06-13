import React, { memo, useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Anchor, Clock, AlertCircle, Shield, Globe } from 'lucide-react';
import { MENU_ITEMS } from '../config/menu';
import { useAuth } from '../auth/AuthContext';
import { useGlobalState } from '../state/globalState';
import { GmailIcon, GoogleDocsIcon, GoogleDriveIcon } from '../components/icons/GoogleIcons';

// Using React.memo to prevent unnecessary re-renders
const MainLayout = memo(function MainLayout() {
  // Get user and role information from auth context
  const { user, logout } = useAuth();
  const { injects } = useGlobalState();
  const navigate = useNavigate();
  
  // State for time and scenario tracking (like PublicMediaDisplay)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertLevel, setAlertLevel] = useState('normal');
  const [scenarioStartTime, setScenarioStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Reference to track loaded status and performance
  const isLoadedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Update clock and elapsed time every second (like PublicMediaDisplay)
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

  // Detect scenario start when start_scenario inject is received (like PublicMediaDisplay)
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

  useEffect(() => {
    // Only run once on initial render
    if (!isLoadedRef.current) {
      const loadTime = Date.now() - startTimeRef.current;
      console.log(`MainLayout loaded in ${loadTime}ms`);
      isLoadedRef.current = true;
      
      // Set a flag to help identify page loading vs navigation
      window.PORTFALL_PAGE_LOADED = true;
    }
    
    // Optimization: Reduce debug console output in production
    if (process.env.NODE_ENV === 'production') {
      if (!window._originalConsoleLog) {
        window._originalConsoleLog = console.log;
        console.log = function(...args) {
          // Only log errors, warnings, and critical messages in production
          if (typeof args[0] === 'string' && 
             (args[0].includes('ERROR') || 
              args[0].includes('CRITICAL') || 
              args[0].includes('WARNING'))) {
            window._originalConsoleLog(...args);
          }
        };
      }
    }
    
    return () => {
      // Restore console.log if we modified it
      if (window._originalConsoleLog) {
        console.log = window._originalConsoleLog;
      }
    };
  }, []);

  // Format elapsed time helper (like PublicMediaDisplay)
  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Southgate Header - Same as public media display but with navigation */}
      <header className="bg-gray-900 text-white border-b border-gray-700" style={{ backgroundColor: '#111827' }}>
        <div className="container-fluid px-6 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ gap: '1.5rem' }}>
              <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                <Anchor className="w-8 h-8" style={{ color: '#60a5fa', width: '2rem', height: '2rem' }} />
                <span className="text-2xl font-bold" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Southgate</span>
              </div>
              
              {/* Navigation Menu */}
              <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                <Globe className="w-5 h-5" style={{ color: '#93c5fd', width: '1.25rem', height: '1.25rem' }} />
                <nav className="d-flex" style={{ gap: '1rem' }}>
                  {/* Home link - always first */}
                  <NavLink 
                    to={user.config?.homePage || '/'}
                    className={({isActive}) => isActive 
                      ? "text-blue-400 font-medium px-3 py-2 rounded-lg bg-gray-800"
                      : "text-gray-300 hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    }
                    style={({isActive}) => ({
                      color: isActive ? '#60a5fa' : '#d1d5db',
                      textDecoration: 'none',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      backgroundColor: isActive ? '#1f2937' : 'transparent',
                      transition: 'all 0.2s ease'
                    })}
                  >
                    Home
                  </NavLink>
                  
                  {/* Regular menu items */}
                  {MENU_ITEMS
                    .filter(item => item.roles.some(role => user.roles.includes(role)))
                    .map(item => (
                      <NavLink 
                        key={item.path}
                        to={item.path} 
                        className={({isActive}) => isActive 
                          ? "text-blue-400 font-medium px-3 py-2 rounded-lg bg-gray-800"
                          : "text-gray-300 hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        }
                        style={({isActive}) => ({
                          color: isActive ? '#60a5fa' : '#d1d5db',
                          textDecoration: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          backgroundColor: isActive ? '#1f2937' : 'transparent',
                          transition: 'all 0.2s ease'
                        })}
                      >
                        {item.name}
                      </NavLink>
                    ))
                  }
                  
                  {/* Google Services Icons */}
                  <div className="d-flex align-items-center" style={{ gap: '0.5rem', marginLeft: '1rem' }}>
                    <a 
                      href="https://mail.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      title="Gmail"
                    >
                      <GmailIcon size={20} />
                    </a>
                    
                    <a 
                      href="https://docs.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      title="Google Docs"
                    >
                      <GoogleDocsIcon size={20} />
                    </a>
                    
                    <a 
                      href="https://drive.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      title="Google Drive"
                    >
                      <GoogleDriveIcon size={20} />
                    </a>
                  </div>
                </nav>
              </div>
            </div>
            
            <div className="d-flex align-items-center" style={{ gap: '1.5rem' }}>
              {/* Scenario Timer */}
              <div className="d-flex align-items-center bg-gray-800 px-4 py-2 rounded-lg" style={{ gap: '0.5rem', backgroundColor: '#1f2937', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                <Clock className="w-5 h-5" style={{ color: '#34d399', width: '1.25rem', height: '1.25rem' }} />
                <div className="text-center">
                  <div className="text-xs" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Scenario Time</div>
                  <div className="text-lg font-mono" style={{ fontSize: '1.125rem', fontFamily: 'monospace', color: '#34d399' }}>
                    {scenarioStartTime ? formatElapsedTime(elapsedTime) : 'Waiting...'}
                  </div>
                </div>
              </div>
              
              {/* Current Time */}
              <div className="d-flex align-items-center bg-gray-800 px-4 py-2 rounded-lg" style={{ gap: '0.5rem', backgroundColor: '#1f2937', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                <Clock className="w-5 h-5" style={{ color: '#60a5fa', width: '1.25rem', height: '1.25rem' }} />
                <div className="text-center">
                  <div className="text-xs" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Current Time</div>
                  <div className="text-lg font-mono text-white" style={{ fontSize: '1.125rem', fontFamily: 'monospace' }}>
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              {/* Alert Status */}
              <div className="d-flex align-items-center px-4 py-2 rounded-lg bg-green-800" style={{ gap: '0.5rem', backgroundColor: '#166534', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
                <Shield className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem' }} />
                <div className="text-center">
                  <div className="text-xs opacity-90" style={{ fontSize: '0.75rem', opacity: 0.9 }}>Alert Level</div>
                  <div className="text-sm font-bold uppercase" style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {alertLevel}
                  </div>
                </div>
              </div>

              {/* User Info & Logout */}
              <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                {user.config && (
                  <span className="badge bg-info" style={{ backgroundColor: '#0ea5e9', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem' }}>
                    {user.config.label}
                  </span>
                )}
                <button 
                  className="btn btn-sm btn-outline-light"
                  style={{ 
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid #6b7280',
                    color: '#d1d5db',
                    backgroundColor: 'transparent',
                    borderRadius: '0.375rem'
                  }}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      
      <footer className="py-3 bg-light mt-auto">
        <div className="container text-center">
          <p className="text-muted mb-0">Southgate Simulation Environment v1.0</p>
        </div>
      </footer>
    </div>
  );
});

export default MainLayout;