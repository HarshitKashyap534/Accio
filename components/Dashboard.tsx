import React from 'react';
import { Customer } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardProps {
  customers: Customer[];
}

const Dashboard: React.FC<DashboardProps> = ({ customers }) => {
  const totalUsers = customers.length;
  const activeOrders = customers.filter(c => c.activeOrder && c.activeOrder.status !== 'Delivered').length;
  const criticalSentiment = customers.filter(c => c.sentiment === 'Negative').length;
  
  // Mock data for support volume
  const volumeData = [
    { name: '9AM', tickets: 12, resolved: 10 },
    { name: '10AM', tickets: 19, resolved: 15 },
    { name: '11AM', tickets: 25, resolved: 22 },
    { name: '12PM', tickets: 30, resolved: 28 },
    { name: '1PM', tickets: 22, resolved: 20 },
    { name: '2PM', tickets: 18, resolved: 17 },
    { name: '3PM', tickets: 28, resolved: 24 },
  ];

  const orderStatusData = [
    { name: 'In Transit', count: 45 },
    { name: 'Processing', count: 30 },
    { name: 'Delivered', count: 85 },
    { name: 'Returned', count: 12 },
  ];

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      <header className="mb-10 pt-4">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Support Overview</h1>
        <p className="text-slate-500 font-medium">Real-time metrics for Accio Customer Support (Hindi/English).</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Active Tickets', value: '42', change: '+12%', sub: 'vs yesterday' },
          { label: 'Avg Handle Time', value: '3m 12s', change: '-8%', sub: 'efficiency' },
          { label: 'CSAT Score', value: '4.8/5', change: 'High', sub: 'top 5%', highlight: true },
          { label: 'Pending Orders', value: activeOrders, change: 'Urgent', sub: 'needs review' }
        ].map((stat, idx) => (
          <div key={idx} className="group bg-white p-8 rounded-3xl shadow-soft border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-4xl font-bold text-slate-900 mt-4 mb-2 tracking-tight">{stat.value}</p>
            <div className="flex items-center text-sm font-medium">
              <span className={`${stat.highlight ? 'text-slate-900' : 'text-slate-500'} bg-gray-100 px-2 py-1 rounded-lg`}>{stat.change}</span>
              <span className="ml-2 text-slate-400">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Support Volume Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-soft border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Support Ticket Volume</h2>
            <div className="flex items-center space-x-2">
                <span className="flex items-center text-xs font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-black mr-1"></span> Incoming</span>
                <span className="flex items-center text-xs font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span> Resolved</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="tickets" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)" />
                <Area type="monotone" dataKey="resolved" stroke="#cbd5e1" strokeWidth={3} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Order Logistics</h3>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderStatusData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                         <XAxis type="number" hide />
                         <YAxis dataKey="name" type="category" width={80} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                         <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#000', color: '#fff' }} />
                         <Bar dataKey="count" fill="#1e293b" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-500">RETURN RATE</span>
                    <span className="text-xs font-bold text-red-500">2.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '2.4%' }}></div>
                </div>
            </div>
        </div>
      </div>

      {/* Recent Issues Table */}
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Priority User Actions</h2>
          <button className="text-sm font-bold text-black hover:text-slate-600 transition-colors">View All &rarr;</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-gray-50/50 text-slate-900 font-semibold">
              <tr>
                <th className="px-8 py-5 rounded-tl-3xl">User</th>
                <th className="px-8 py-5">Issue/Order</th>
                <th className="px-8 py-5">Sentiment</th>
                <th className="px-8 py-5 rounded-tr-3xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.filter(c => c.sentiment === 'Negative' || c.activeOrder?.status === 'Processing').slice(0, 5).map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">{customer.name.charAt(0)}</div>
                    <span>{customer.name}</span>
                  </td>
                  <td className="px-8 py-5">
                     <div className="font-medium text-slate-900">{customer.activeOrder?.productName || "General Query"}</div>
                     <div className="text-xs text-slate-400">Order #{customer.activeOrder?.id.slice(0,8)}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      customer.sentiment === 'Negative' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {customer.sentiment}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-black underline font-bold hover:text-slate-600 text-xs">Call Now</button>
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

export default Dashboard;