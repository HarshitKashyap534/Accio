import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerDatabaseProps {
  customers: Customer[];
}

const CustomerDatabase: React.FC<CustomerDatabaseProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col pr-2">
      <div className="flex justify-between items-end mb-8 pt-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">User Database</h1>
          <p className="text-slate-500 font-medium">Reference list for the Voice Agent. Search to find test users.</p>
        </div>
        <div className="relative">
             <input 
                type="text" 
                placeholder="Search name or email..." 
                className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-white text-slate-900 font-bold border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-8 py-6">User Identity</th>
                <th className="px-8 py-6">Phone (ID)</th>
                <th className="px-8 py-6">Active Order</th>
                <th className="px-8 py-6">Cart</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 group-hover:bg-black group-hover:text-white transition-colors">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-base">{customer.name}</div>
                            <div className="text-xs text-slate-400">{customer.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-mono text-slate-500 font-medium">{customer.phone}</td>
                  <td className="px-8 py-5">
                    {customer.activeOrder ? (
                        <div>
                             <div className="text-slate-900 font-bold">{customer.activeOrder.productName}</div>
                             <div className={`text-xs font-bold uppercase tracking-wider mt-1 inline-block px-2 py-0.5 rounded ${
                                 customer.activeOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                 customer.activeOrder.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                 'bg-yellow-100 text-yellow-700'
                             }`}>
                                 {customer.activeOrder.status}
                             </div>
                        </div>
                    ) : (
                        <span className="text-slate-400 text-xs italic">None</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {customer.cart.itemCount > 0 ? (
                        <div className="flex items-center space-x-2">
                             <div className="bg-black text-white px-2 py-1 rounded-md font-bold text-xs">{customer.cart.itemCount} Items</div>
                             <span className="text-slate-500 font-mono text-xs">${customer.cart.totalValue}</span>
                        </div>
                    ) : (
                        <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      customer.segment === 'VIP' ? 'bg-black text-white border-black' :
                      customer.segment === 'New' ? 'bg-green-100 text-green-800 border-transparent' :
                      customer.segment === 'Risk' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-white text-slate-600 border-slate-200'
                    }`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors bg-gray-50 hover:bg-gray-200 px-4 py-2 rounded-xl">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDatabase;