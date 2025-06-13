import React from 'react';

export default function PolicyCard({ title, file }) {
  return (
    <div className="bg-white rounded shadow p-4 mb-2">
      <h4 className="text-md font-semibold mb-1">{title}</h4>
      <a
        href={`/policies/${file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline"
      >
        View / Download PDF
      </a>
    </div>
  );
}