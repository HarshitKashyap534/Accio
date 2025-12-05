import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: View.CUSTOMERS, label: 'User Database', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: View.KNOWLEDGE, label: 'Knowledge Base', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: View.AGENT_DEMO, label: 'Support Agent', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
  ];

  return (
    <div className="w-72 bg-white flex flex-col h-screen flex-shrink-0 border-r border-gray-100/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
      {/* Brand */}
      <div className="p-8 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-lg shadow-black/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <div>
          <span className="text-xl font-bold text-slate-900 tracking-tight block">Accio</span>
          <span className="text-xs font-medium text-slate-400 tracking-widest uppercase">Commerce AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`group w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 ease-out ${
              currentView === item.id 
                ? 'bg-black text-white shadow-xl shadow-black/10 scale-[1.02]' 
                : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
            }`}
          >
            <svg className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="font-semibold tracking-wide text-sm">{item.label}</span>
            {currentView === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-6 mt-auto">
        <div className="bg-gray-50 rounded-3xl p-4 flex items-center space-x-3 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center shadow-sm relative overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Siddharth V.</p>
            <p className="text-xs text-slate-500 truncate">Support Lead</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;