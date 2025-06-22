import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/menu';
import TeamDashboard from '../components/dashboard/TeamDashboard';
import { Newspaper, Mail, FileText, MessageCircle } from 'lucide-react';
import { createGoogleActions } from '../components/icons/GoogleIcons';

export default function MediaCommunicationsPage() {
  const { user, switchRole } = useAuth();
  
  // Set media role when this page loads
  useEffect(() => {
    switchRole(ROLES.MEDIA);
  }, [switchRole]);

  const aboutContent = (
    <>
      <p>The Media & Communications Interface provides tools for public relations management during maritime incidents. As a media team member, you have access to:</p>
      
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item d-flex align-items-center">
          <Newspaper className="me-2" size={18} strokeWidth={1.5} />
          <span>Media monitoring and press release management tools</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Mail className="me-2" size={18} strokeWidth={1.5} />
          <span>Stakeholder communications and media correspondence</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <FileText className="me-2" size={18} strokeWidth={1.5} />
          <span>Crisis communication policies and public relations guidelines</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <MessageCircle className="me-2" size={18} strokeWidth={1.5} />
          <span>Social media monitoring and public sentiment analysis</span>
        </li>
      </ul>
      
      <p>This system is designed to support strategic communications during incidents. You are expected to manage public perception, prepare official statements, and coordinate with leadership on external messaging.</p>
    </>
  );

  const responsibilitiesContent = (
    <>
      <p>As a member of the Media & Communications Team, your role includes:</p>
      <ul>
        <li>Monitoring media coverage and public sentiment</li>
        <li>Drafting press releases and public statements</li>
        <li>Coordinating with Executive leadership on messaging strategy</li>
        <li>Managing stakeholder communications</li>
        <li>Preparing spokespersons for public appearances</li>
        <li>Ensuring consistent and accurate public information</li>
      </ul>
      <p className="mb-0">Your communications expertise is essential in managing public perception and maintaining organizational credibility throughout the incident.</p>
    </>
  );

  const actions = [
    {
      link: "/media",
      iconName: "newspaper",
      title: "Media Center",
      description: "Monitor coverage and manage press releases"
    },
    ...createGoogleActions()
  ];

  return (
    <TeamDashboard
      teamName="Media & Communications"
      teamDescription="This interface provides access to public relations and media monitoring tools needed to manage external communications during the incident. Your expertise in crafting messages and managing public perception is crucial to maintaining stakeholder confidence and organizational reputation."
      aboutContent={aboutContent}
      responsibilitiesContent={responsibilitiesContent}
      actions={actions}
    />
  );
}
