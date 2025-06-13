import React from 'react';

export default function EmailContentCard({ email }) {
  if (!email) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden h-full">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium text-gray-700">Message</h3>
        </div>
        <div className="p-6 text-center text-gray-500 h-full flex items-center justify-center">
          <p>Select an email to view its contents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-900 truncate">{email.subject}</h3>
      </div>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">From: {email.from}</div>
            <div className="text-sm text-gray-700">To: {email.to}</div>
            {email.cc && <div className="text-sm text-gray-700">CC: {email.cc}</div>}
          </div>
          <div className="text-sm text-gray-500">{email.timestamp}</div>
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        {email.body ? (
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{email.body}</div>
        ) : (
          <div className="text-sm text-gray-500 italic">No content available</div>
        )}
        
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Attachments:</div>
            <ul className="space-y-2">
              {email.attachments.map((attachment, index) => (
                <li key={index} className="inline-block mr-2 mb-2">
                  <div className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    {attachment}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}