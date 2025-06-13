import React from 'react';
import PolicyCard from './PolicyCard';

export default function PolicyCategorySection({ title, policies }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="space-y-2">
        {policies.map((policy, index) => (
          <PolicyCard key={index} title={policy.title} file={policy.file} />
        ))}
      </div>
    </div>
  );
}