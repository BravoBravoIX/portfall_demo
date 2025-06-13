import React from 'react';
import { Menu } from 'lucide-react';

const TabNav = ({ tabs, activeTab, onTabChange, onToggleSidebar }) => (
  <nav className="bg-[#172c41] border-b border-[#243c56] flex items-stretch px-6">
    <button onClick={onToggleSidebar} className="text-slate-400 hover:text-white mr-4">
      <Menu className="h-5 w-5" />
    </button>
    <div className="flex overflow-x-auto hide-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab.name}
          onClick={() => onTabChange(tab.name)}
          className={`flex items-center px-5 py-3 text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === tab.name
              ? 'border-[#3b82f6] text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          } rounded-t-md`}
        >
          <tab.icon className={`h-5 w-5 mr-2 ${activeTab === tab.name ? 'text-white' : 'text-slate-400'}`} />
          {tab.name}
        </button>
      ))}
    </div>
  </nav>
);

export default TabNav;