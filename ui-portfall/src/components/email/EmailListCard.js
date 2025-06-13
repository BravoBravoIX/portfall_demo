import React from 'react';

export default function EmailListCard({ emails, selectedEmail, onSelectEmail }) {
  if (emails.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden h-full">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-700">Inbox</h3>
        </div>
        <div className="p-6 text-center text-gray-500">
          <p>No emails in this folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">Inbox</h3>
      </div>
      <div className="overflow-y-auto flex-1">
        <ul className="divide-y divide-gray-200">
          {emails.map(email => (
            <li 
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className={`cursor-pointer ${
                selectedEmail && selectedEmail.id === email.id 
                  ? 'bg-blue-50' 
                  : email.read 
                    ? 'bg-white hover:bg-gray-50' 
                    : 'bg-blue-50 hover:bg-blue-100 font-semibold'
              }`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium text-gray-900">{email.from}</div>
                  <div className="text-xs text-gray-500">{email.timestamp}</div>
                </div>
                <div className="mt-1 text-sm text-gray-600 truncate">{email.subject}</div>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {email.body ? email.body.substring(0, 60) + (email.body.length > 60 ? '...' : '') : '(No content)'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}