import React, { useState } from 'react';
import EmailMQTTCard from '../components/email/EmailMQTTCard';
import EmailFolderCard from '../components/email/EmailFolderCard';
import EmailListCard from '../components/email/EmailListCard';
import EmailContentCard from '../components/email/EmailContentCard';
import useEmailMessages from '../components/email/useEmailMessages';
import { useAuth } from '../auth/AuthContext';

export default function EmailPage() {
  // Get current user and role information
  const { user } = useAuth();
  
  // Use email messages hook to get filtered data
  const { 
    emails, 
    folders, 
    selectedFolder, 
    selectedEmail, 
    selectEmail, 
    selectFolder,
    currentUserEmail
  } = useEmailMessages(user?.config?.email);
  
  // Toggle for debug panel
  const [showMonitor, setShowMonitor] = useState(true);
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email System</h2>
          {currentUserEmail && (
            <p className="text-sm text-gray-600">Inbox for: {currentUserEmail}</p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {user?.roles?.includes('admin') && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Admin Mode: All Emails Visible</span>
          )}
          <button 
            onClick={() => setShowMonitor(!showMonitor)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            {showMonitor ? 'Hide' : 'Show'} Message Monitor
          </button>
        </div>
      </div>
      
      {/* Email Client Interface */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Folders (Left) */}
        <div className="md:col-span-3">
          <EmailFolderCard 
            folders={folders}
            selectedFolder={selectedFolder}
            onSelectFolder={selectFolder}
          />
        </div>
        
        {/* Email List (Middle) */}
        <div className="md:col-span-4">
          <EmailListCard 
            emails={emails.filter(email => email.folder === selectedFolder || selectedFolder === 'inbox')}
            selectedEmail={selectedEmail}
            onSelectEmail={selectEmail}
          />
        </div>
        
        {/* Email Content (Right) */}
        <div className="md:col-span-5">
          <EmailContentCard email={selectedEmail} />
        </div>
      </div>
      
      {/* Debug Panel */}
      {showMonitor && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Email Message Monitor</h3>
            <div className="text-sm text-gray-500">Debug Panel</div>
          </div>
          <div className="p-4">
            <EmailMQTTCard />
          </div>
        </div>
      )}
    </div>
  );
}
