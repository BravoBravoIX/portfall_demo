import React, { useEffect, useRef } from 'react';
import { Navigation } from 'lucide-react';
import useAisState from './useAisState';

// ✅ Ship configuration
const shipsConfig = [
  { id: 'Ship_Alpha', name: 'Pacific Voyager', x: 35, y: 34, heading: 45 },
  { id: 'Ship_Bravo', name: 'Atlantic Carrier', x: 50, y: 60, heading: 90 },
  { id: 'Ship_Charlie', name: 'Southern Mariner', x: 75, y: 20, heading: 135 },
  { id: 'Ship_Delta', name: 'Northern Trader', x: 40, y: 80, heading: 270 },
  { id: 'Ship_Echo', name: 'Eastern Explorer', x: 60, y: 40, heading: 180 }
];

export default function AISMapCard() {
  const { 
    shipStates, 
    aisState, 
    systemStatus, 
    isAnimating, 
    completeAnimation 
  } = useAisState();
  
  // Reference to track animation
  const animationTimeoutRef = useRef(null);
  const animationCompletedRef = useRef(false);
  
  // Debug log the visibility of each ship
  console.log("CURRENT SHIP STATES:", JSON.stringify(shipStates));
  console.log("AIS OVERALL STATE:", aisState, "Animation?", isAnimating);
  
  // Handle animation completion
  useEffect(() => {
    if (isAnimating && !animationCompletedRef.current) {
      console.log('AIS animation running, setting timeout to complete it');
      // Set a timeout to complete the animation
      const animationDuration = aisState === 'all_missing' ? 5000 : 3000;
      
      // Clear any existing timeout to prevent multiple completions
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      
      animationTimeoutRef.current = setTimeout(() => {
        console.log('AIS animation timeout completed, calling completeAnimation()');
        completeAnimation();
        animationCompletedRef.current = true;
      }, animationDuration);
      
      return () => {
        // Clean up timeout if component unmounts during animation
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
          animationTimeoutRef.current = null;
        }
      };
    }
    
    // Reset the animation completed flag if animation is done
    if (!isAnimating) {
      animationCompletedRef.current = false;
    }
  }, [isAnimating, aisState, completeAnimation]);

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4 relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Live AIS Map</h3>
        
        {/* Status indicator */}
        {aisState !== 'initial' && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
            ${aisState === 'alpha_missing' ? 'bg-yellow-100 text-yellow-800' : 
              aisState === 'all_missing' ? 'bg-red-100 text-red-800' : 
              'bg-green-100 text-green-800'}`}
          >
            <span className={`h-2 w-2 mr-1 rounded-full 
              ${aisState === 'alpha_missing' ? 'bg-yellow-500' : 
                aisState === 'all_missing' ? 'bg-red-500' : 
                'bg-green-500'} 
              ${isAnimating ? 'animate-pulse' : ''}`}
            ></span>
            {systemStatus.status}
          </span>
        )}
      </div>
      <div className="w-full h-96 rounded overflow-hidden border border-gray-300 relative">
        <img 
          src="/aismap.png" 
          alt="AIS Map" 
          className="object-cover w-full h-full"
        />

        {/* Render ships */}
        {shipsConfig.map((ship) => {
          const state = shipStates[ship.id];
          console.log(`Ship ${ship.id} state: ${state}`);

          if (state === 'hidden') {
            console.log(`Ship ${ship.id} is hidden`);
            return null;
          }

          const shipWrapperStyle = {
            position: 'absolute',
            left: `${ship.x}%`,
            top: `${ship.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            textAlign: 'center'
          };

          const labelStyle = {
            marginTop: '4px',
            backgroundColor: 'white',
            padding: '2px 6px',
            fontSize: '0.75rem',
            borderRadius: '4px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap'
          };

          const isFlashing = state === 'flashing';
          const arrowColor = isFlashing ? '#ef4444' : '#4ade80';
          const pulseClass = isFlashing ? 'pulse-alert' : 'pulse-idle';

          return (
            <div key={ship.id} style={shipWrapperStyle} className="flex flex-col items-center">
              <div className={pulseClass}>
                <Navigation 
                  size={28} 
                  color={arrowColor} 
                  style={{ transform: `rotate(${ship.heading}deg)` }}
                />
              </div>
              <div style={labelStyle}>{ship.name}</div>
            </div>
          );
        })}
        
        {/* Alert messages based on state */}
        {aisState === 'alpha_missing' && (
          <div className="absolute bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded shadow-lg">
            <p className="text-sm font-medium">Warning: Ship Alpha signal lost. Tracking system anomaly detected.</p>
          </div>
        )}
        
        {aisState === 'all_missing' && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg">
            <p className="text-sm font-medium">CRITICAL: All vessel signals lost. AIS system failure suspected.</p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes pulse-idle {
            0% { transform: scale(1); opacity: 1; }
            10% { transform: scale(1.1); opacity: 0.8; }
            20% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes pulse-alert {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }

          .pulse-idle {
            animation: pulse-idle 5s infinite;
          }

          .pulse-alert {
            animation: pulse-alert 0.75s infinite;
          }
        `}
      </style>
    </div>
  );
}