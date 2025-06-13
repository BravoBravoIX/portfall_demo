import React from 'react';

const Sidebar = ({ navItems, collapsed, activeIndex, onItemSelect }) => (
  <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#172c41] border-r border-[#243c56] flex flex-col transition-all duration-300`}>
    <div className="p-4">
      <div className={`text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 ${collapsed ? 'text-center' : ''}`}>
        {collapsed ? 'Nav' : 'Navigation'}
      </div>
      <ul className="space-y-2">
        {navItems.map((item, idx) => (
          <li key={idx}>
            <button
              onClick={() => onItemSelect(idx)}
              className={`w-full flex ${collapsed ? 'justify-center' : 'items-center'} rounded-lg px-2 py-3 transition-all ${
                idx === activeIndex
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-slate-400 hover:bg-[#3b82f6] hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${idx === activeIndex ? 'text-white' : 'text-slate-400'} ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default Sidebar;