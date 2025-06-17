// This hook is no longer needed since system health processing
// has been moved to global state management in globalState.js
// Keeping file for backward compatibility but functionality is deprecated

import { useGlobalState } from '../../state/globalState';

export default function useSystemHealthMessages() {
  const { getInjectsForDashboard } = useGlobalState();
  const logsInjects = getInjectsForDashboard('logs');
  
  // Return logs for any components that might still need raw log data
  return {
    logEvents: logsInjects.map(inject => inject.parameters).filter(Boolean)
  };
}