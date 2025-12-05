import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';

interface LeadsManagerProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
}

const LeadsManager: React.FC<LeadsManagerProps> = ({ leads, onAddLead }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    company: '',
    phone: '',
    email: '',
    language: 'English',
    status: LeadStatus.NEW
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLead.name && newLead.phone) {
      onAddLead({
        id: Math.random().toString(36).substr(2, 9),
        name: newLead.name,
        company: newLead.company || '',
        phone: newLead.phone,
        email: newLead.email || '',
        status: LeadStatus.NEW,
        language: newLead.language || 'English',
        notes: '',
      } as Lead);
      setIsModalOpen(false);
      setNewLead({ name: '', company: '', phone: '', email: '', language: 'English' });
    }
  };

  return (
    <div className="h-full flex flex-col pr-2">
      <div className="flex justify-between items-end mb-8 pt-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Leads Pipeline</h1>
          <p className="text-slate-500 font-medium">Manage and track your AI agent's calling list.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black hover:bg-slate-800 text-white px-6 py-3 rounded-full flex items-center shadow-lg shadow-black/20 transition-all transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span className="font-bold">Add New Lead</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-white text-slate-900 font-bold border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-8 py-6">Name</th>
                <th className="px-8 py-6">Company</th>
                <th className="px-8 py-6">Phone</th>
                <th className="px-8 py-6">Language</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900 text-base">{lead.name}</div>
                    <div className="text-xs text-slate-400">{lead.email}</div>
                  </td>
                  <td className="px-8 py-5 font-medium">{lead.company}</td>
                  <td className="px-8 py-5 font-mono text-slate-500">{lead.phone}</td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-slate-700">
                      {lead.language}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      lead.status === LeadStatus.NEW ? 'bg-white text-slate-900 border-slate-300' :
                      lead.status === LeadStatus.INTERESTED ? 'bg-black text-white border-black' :
                      lead.status === LeadStatus.CONTACTED ? 'bg-slate-100 text-slate-600 border-transparent' :
                      'bg-white text-slate-400 border-slate-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors bg-gray-50 hover:bg-gray-200 px-4 py-2 rounded-xl">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Modernized */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">New Contact</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all font-medium"
                  value={newLead.name}
                  onChange={e => setNewLead({...newLead, name: e.target.value})}
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all font-medium"
                  value={newLead.company}
                  onChange={e => setNewLead({...newLead, company: e.target.value})}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all font-medium"
                    value={newLead.phone}
                    onChange={e => setNewLead({...newLead, phone: e.target.value})}
                    placeholder="+1..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Language</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl outline-none transition-all font-medium appearance-none"
                      value={newLead.language}
                      onChange={e => setNewLead({...newLead, language: e.target.value})}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Hindi</option>
                      <option>German</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-black hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-black/10 transition-transform active:scale-95"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManager;