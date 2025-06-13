import React from 'react';
import PolicyCategorySection from '../components/policies/PolicyCategorySection';

export default function PoliciesPage() {
  const policyData = [
    {
      title: 'Crisis Communications',
      policies: [
        { title: 'Crisis Comms SOP', file: 'crisis_comms_sop.pdf' },
        { title: 'Public Messaging Templates', file: 'public_messaging_templates.pdf' },
      ],
    },
    {
      title: 'Legal & Compliance',
      policies: [
        { title: 'Legal Risk Escalation Flowchart', file: 'legal_risk_flowchart.pdf' },
        { title: 'Breach Disclosure Checklist', file: 'breach_checklist.pdf' },
        { title: 'Insurer Communications Template', file: 'insurer_comm_template.pdf' },
      ],
    },
    {
      title: 'Technical Response',
      policies: [
        { title: 'Technical Containment Guide', file: 'technical_containment_guide.pdf' },
      ],
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Policy Binder</h2>
      {policyData.map((category, index) => (
        <PolicyCategorySection
          key={index}
          title={category.title}
          policies={category.policies}
        />
      ))}
    </div>
  );
}