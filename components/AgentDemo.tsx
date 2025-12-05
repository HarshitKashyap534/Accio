import React, { useEffect, useRef, useState } from 'react';
import { LiveClient } from '../services/liveClient';
import { Customer } from '../types';

interface AgentDemoProps {
  systemInstruction: string;
  customers: Customer[];
}

const AgentDemo: React.FC<AgentDemoProps> = ({ systemInstruction, customers }) => {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const liveClientRef = useRef<LiveClient | null>(null);
  
  const API_KEY = process.env.API_KEY || ''; 

  useEffect(() => {
    return () => {
      if (liveClientRef.current) {
        liveClientRef.current.disconnect();
      }
    };
  }, []);

  const toggleCall = async () => {
    if (active) {
      if (liveClientRef.current) {
        await liveClientRef.current.disconnect();
      }
      setActive(false);
      setVolume(0);
    } else {
      if (!API_KEY) {
        setError("API Key not found in environment variables.");
        return;
      }
      
      setError(null);
      liveClientRef.current = new LiveClient(API_KEY);
      
      try {
        // 1. Create a lightweight version of the DB for the context to save tokens/noise
        const customerDB = customers.map(c => ({
            name: c.name,
            phone: c.phone.replace(/\s/g, ''), // Normalize phone
            location: c.location,
            segment: c.segment,
            current_order: c.activeOrder ? {
                id: c.activeOrder.id,
                item: c.activeOrder.productName,
                status: c.activeOrder.status,
                amount: c.activeOrder.amount
            } : "None",
            cart: c.cart.itemCount > 0 ? {
                items: c.cart.items,
                total: c.cart.totalValue
            } : "Empty"
        }));

        // 2. Append the full database to the system instruction
        const finalInstruction = `
${systemInstruction}

*** SYSTEM ACCESS: LIVE CUSTOMER DATABASE ***
You have secure access to the following customer list. 
When a user speaks, ASK for their Name or Phone Number to verify their identity.
Once verified, look up their data in this list and act accordingly.

${JSON.stringify(customerDB, null, 2)}

*** IMPORTANT ***
- If the user is NOT in this list, politely say you cannot find their account.
- DO NOT hallucinate orders. Only use the "current_order" field from the matching user above.
- If "current_order" is "None", tell them they have no active orders.
`;

        await liveClientRef.current.connect(
          finalInstruction,
          () => {
            setActive(true);
            console.log("Connected to Gemini Live");
          },
          () => {
            setActive(false);
            console.log("Disconnected");
          },
          (err) => {
            console.error(err);
            setError("Connection failed. Check console or API key.");
            setActive(false);
          },
          (vol) => {
            setVolume(vol);
          }
        );
      } catch (e) {
        console.error(e);
        setError("Failed to initialize audio or connection.");
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-soft border border-gray-100 relative overflow-hidden">
        {/* Modern decorative background - Subtle Mesh */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
             style={{
               backgroundImage: `radial-gradient(circle at 50% 50%, #f1f5f9 2px, transparent 2.5px)`,
               backgroundSize: '32px 32px'
             }}>
        </div>
        
        {/* Header */}
        <div className="relative z-10 p-8 flex justify-between items-center border-b border-gray-50">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">General Support Line</h2>
                <p className="text-slate-500 font-medium">Inbound Call Simulator • Agent: <span className="text-black font-bold">Gaurav Rajput</span></p>
            </div>
            <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${active ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-gray-100 text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                    <span>{active ? 'LIVE' : 'OFFLINE'}</span>
                </div>
            </div>
        </div>

        {/* Main Visualizer Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
            {error && (
                <div className="absolute top-8 bg-red-50 text-red-600 px-6 py-3 rounded-2xl border border-red-100 font-medium shadow-sm mb-8">
                    {error}
                </div>
            )}

            {/* Avatar / Visualizer - The Black Orb */}
            <div className="relative mb-12 group">
                {/* Outer ripples */}
                <div className={`absolute inset-0 rounded-full border border-black/5 transition-all duration-1000 ease-out ${active ? 'scale-[2.5] opacity-100' : 'scale-100 opacity-0'}`} />
                <div className={`absolute inset-0 rounded-full border border-black/10 transition-all duration-700 ease-out ${active ? 'scale-[1.8] opacity-100' : 'scale-100 opacity-0'}`} />
                
                {/* Main Orb */}
                <div className={`w-40 h-40 rounded-full bg-black shadow-2xl flex items-center justify-center relative z-10 transition-all duration-500 ${active ? 'scale-110 shadow-black/30' : 'shadow-black/10'}`}>
                   {active ? (
                     /* Sleek Waveform */
                     <div className="flex items-center justify-center space-x-1.5 h-16 w-16">
                       {[...Array(4)].map((_, i) => (
                         <div 
                            key={i} 
                            className="w-1.5 bg-white rounded-full transition-all duration-100 ease-in-out"
                            style={{ 
                                height: `${Math.max(12, volume * 60 * (Math.random() + 0.8))}px`,
                                opacity: 0.9 
                            }} 
                         />
                       ))}
                     </div>
                   ) : (
                     <div className="text-white text-center">
                         <span className="block text-2xl font-bold">GR</span>
                         <span className="text-[10px] opacity-70 uppercase tracking-widest">Support</span>
                     </div>
                   )}
                </div>
            </div>

            <h3 className={`text-2xl font-bold mb-2 transition-colors ${active ? 'text-slate-900' : 'text-slate-300'}`}>
                {active ? "Gaurav Rajput is listening..." : "Start Inbound Call"}
            </h3>
            <p className="text-slate-500 mb-8 max-w-md text-center font-medium">
                {active 
                    ? "Say: 'Hello, I'm Priya Verma' or 'My phone number is +91...'" 
                    : "The agent will look up the caller in the database. Use names from the 'User Database' tab."}
            </p>

            {/* Controls */}
            <button
                onClick={toggleCall}
                className={`px-10 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                    active 
                    ? 'bg-white text-red-600 border-2 border-red-100 hover:bg-red-50 shadow-red-100' 
                    : 'bg-black text-white hover:bg-slate-800 shadow-black/20'
                }`}
            >
                {active ? 'Disconnect Line' : 'Connect Agent'}
            </button>
        </div>
    </div>
  );
};

export default AgentDemo;