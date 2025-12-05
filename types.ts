export interface Order {
  id: string;
  productName: string;
  amount: number;
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Returned';
  date: string;
  trackingId?: string;
}

export interface Cart {
  itemCount: number;
  totalValue: number;
  items: string[]; // Simple list of names for demo
  abandoned: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  segment: 'VIP' | 'New' | 'Returning' | 'Risk';
  joinDate: Date;
  activeOrder?: Order;
  cart: Cart;
  sentiment: 'Positive' | 'Neutral' | 'Negative'; // inferred from last support call
}

export interface KnowledgeDoc {
  id: string;
  name: string;
  type: 'policy' | 'product' | 'shipping';
  content: string;
  uploadDate: Date;
}

export enum View {
  DASHBOARD = 'dashboard',
  CUSTOMERS = 'customers',
  KNOWLEDGE = 'knowledge',
  AGENT_DEMO = 'agent_demo'
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  INTERESTED = 'Interested',
  CLOSED = 'Closed'
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  language: string;
  status: LeadStatus;
  notes?: string;
}

// Audio Types
export interface AudioVisualizerState {
  volume: number;
}