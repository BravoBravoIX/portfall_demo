import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, FileText, Newspaper, Ship, Video, Package, MessageSquare, Users, Lock, Globe, CheckSquare, BarChart } from 'lucide-react';

/**
 * Reusable TeamDashboard component for consistent team pages
 * 
 * @param {Object} props Component properties
 * @param {string} props.teamName Name of the team (e.g., "Executive", "Legal")
 * @param {string} props.teamDescription Brief description of the team's role
 * @param {Object} props.headerExtras Additional JSX to show in the header
 * @param {Object} props.aboutContent JSX content for the About section
 * @param {Object} props.responsibilitiesContent JSX content for responsibilities
 * @param {Array} props.actions Array of action objects with link, iconName, title, description
 */

// Icon map for converting icon names to Lucide components
const iconMap = {
  mail: Mail,
  fileText: FileText,
  newspaper: Newspaper,
  ship: Ship,
  video: Video,
  package: Package,
  messageSquare: MessageSquare,
  users: Users
};
export default function TeamDashboard({
  teamName,
  teamDescription = "",
  headerExtras = null,
  aboutContent = null,
  responsibilitiesContent = null,
  actions = []
}) {
  return (
    <div className="container-fluid py-4 px-4">
      {/* Header with system title */}
      <div className="bg-dark text-white p-4 rounded-3 mb-4 shadow position-relative overflow-hidden">
        {/* Background pattern for modern look */}
        <div className="position-absolute" style={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0.07,
          background: `repeating-linear-gradient(
            45deg,
            #ffffff33,
            #ffffff33 10px,
            #ffffff22 10px,
            #ffffff22 20px
          )`
        }}></div>
        
        <div className="d-flex justify-content-between align-items-center position-relative">
          <div>
            <h1 className="fw-bold mb-2">Southgate Shipping Terminal</h1>
            <h3 className="text-light opacity-90 fw-light">{teamName} Interface</h3>
          </div>
          <div className="text-end">
            <div className="badge bg-danger p-2 mb-2 rounded-pill px-3">Secure Portal: Restricted Access</div>
            <div className="d-block">
              {teamName} Authorisation: <span className="badge bg-success rounded-pill px-3 ms-1">Active</span>
            </div>
            {headerExtras}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="row g-4">
        {/* Left column - System description and role info */}
        <div className="col-md-8">
          <div className="card shadow mb-4 border-0 rounded-3">
            <div className="card-body p-4">
              <h3 className="border-bottom pb-3 mb-4 fw-bold">Welcome to the Live Incident Response System</h3>
              
              <p className="lead fs-5 mb-4">{teamDescription}</p>
              
              <h4 className="mt-4 mb-3 fw-semibold">About This System</h4>
              {aboutContent}
              
              <div className="card bg-light mt-4 border-0 rounded-3">
                <div className="card-header bg-secondary bg-opacity-10 border-bottom-0 py-3">
                  <h4 className="mb-0 fw-semibold">Your Responsibilities</h4>
                </div>
                <div className="card-body ps-4">
                  {responsibilitiesContent}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Action buttons */}
        <div className="col-md-4">
          <div className="card shadow h-100 border-0 rounded-3">
            <div className="card-header bg-dark text-white rounded-top py-3">
              <h4 className="mb-0 fw-semibold">{teamName} Actions</h4>
            </div>
            <div className="card-body d-flex flex-column justify-content-between p-4">
              <div>
                <p className="lead mb-4">Access your critical systems:</p>
                
                <div className="d-grid gap-3">
                  {actions.map((action, index) => {
                    const buttonProps = {
                      key: index,
                      className: "btn btn-outline-dark d-flex align-items-center rounded-3 py-2 px-3 text-start hover-shadow",
                      style: {
                        transition: 'all 0.2s ease',
                        borderWidth: '1px',
                        textDecoration: 'none'
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    };

                    // Render external links as <a> tags, internal as <Link>
                    const ButtonComponent = action.external ? 'a' : Link;
                    const linkProps = action.external 
                      ? { href: action.link, target: "_blank", rel: "noopener noreferrer" }
                      : { to: action.link };

                    return (
                      <ButtonComponent 
                        {...buttonProps}
                        {...linkProps}
                      >
                      <span className="me-3 d-flex align-items-center justify-content-center" 
                            style={{
                              backgroundColor: '#f8f9fa', 
                              borderRadius: '12px',
                              width: '36px',
                              height: '36px'
                            }}>
                        {action.iconComponent ? 
                          React.createElement(action.iconComponent, { size: 20, strokeWidth: 1.5 }) :
                          React.createElement(iconMap[action.iconName] || Mail, { size: 20, strokeWidth: 1.5 })
                        }
                      </span>
                        <div className="text-start">
                          <strong className="d-block mb-0 fs-6">{action.title}</strong>
                          <small className="text-muted">{action.description}</small>
                        </div>
                      </ButtonComponent>
                    );
                  })}
                </div>
              </div>
              
              <div className="alert alert-secondary border-0 rounded-3 mt-4 mb-0 bg-secondary bg-opacity-10">
                <strong>Note:</strong> Navigation has been configured for {teamName} team access. Additional systems may be accessible through your team liaisons.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}