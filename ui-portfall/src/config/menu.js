// src/config/menu.js
// Menu configuration for role-based navigation
// Each menu item specifies which roles can access it

export const MENU_ITEMS = [
  // Common items - accessible in multiple roles
  { name: 'Media',       path: '/media',       roles: ['admin', 'executive', 'legal', 'media', 'operations', 'technical', 'incident'], icon: 'newspaper' },
  
  // Technical-focused items
  { name: 'AIS',         path: '/ais',         roles: ['admin', 'operations'], icon: 'ship' },
  { name: 'CCTV',        path: '/cctv',        roles: ['admin', 'operations'], icon: 'video' },
  { name: 'System Health', path: '/comms',     roles: ['admin', 'technical'], icon: 'activity' },
  { name: 'Containers',  path: '/containers',  roles: ['admin', 'operations'], icon: 'box' },
  { name: 'Vendor',      path: '/vendor',      roles: ['admin', 'technical'], icon: 'users' },
  
  // Admin-only item
  { name: 'Injects',     path: '/injects',     roles: ['admin'], icon: 'bolt' },
  
  // Team pages (for development and testing)
  { name: 'Executive',           path: '/executive',           roles: ['admin'], icon: 'crown' },
  { name: 'Legal',               path: '/legal',               roles: ['admin'], icon: 'gavel' },
  { name: 'Operations',          path: '/operations',          roles: ['admin'], icon: 'cogs' },
  { name: 'Technical',           path: '/technical',           roles: ['admin'], icon: 'wrench' },
  { name: 'Media & Comms',       path: '/media-comms',         roles: ['admin'], icon: 'broadcast-tower' },
  { name: 'Incident Coordinator', path: '/incident-coordinator', roles: ['admin'], icon: 'user-shield' },
];

// Role definitions
export const ROLES = {
  // Admin role has access to everything (for development)
  ADMIN: 'admin',
  
  // Team roles map to specific role-based pages
  EXECUTIVE: 'executive',
  LEGAL: 'legal',
  OPERATIONS: 'operations',
  TECHNICAL: 'technical',
  MEDIA: 'media',
  INCIDENT: 'incident'
};

// Role-specific configurations
export const ROLE_CONFIGS = {
  [ROLES.EXECUTIVE]: {
    label: 'Executive Team',
    homePage: '/executive',
    description: 'Access to executive-level information and decision making',
    email: 'ceo@simrange.local'
  },
  [ROLES.LEGAL]: {
    label: 'Legal Team',
    homePage: '/legal',
    description: 'Access to legal documentation and compliance information',
    email: 'legal@simrange.local'
  },
  [ROLES.OPERATIONS]: {
    label: 'Operations Team',
    homePage: '/operations',
    description: 'Access to operational systems and status information',
    email: 'ops@simrange.local'
  },
  [ROLES.TECHNICAL]: {
    label: 'Technical Team',
    homePage: '/technical',
    description: 'Access to technical systems, infrastructure, and security',
    email: 'tech@simrange.local'
  },
  [ROLES.MEDIA]: {
    label: 'Media & Communications Team',
    homePage: '/media-comms',
    description: 'Access to public relations and communications',
    email: 'media@simrange.local'
  },
  [ROLES.INCIDENT]: {
    label: 'Incident Coordinator',
    homePage: '/incident-coordinator',
    description: 'Access to all incident response coordination',
    email: 'coordinator@simrange.local'
  },
  [ROLES.ADMIN]: {
    label: 'Administrator',
    homePage: '/injects',
    description: 'Full access to all systems and configuration',
    email: 'admin@simrange.local'
  }
};