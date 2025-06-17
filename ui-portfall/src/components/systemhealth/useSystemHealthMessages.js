import { useState, useEffect } from 'react';
import { useGlobalState } from '../../state/globalState';

export default function useSystemHealthMessages() {
  const { getInjectsForDashboard } = useGlobalState();
  const logsInjects = getInjectsForDashboard('logs');
  
  const [logEvents, setLogEvents] = useState([]);

  useEffect(() => {
    // Process injects to extract log events
    const events = logsInjects.map(inject => {
      const { command, parameters, receivedAt } = inject;
      
      if (command === 'update_dashboard' && parameters.change) {
        return {
          change: parameters.change,
          source: parameters.source,
          user: parameters.user,
          ip: parameters.ip,
          file: parameters.file,
          task: parameters.task,
          receivedAt
        };
      }
      return null;
    }).filter(Boolean);
    
    setLogEvents(events);
  }, [logsInjects]);

  return {
    logEvents
  };
}