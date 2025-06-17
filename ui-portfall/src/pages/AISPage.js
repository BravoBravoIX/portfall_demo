import React from 'react';
import AISMapCard from '../components/ais/AISMapCard';
import VesselStatusCard from '../components/ais/VesselStatusCard';
import LastSignalLogCard from '../components/ais/LastSignalLogCard';
import SystemHealthCard from '../components/ais/SystemHealthCard';
import useAisState from '../components/ais/useAisState';
import { useGlobalState } from '../state/globalState';

export default function AISPage() {
  const { resetAisState, aisState } = useAisState();
  
  // Handle reset for development mode
  const handleReset = () => {
    resetAisState();
    window.location.reload();
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AIS Tracking System</h2>
        
        {/* Development-only reset button */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            onClick={handleReset}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
          >
            Reset AIS State
          </button>
        )}
      </div>

      <AISMapCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VesselStatusCard />
        <LastSignalLogCard />
      </div>

      <SystemHealthCard />
    </div>
  );
}
