import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerDatabase from './components/CustomerDatabase';
import KnowledgeBase from './components/KnowledgeBase';
import AgentDemo from './components/AgentDemo';
import { View, Customer, KnowledgeDoc } from './types';

// Generators for realistic data
const NAMES = [
  "Aarav Patel", "Vihaan Rao", "Aditya Kumar", "Sai Iyer", "Reyansh Gupta", 
  "Arjun Singh", "Vivaan Joshi", "Rohan Mehta", "Ishaan Verma", "Dhruv Shah",
  "Ananya Sharma", "Diya Reddy", "Saanvi Malhotra", "Aadhya Nair", "Kiara Kaur",
  "Myra Chatterjee", "Pari Das", "Riya Jain", "Anvi Saxena", "Prisha Kapoor",
  "Kabir Khanna", "Veer Choudhury", "Aryan Mishra", "Tanishq Bhatia", "Ishita Agarwal",
  "Nikhil Deshmukh", "Kavya Pillai", "Manish Tiwari", "Sneha Roy", "Vikram Rathore"
];

const LOCATIONS = ["Mumbai, MH", "Delhi, DL", "Bangalore, KA", "Hyderabad, TG", "Chennai, TN", "Pune, MH", "Kolkata, WB", "Ahmedabad, GJ"];
const PRODUCTS = ["Sony WH-1000XM5", "Nike Air Jordan", "Apple iPhone 15", "Samsung Galaxy S24", "Dyson Airwrap", "Kindle Paperwhite", "Logitech MX Master 3", "Nespresso Machine", "Adidas Ultraboost", "PlayStation 5"];
const STATUSES = ['Delivered', 'In Transit', 'Processing', 'Returned'] as const;

const generateMockCustomers = (): Customer[] => {
  return NAMES.map((name, index) => {
    const hasOrder = Math.random() > 0.2;
    const hasCart = Math.random() > 0.5;
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    
    return {
      id: `CUST-${1000 + index}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      segment: index % 5 === 0 ? 'VIP' : index % 3 === 0 ? 'Risk' : 'Returning',
      joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      activeOrder: hasOrder ? {
        id: `ORD-${5000 + index}`,
        productName: product,
        amount: Math.floor(Math.random() * 500) + 50,
        status: status,
        date: new Date(2024, 4, Math.floor(Math.random() * 30)).toISOString().split('T')[0]
      } : undefined,
      cart: {
        itemCount: hasCart ? Math.floor(Math.random() * 3) + 1 : 0,
        totalValue: hasCart ? Math.floor(Math.random() * 200) : 0,
        items: hasCart ? ["Accessory Pack", "Warranty Extension"] : [],
        abandoned: hasCart && Math.random() > 0.5
      },
      sentiment: index === 1 ? 'Neutral' : Math.random() > 0.7 ? 'Negative' : 'Positive' // Hardcode index 1 (Priya usually) to check
    };
  });
};

const GAURAV_RAJPUT_INSTRUCTION = `
You are Gaurav Rajput, a senior Customer Support Specialist for Accio, a premium e-commerce platform in India.

**CORE DIRECTIVE:**
You are the primary voice agent for the support hotline. You do not know who is calling initially.
1. **Identify User:** Politely ask for their Name or Phone Number.
2. **Consult Database:** Check the "LIVE CUSTOMER DATABASE" provided in the context to find a match.
3. **Assist:** Once you find the matching user, assume their persona's context (Orders, Cart, Location) and assist them.

**Persona:**
- Name: Gaurav Rajput
- Gender: Male
- Voice: Calm, professional, empathetic, deeper tone.
- Language: Hindi and English (hinglish). Conversation in Indian conversation style. 
- Tone: Extremely polite ("Sir/Ma'am/Ji").

**Capabilities:**
1. **Order Tracking**: You can see their 'current_order'. Tell them the status if asked.
2. **Refunds/Returns**: If status is 'Delivered', you can process a return. If 'Processing', you can cancel.
3. **Cart Assistance**: Remind them about items in their cart if 'cart' is not empty.

**Strict Rules:**
- NEVER invent orders. If the database says "None", say "I don't see any active orders."
- If you can't find the user in the list, ask for their details again or say "I can't find that account."
- Keep responses concise (under 2 sentences usually) unless explaining a policy.
`;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  // Use useMemo so data doesn't regenerate on every render, keeping "Priya" consistent
  const customers = useMemo(() => {
    const generated = generateMockCustomers();
    // Ensure specific test case from user prompt exists and is correct
    const priyaIndex = generated.findIndex(c => c.name.includes("Priya"));
    const priyaData = {
        name: "Priya Verma",
        activeOrder: {
          id: "ORD-9921",
          productName: "Nike Air Jordan",
          amount: 120,
          status: "Processing" as const,
          date: "2024-05-22"
        }
    };

    if (priyaIndex !== -1) {
      generated[priyaIndex] = { ...generated[priyaIndex], ...priyaData };
    } else {
        // Force add if not generated
        generated[0] = { ...generated[0], ...priyaData };
    }
    return generated;
  }, []);
  
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [systemInstruction, setSystemInstruction] = useState<string>(GAURAV_RAJPUT_INSTRUCTION);

  const handleAddDoc = (doc: KnowledgeDoc) => {
    setDocs(prev => [doc, ...prev]);
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard customers={customers} />;
      case View.CUSTOMERS:
        return <CustomerDatabase customers={customers} />;
      case View.KNOWLEDGE:
        return (
          <KnowledgeBase 
            docs={docs} 
            onAddDoc={handleAddDoc} 
            systemInstruction={systemInstruction}
            onUpdateSystemInstruction={setSystemInstruction}
          />
        );
      case View.AGENT_DEMO:
        return <AgentDemo systemInstruction={systemInstruction} customers={customers} />;
      default:
        return <Dashboard customers={customers} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 h-screen overflow-hidden relative p-4 lg:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;