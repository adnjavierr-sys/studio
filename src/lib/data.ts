
export type TicketUpdate = {
  timestamp: Date;
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
  createdAt: Date;
  updates?: TicketUpdate[];
};

export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  address: string;
  createdAt: Date;
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

export const tickets: Ticket[] = [
  { 
    id: 'TKT-001', 
    title: 'Website is down', 
    client: 'Acme Inc.', 
    category: 'Oportuno', 
    status: 'Open', 
    sla: 'Alta',
    createdAt: new Date('2023-10-26T10:00:00Z'),
    updates: [
      { timestamp: new Date('2023-10-26T10:00:00Z'), author: 'System', update: 'Ticket Creado.' }
    ]
  },
  { 
    id: 'TKT-002', 
    title: 'Email not working', 
    client: 'Stark Industries', 
    category: 'Support', 
    status: 'In Progress', 
    sla: 'Alta',
    createdAt: new Date('2023-10-26T11:30:00Z'),
    updates: [
      { timestamp: new Date('2023-10-26T11:30:00Z'), author: 'System', update: 'Ticket Creado.' },
      { timestamp: new Date('2023-10-26T12:00:00Z'), author: 'Jane Smith', update: 'Status changed to In Progress.' }
    ]
  },
  { id: 'TKT-003', title: 'Need to update DNS records', client: 'Wayne Enterprises', category: 'Hosting', status: 'Open', sla: 'Normal', createdAt: new Date('2023-10-25T14:00:00Z'), updates: [] },
  { 
    id: 'TKT-004', 
    title: 'Login page is slow', 
    client: 'Cyberdyne Systems', 
    category: 'Support', 
    status: 'Closed', 
    sla: 'Baja',
    createdAt: new Date('2023-10-24T09:15:00Z'),
    updates: [
      { timestamp: new Date('2023-10-24T09:15:00Z'), author: 'System', update: 'Ticket Creado.' },
      { timestamp: new Date('2023-10-24T10:00:00Z'), author: 'Peter Jones', update: 'Status changed to In Progress.' },
      { timestamp: new Date('2023-10-24T11:00:00Z'), author: 'Peter Jones', update: 'Status changed to Closed. Issue resolved.' }
    ]
  },
  { id: 'TKT-005', title: 'General inquiry about services', client: 'Ollivanders Wand Shop', category: 'Other', status: 'Closed', sla: 'Baja', createdAt: new Date('2023-10-23T16:45:00Z'), updates: [] },
  { id: 'TKT-006', title: 'Server migration request', client: 'Acme Inc.', category: 'Hosting', status: 'In Progress', sla: 'Normal', createdAt: new Date('2023-10-27T08:00:00Z'), updates: [] },
  { id: 'TKT-007', title: 'Cannot access cPanel', client: 'Stark Industries', category: 'Hosting', status: 'Open', sla: 'Normal', createdAt: new Date('2023-10-27T09:20:00Z'), updates: [] },
  { id: 'TKT-008', title: 'Emergency server reboot', client: 'Wayne Enterprises', category: 'Oportuno', status: 'In Progress', sla: 'Alta', createdAt: new Date('2023-10-27T10:00:00Z'), updates: [] },
];

let clientsData: Client[] = [
    { id: 'CLI-001', name: 'John Doe', email: 'john.doe@acme.com', company: 'Acme Inc.', address: '123 Main St, Anytown, USA', createdAt: new Date('2022-01-15T10:00:00Z') },
    { id: 'CLI-002', name: 'Tony Stark', email: 'tony@stark.com', company: 'Stark Industries', address: '10880 Malibu Point, 90265, CA', createdAt: new Date('2022-02-20T11:30:00Z') },
    { id: 'CLI-003', name: 'Bruce Wayne', email: 'bruce@wayne.com', company: 'Wayne Enterprises', address: '1007 Mountain Drive, Gotham City', createdAt: new Date('2022-03-10T14:00:00Z') },
    { id: 'CLI-004', name: 'Sarah Connor', email: 'sarah.c@cyberdyne.com', company: 'Cyberdyne Systems', address: '18144 El Estero Road, Los Angeles', createdAt: new Date('2022-04-05T09:15:00Z') },
    { id: 'CLI-005', name: 'Garrick Ollivander', email: 'g.ollivander@wands.co.uk', company: 'Ollivanders Wand Shop', address: 'Diagon Alley, London, UK', createdAt: new Date('2022-05-25T16:45:00Z') },
];

export const clients: Client[] = new Proxy(clientsData, {
  get(target, prop) {
    if (prop === 'unshift') {
        return (newClient: Client) => {
            target.unshift(newClient);
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


export const dashboardStats = {
  totalTickets: tickets.length,
  openTickets: tickets.filter(t => t.status === 'Open').length,
  inProgressTickets: tickets.filter(t => t.status === 'In Progress').length,
  closedTickets: tickets.filter(t => t.status === 'Closed').length,
};

export const ticketsByCategory = [
  { category: 'Support', count: tickets.filter(t => t.category === 'Support').length },
  { category: 'Hosting', count: tickets.filter(t => t.category === 'Hosting').length },
  { category: 'Oportuno', count: tickets.filter(t => t.category === 'Oportuno').length },
  { category: 'Other', count: tickets.filter(t => t.category === 'Other').length },
];
