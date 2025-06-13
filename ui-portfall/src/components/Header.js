import React from 'react';
import { LogOut, Settings, Bell, Search } from 'lucide-react';

const Header = ({ timeElapsed, notifications, onSearch, onSettings, onLogout }) => (
  <header className="px-6 py-4 flex justify-between items-center bg-[#0e1b2a] border-b border-[#1f2f40]">
    <div className="flex items-center text-white text-xl font-semibold">
      <div className="bg-[#3b82f6] w-9 h-9 rounded-lg flex items-center justify-center mr-3 shadow-md">
        <span className="text-white text-lg font-bold">P</span>
      </div>
      PORTFALL
    </div>
    <div className="flex items-center space-x-5">
      <div className="text-slate-400 text-sm">Time Elapsed: {timeElapsed}</div>
      <button onClick={onSearch} className="text-slate-400 hover:text-white">
        <Search className="h-5 w-5" />
      </button>
      <div className="relative">
        <button className="text-slate-400 hover:text-white">
          <Bell className="h-5 w-5" />
        </button>
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-1.5 h-1.5"></span>
        )}
      </div>
      <button onClick={onSettings} className="text-slate-400 hover:text-white">
        <Settings className="h-5 w-5" />
      </button>
      <button onClick={onLogout} className="text-slate-400 hover:text-red-400">
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  </header>
);

export default Header;