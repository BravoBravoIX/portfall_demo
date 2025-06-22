import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ROLES } from '../config/menu';
import TeamDashboard from '../components/dashboard/TeamDashboard';
import { Lock, FileText, Globe } from 'lucide-react';
import { createGoogleActions } from '../components/icons/GoogleIcons';

export default function LegalPage() {
  const { user, switchRole } = useAuth();
  
  // Set legal role when this page loads
  useEffect(() => {
    switchRole(ROLES.LEGAL);
  }, [switchRole]);

  const aboutContent = (
    <>
      <p>The Legal Advisory Interface provides access to critical legal resources during maritime incidents. As a legal team member, you have visibility into:</p>
      
      <ul className="list-group list-group-flush mb-4">
        <li className="list-group-item d-flex align-items-center">
          <Lock className="me-2" size={18} strokeWidth={1.5} />
          <span>Confidential communications and correspondence (email)</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <FileText className="me-2" size={18} strokeWidth={1.5} />
          <span>Legal frameworks, compliance requirements, and response procedures</span>
        </li>
        <li className="list-group-item d-flex align-items-center">
          <Globe className="me-2" size={18} strokeWidth={1.5} />
          <span>Media coverage with potential legal implications and liability concerns</span>
        </li>
      </ul>
      
      <p>This system is designed to support legal oversight during incidents. You are expected to advise on legal risks, compliance issues, and appropriate disclosure requirements.</p>
    </>
  );

  const responsibilitiesContent = (
    <>
      <p>As a member of the Legal Team, your role includes:</p>
      <ul>
        <li>Assessing legal risks and providing advice to Executive leadership</li>
        <li>Ensuring compliance with regulatory disclosure requirements</li>
        <li>Reviewing public statements for legal accuracy and liability concerns</li>
        <li>Documenting incident details for potential litigation or insurance claims</li>
        <li>Advising on data privacy and confidentiality requirements</li>
      </ul>
      <p className="mb-0">Use the resources provided to guide the organization's response within appropriate legal frameworks.</p>
    </>
  );

  const actions = [
    ...createGoogleActions(),
    {
      link: "/media",
      iconName: "newspaper",
      title: "Monitor Media",
      description: "Track coverage with potential legal implications"
    }
  ];

  return (
    <TeamDashboard
      teamName="Legal Advisory"
      teamDescription="This interface provides access to legal resources and documentation needed to assess risks, ensure compliance, and advise leadership during the incident response. Your expertise is essential in navigating regulatory requirements and minimizing legal exposure."
      aboutContent={aboutContent}
      responsibilitiesContent={responsibilitiesContent}
      actions={actions}
    />
  );
}
