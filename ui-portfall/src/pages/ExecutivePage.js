import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/menu';
import TeamDashboard from '../components/dashboard/TeamDashboard';
import { Lock, FileText, Globe } from 'lucide-react';
import { createGoogleActions } from '../components/icons/GoogleIcons';

export default function ExecutivePage() {
  const { user, switchRole } = useAuth();
  
  // Set executive role when this page loads
  useEffect(() => {
    switchRole(ROLES.EXECUTIVE);
  }, [switchRole]);

  const aboutContent = (
    <>
      <p>The Executive Command Interface consolidates critical situational information during maritime disruptions. As a designated executive, you have visibility into:</p>
      
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item d-flex align-items-center">
          <Lock className="me-2" size={18} strokeWidth={1.5} />
          <span>Internal communication threads (email)</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <FileText className="me-2" size={18} strokeWidth={1.5} />
          <span>Policy and legal documentation</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Globe className="me-2" size={18} strokeWidth={1.5} />
          <span>Public-facing media and press coverage</span>
        </li>
      </ul>
      
      <p>This system is designed to assist high-level coordination under pressure. You are expected to lead briefings, make time-critical decisions, and approve public statements.</p>
    </>
  );

  const responsibilitiesContent = (
    <>
      <p>As a member of the Executive Team, your role includes:</p>
      <ul>
        <li>Leading regular updates to Workshop Control</li>
        <li>Reviewing legal and media risks before public disclosure</li>
        <li>Coordinating with Technical, Legal, and Media leads</li>
        <li>Approving or deferring official statements</li>
      </ul>
      <p className="mb-0">Use the tools provided to stay informed, escalate issues, and document decisions in line with organisational policy.</p>
    </>
  );

  const actions = [
    ...createGoogleActions(),
    {
      link: "/media",
      iconName: "newspaper",
      title: "Monitor Media",
      description: "Track press coverage and public sentiment"
    }
  ];

  return (
    <TeamDashboard
      teamName="Executive Command"
      teamDescription="This interface provides executive-level access to real-time operational insights, legal briefs, and external media reporting. Your role is critical in guiding strategic decisions, managing external communications, and coordinating across teams during this crisis."
      aboutContent={aboutContent}
      responsibilitiesContent={responsibilitiesContent}
      actions={actions}
    />
  );
}
