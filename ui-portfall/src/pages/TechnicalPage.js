import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/menu';
import TeamDashboard from '../components/dashboard/TeamDashboard';
import { MessageSquare, Users, Mail, FileText, Newspaper } from 'lucide-react';
import { createGoogleActions } from '../components/icons/GoogleIcons';

export default function TechnicalPage() {
  const { user, switchRole } = useAuth();
  
  // Set technical role when this page loads
  useEffect(() => {
    switchRole(ROLES.TECHNICAL);
  }, [switchRole]);

  const aboutContent = (
    <>
      <p>The Technical Support Interface provides access to critical IT infrastructure systems and network monitoring tools. As a technical team member, you have visibility into:</p>
      
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item d-flex align-items-center">
          <MessageSquare className="me-2" size={18} strokeWidth={1.5} />
          <span>Network and systems communications infrastructure</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Users className="me-2" size={18} strokeWidth={1.5} />
          <span>Vendor management systems and technical documentation</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Mail className="me-2" size={18} strokeWidth={1.5} />
          <span>Technical team communications and incident reporting</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Newspaper className="me-2" size={18} strokeWidth={1.5} />
          <span>Public reporting on technical aspects of the incident</span>
        </li>
      </ul>
      
      <p>This system is designed to support technical analysis and response activities. You are expected to monitor systems for integrity, perform security analysis, and implement technical countermeasures as needed.</p>
    </>
  );

  const responsibilitiesContent = (
    <>
      <p>As a member of the Technical Team, your role includes:</p>
      <ul>
        <li>Monitoring communications infrastructure for anomalies</li>
        <li>Analyzing technical indicators of compromise</li>
        <li>Implementing security controls and countermeasures</li>
        <li>Coordinating with vendors for technical support</li>
        <li>Documenting technical findings and forensic evidence</li>
        <li>Providing technical briefings to leadership</li>
      </ul>
      <p className="mb-0">Your technical expertise is critical to understanding the nature of the incident and implementing effective technical controls.</p>
    </>
  );

  const actions = [
    {
      link: "/comms",
      iconName: "messageSquare",
      title: "Communications Systems",
      description: "Monitor network infrastructure and analyze traffic"
    },
    {
      link: "/vendor",
      iconName: "users",
      title: "Vendor Management",
      description: "Access vendor systems and technical documentation"
    },
    ...createGoogleActions(),
    {
      link: "/media",
      iconName: "newspaper",
      title: "Media Coverage",
      description: "Monitor technical reporting on the incident"
    }
  ];

  return (
    <TeamDashboard
      teamName="Technical Support"
      teamDescription="This interface provides access to IT systems and infrastructure monitoring needed to analyze technical anomalies and implement security controls. Your technical expertise is essential to identifying the nature of the incident and developing effective countermeasures."
      aboutContent={aboutContent}
      responsibilitiesContent={responsibilitiesContent}
      actions={actions}
    />
  );
}
