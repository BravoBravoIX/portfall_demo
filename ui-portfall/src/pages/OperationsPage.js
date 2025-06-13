import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/menu';
import TeamDashboard from '../components/dashboard/TeamDashboard';
import { Ship, Video, Package, Mail, FileText, Newspaper } from 'lucide-react';

export default function OperationsPage() {
  const { user, switchRole } = useAuth();
  
  // Set operations role when this page loads
  useEffect(() => {
    switchRole(ROLES.OPERATIONS);
  }, [switchRole]);

  const aboutContent = (
    <>
      <p>The Operations Control Interface provides access to critical operational systems and infrastructure monitoring. As an operations team member, you have visibility into:</p>
      
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item d-flex align-items-center">
          <Ship className="me-2" size={18} strokeWidth={1.5} />
          <span>Automated Identification System (AIS) for vessel monitoring</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Video className="me-2" size={18} strokeWidth={1.5} />
          <span>Security surveillance and CCTV systems</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Package className="me-2" size={18} strokeWidth={1.5} />
          <span>Container management and tracking systems</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Mail className="me-2" size={18} strokeWidth={1.5} />
          <span>Operational communications and coordination</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <FileText className="me-2" size={18} strokeWidth={1.5} />
          <span>Standard operating procedures and response protocols</span>
        </li>
      </ul>
      
      <p>This system is designed to support frontline operational decision-making. You are expected to monitor critical systems, report anomalies, and implement tactical response measures.</p>
    </>
  );

  const responsibilitiesContent = (
    <>
      <p>As a member of the Operations Team, your role includes:</p>
      <ul>
        <li>Monitoring vessel movements and anomalies in the AIS system</li>
        <li>Maintaining physical security through CCTV monitoring</li>
        <li>Tracking container logistics and identifying irregularities</li>
        <li>Implementing operational procedures during incident response</li>
        <li>Documenting operational activities for after-action review</li>
        <li>Coordinating field personnel and resources</li>
      </ul>
      <p className="mb-0">Your frontline observations and actions are critical to effective incident containment and resolution.</p>
    </>
  );

  const actions = [
    {
      link: "/ais",
      iconName: "ship",
      title: "AIS Monitoring",
      description: "Track vessel movements and maritime activities"
    },
    {
      link: "/cctv",
      iconName: "video",
      title: "CCTV Surveillance",
      description: "Monitor physical security and site activity"
    },
    {
      link: "/containers",
      iconName: "package",
      title: "Container Management",
      description: "Track and manage shipping container logistics"
    },
    {
      link: "/email",
      iconName: "mail",
      title: "Access Email",
      description: "View operational communications and directives"
    },
    {
      link: "/policies",
      iconName: "fileText",
      title: "Standard Procedures",
      description: "Access operational protocols and procedures"
    },
    {
      link: "/media",
      iconName: "newspaper",
      title: "Media Updates",
      description: "Stay informed of public reporting on the incident"
    }
  ];

  return (
    <TeamDashboard
      teamName="Operations Control"
      teamDescription="This interface provides access to operational systems and infrastructure monitoring tools needed to maintain situational awareness and implement tactical responses during the incident. Your hands-on expertise is vital to securing assets and managing physical resources."
      aboutContent={aboutContent}
      responsibilitiesContent={responsibilitiesContent}
      actions={actions}
    />
  );
}
