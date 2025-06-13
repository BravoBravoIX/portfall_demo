import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/menu';
import TeamDashboard from '../components/dashboard/TeamDashboard';
import { Mail, FileText, Newspaper, ClipboardList, BarChart } from 'lucide-react';
import { createGoogleActions } from '../components/icons/GoogleIcons';

export default function IncidentCoordinatorPage() {
  const { user, switchRole } = useAuth();
  
  // Set incident coordinator role when this page loads
  useEffect(() => {
    switchRole(ROLES.INCIDENT);
  }, [switchRole]);

  const aboutContent = (
    <>
      <p>The Incident Coordination Interface provides a comprehensive view of incident management activities and team communications. As the incident coordinator, you have visibility into:</p>
      
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item d-flex align-items-center">
          <Mail className="me-2" size={18} strokeWidth={1.5} />
          <span>Critical incident communications across all teams</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <FileText className="me-2" size={18} strokeWidth={1.5} />
          <span>Incident response plans, protocols, and decision trees</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Newspaper className="me-2" size={18} strokeWidth={1.5} />
          <span>Media coverage and external perception of the incident</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <ClipboardList className="me-2" size={18} strokeWidth={1.5} />
          <span>Cross-team coordination and resource allocation</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <BarChart className="me-2" size={18} strokeWidth={1.5} />
          <span>Incident timeline and situation reports</span>
        </li>
      </ul>
      
      <p>This system is designed to support strategic coordination across all incident response teams. You are expected to maintain a comprehensive view of the situation, facilitate information sharing between teams, and ensure coordinated action.</p>
    </>
  );

  const responsibilitiesContent = (
    <>
      <p>As the Incident Coordinator, your role includes:</p>
      <ul>
        <li>Maintaining overall incident situational awareness</li>
        <li>Facilitating communication between response teams</li>
        <li>Tracking action items and ensuring follow-through</li>
        <li>Providing regular status updates to Executive leadership</li>
        <li>Identifying cross-functional dependencies and risks</li>
        <li>Documenting key decisions and their rationale</li>
        <li>Ensuring all teams have the resources they need</li>
      </ul>
      <p className="mb-0">Your coordination expertise is critical to a cohesive and effective incident response that leverages the full capabilities of all teams.</p>
    </>
  );

  const actions = [
    ...createGoogleActions(),
    {
      link: "/policies",
      iconName: "fileText",
      title: "Response Protocols",
      description: "Review incident response plans and decision frameworks"
    },
    {
      link: "/media",
      iconName: "newspaper",
      title: "External Perception",
      description: "Monitor media coverage and public communications"
    }
  ];

  return (
    <TeamDashboard
      teamName="Incident Coordination"
      teamDescription="This interface provides comprehensive access to information across all response teams to support coordinated incident management. Your role in facilitating cross-team communication and maintaining situational awareness is critical to an effective response that minimizes impact and ensures proper resource allocation."
      aboutContent={aboutContent}
      responsibilitiesContent={responsibilitiesContent}
      actions={actions}
    />
  );
}
