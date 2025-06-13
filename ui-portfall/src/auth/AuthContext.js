// src/auth/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, ROLE_CONFIGS } from '../config/menu';

// Create the context
const AuthContext = createContext();

// Get role mapping for team names
const getROLEFromTeam = (teamKey) => {
  switch (teamKey) {
    case 'admin':
      return ROLES.ADMIN;
    case 'executive':
      return ROLES.EXECUTIVE;
    case 'legal':
      return ROLES.LEGAL;
    case 'operations':
      return ROLES.OPERATIONS;
    case 'technical':
      return ROLES.TECHNICAL;
    case 'media-comms':
      return ROLES.MEDIA;
    case 'incident-coordinator':
      return ROLES.INCIDENT;
    default:
      return null;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user is already logged in (from localStorage)
    const savedAuth = localStorage.getItem('portfallAuth');
    if (savedAuth) {
      const { team, role } = JSON.parse(savedAuth);
      return {
        team,
        roles: [role],
        isAuthenticated: true,
        currentRole: role,
        config: ROLE_CONFIGS[role] || ROLE_CONFIGS[ROLES.ADMIN]
      };
    }
    
    // Not authenticated by default
    return {
      team: null,
      roles: [],
      isAuthenticated: false,
      currentRole: null,
      config: null
    };
  });
  
  // Login function
  const login = (teamKey) => {
    const role = getROLEFromTeam(teamKey);
    if (role) {
      const authData = {
        team: teamKey,
        roles: [role],
        isAuthenticated: true,
        currentRole: role,
        config: ROLE_CONFIGS[role] || ROLE_CONFIGS[ROLES.ADMIN]
      };
      
      setUser(authData);
      
      // Save to localStorage
      localStorage.setItem('portfallAuth', JSON.stringify({
        team: teamKey,
        role: role
      }));
      
      return true;
    }
    return false;
  };
  
  // Logout function
  const logout = () => {
    setUser({
      team: null,
      roles: [],
      isAuthenticated: false,
      currentRole: null,
      config: null
    });
    localStorage.removeItem('portfallAuth');
  };
  
  // Function to manually switch roles (useful for testing)
  const switchRole = (role) => {
    if (Object.values(ROLES).includes(role)) {
      setUser(prev => ({
        ...prev,
        roles: [role],
        currentRole: role,
        config: ROLE_CONFIGS[role] || ROLE_CONFIGS[ROLES.ADMIN]
      }));
      return true;
    }
    return false;
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user,
        login,
        logout,
        switchRole,
        isAdmin: user.roles.includes(ROLES.ADMIN),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};