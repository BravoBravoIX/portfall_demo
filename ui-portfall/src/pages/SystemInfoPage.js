import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES, ROLE_CONFIGS } from '../config/menu';

export default function SystemInfoPage() {
  const { user, switchRole } = useAuth();
  
  // Reset to admin role when viewing system info page
  useEffect(() => {
    switchRole(ROLES.ADMIN);
  }, [switchRole]);
  return (
    <div>
      <h2>System Information</h2>
      <div className="alert alert-secondary mb-4">
        <h4>Role-Based Navigation System</h4>
        <p>This page is only visible to the Admin role (used for development and testing).</p>
        <p>Current role: <strong>{user.currentRole}</strong> ({ROLE_CONFIGS[user.currentRole]?.label})</p>
        <p>To access team-specific dashboards with filtered navigation, visit these pages:</p>
        <div className="mb-3">
          <a href="/executive" className="btn btn-outline-dark me-2 mb-2">Executive</a>
          <a href="/legal" className="btn btn-outline-dark me-2 mb-2">Legal</a>
          <a href="/operations" className="btn btn-outline-dark me-2 mb-2">Operations</a>
          <a href="/technical" className="btn btn-outline-dark me-2 mb-2">Technical</a>
          <a href="/media-comms" className="btn btn-outline-dark me-2 mb-2">Media & Comms</a>
          <a href="/incident-coordinator" className="btn btn-outline-dark me-2 mb-2">Incident Coordinator</a>
        </div>
        <p className="mb-0"><small>Each team page will automatically set the appropriate role and filter navigation links to only show relevant pages.</small></p>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">System Status</div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>CPU Usage:</span>
                  <span>42%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{width: '42%'}}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Memory Usage:</span>
                  <span>67%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{width: '67%'}}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Disk Usage:</span>
                  <span>28%</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{width: '28%'}}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Network:</span>
                  <span>Active</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">Active Services</div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  MQTT Broker
                  <span className="badge bg-success rounded-pill">Running</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Log Agent
                  <span className="badge bg-success rounded-pill">Running</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  NGINX
                  <span className="badge bg-success rounded-pill">Running</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  MailHog
                  <span className="badge bg-success rounded-pill">Running</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
