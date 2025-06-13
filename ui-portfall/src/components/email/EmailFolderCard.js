import React from 'react';

export default function EmailFolderCard({ folders, selectedFolder, onSelectFolder }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-700">Folders</h3>
      </div>
      <div className="p-2">
        <ul className="space-y-1">
          {folders.map(folder => (
            <li key={folder.id}>
              <button 
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center justify-between ${
                  selectedFolder === folder.id 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{folder.name}</span>
                {folder.unread > 0 && (
                  <span className="inline-flex items-center justify-center ml-2 px-2 py-1 text-xs font-bold leading-none rounded-full bg-blue-600 text-white">
                    {folder.unread}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-200 mt-4">
        <a 
          href="http://localhost:8025" 
          target="_blank" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Open MailHog
        </a>
      </div>
    </div>
  );
}