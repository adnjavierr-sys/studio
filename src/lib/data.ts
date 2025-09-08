
import { Timestamp } from "firebase/firestore";

export type TicketUpdate = {
  timestamp: Date | Timestamp;
  author: string; 
  update: string; 
};

export type Ticket = {
  id: string;
  title: string;
  client: string;
  category: 'Support' | 'Hosting' | 'Oportuno' | 'Other';
  status: 'Open' | 'In Progress' | 'Closed';
  sla: 'Normal' | 'Alta' | 'Baja';
  createdAt: Date | Timestamp;
  updates?: TicketUpdate[];
  imageUrl?: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  address: string;
  createdAt: Date | Timestamp;
};

export type Policy = {
  id: string;
  title: string;
  description: string;
  type: 'Mensual' | 'Anual' | 'Ilimitada';
  clientName: string;
  createdAt: Date;
};

export type Agent = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Support Level 1' | 'Support Level 2';
  password?: string;
  createdAt: Date;
};

export type ReportAutomation = {
  id: string;
  clientName: string;
  frequency: 'Diaria' | 'Semanal' | 'Mensual';
  recipientEmail: string;
};

// Mock tickets are now deprecated in favor of Firestore
export const tickets: Ticket[] = [];

// Mock clients are now deprecated in favor of Firestore
export const clients: Client[] = [];

let policiesData: Policy[] = [
    { id: 'POL-001', title: 'Service Level Agreement (SLA)', type: 'Anual', clientName: 'Acme Inc.', description: 'Defines the level of service you expect from a vendor, laying out the metrics by which service is measured.', createdAt: new Date('2022-01-01T09:00:00Z') },
    { id: 'POL-002', title: 'Acceptable Use Policy (AUP)', type: 'Anual', clientName: 'Stark Industries', description: 'A set of rules applied by the owner, creator or administrator of a network, website, or service.', createdAt: new Date('2022-01-02T10:00:00Z') },
    { id: 'POL-003', title: 'Privacy Policy', type: 'Ilimitada', clientName: 'Wayne Enterprises', description: 'A statement or legal document that discloses some or all of the ways a party gathers, uses, discloses, and manages a customer or client\'s data.', createdAt: new Date('2022-01-03T11:00:00Z') },
    { id: 'POL-004', title: 'Data Retention Policy', type: 'Ilimitada', clientName: 'Acme Inc.', description: 'A company’s established protocol for retaining information for operational or regulatory compliance needs.', createdAt: new Date('2022-01-04T12:00:00Z') },
];

export const policies: Policy[] = new Proxy(policiesData, {
    get(target, prop) {
        if (prop === 'unshift') {
            return (newPolicy: Policy) => {
                target.unshift(newPolicy);
                return target.length;
            }
        }
        if (prop === 'splice') {
            return (start: number, deleteCount?: number, ...items: Policy[]) => {
                const result = target.splice(start, deleteCount, ...items);
                return result;
            }
        }
        return target[prop as any];
    },
    set(target, prop, value) {
        (target as any)[prop] = value;
        return true;
    }
});


let agentsData: Agent[] = [
    { id: 'AGT-001', name: 'Admin User', email: 'admin@unoti.com', role: 'Admin', createdAt: new Date('2022-01-01T09:00:00Z'), password: 'unotiadmin' },
    { id: 'AGT-002', name: 'Jane Smith', email: 'jane.smith@unoti.com', role: 'Support Level 2', createdAt: new Date('2022-02-10T10:00:00Z'), password: 'password123' },
    { id: 'AGT-003', name: 'Peter Jones', email: 'peter.jones@unoti.com', role: 'Support Level 1', createdAt: new Date('2022-03-15T11:00:00Z'), password: 'password123' },
];

export const agents: Agent[] = new Proxy(agentsData, {
    get(target, prop) {
        if (prop === 'unshift') {
            return (newAgent: Agent) => {
                target.unshift(newAgent);
                return target.length;
            }
        }
        return target[prop as any];
    },
    set(target, prop, value) {
        (target as any)[prop] = value;
        return true;
    }
});

let automationsData: ReportAutomation[] = [
    { id: 'AUT-001', clientName: 'Acme Inc.', frequency: 'Semanal', recipientEmail: 'manager@acme.com' },
    { id: 'AUT-002', clientName: 'Stark Industries', frequency: 'Mensual', recipientEmail: 'pepper.potts@stark.com' },
];

export const reportAutomations: ReportAutomation[] = new Proxy(automationsData, {
    get(target, prop) {
        if (prop === 'unshift') {
            return (newAutomation: ReportAutomation) => {
                target.unshift(newAutomation);
                return target.length;
            }
        }
        if (prop === 'splice') {
            return (start: number, deleteCount?: number) => {
                const result = target.splice(start, deleteCount);
                return result;
            }
        }
        return target[prop as any];
    },
    set(target, prop, value) {
        (target as any)[prop] = value;
        return true;
    },
    deleteProperty(target, prop) {
        return delete (target as any)[prop];
    }
});

// These stats will now be dynamic or fetched from Firestore in their respective components.
export const dashboardStats = {
  totalTickets: 0,
  openTickets: 0,
  inProgressTickets: 0,
  closedTickets: 0,
};

export const ticketsByCategory = [
  { category: 'Support', count: 0 },
  { category: 'Hosting', count: 0 },
  { category: 'Oportuno', count: 0 },
  { category: 'Other', count: 0 },
];
