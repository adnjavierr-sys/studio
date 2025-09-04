export type Ticket = {
  id: string;
  title: string;
  client: string;
  category: 'Support' | 'Hosting' | 'Urgent' | 'Other';
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: Date;
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
  createdAt: Date;
};

export type Agent = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Support Level 1' | 'Support Level 2';
  createdAt: Date;
};

export const tickets: Ticket[] = [
  { id: 'TKT-001', title: 'Website is down', client: 'Acme Inc.', category: 'Urgent', status: 'Open', createdAt: new Date('2023-10-26T10:00:00Z') },
  { id: 'TKT-002', title: 'Email not working', client: 'Stark Industries', category: 'Support', status: 'In Progress', createdAt: new Date('2023-10-26T11:30:00Z') },
  { id: 'TKT-003', title: 'Need to update DNS records', client: 'Wayne Enterprises', category: 'Hosting', status: 'Open', createdAt: new Date('2023-10-25T14:00:00Z') },
  { id: 'TKT-004', title: 'Login page is slow', client: 'Cyberdyne Systems', category: 'Support', status: 'Closed', createdAt: new Date('2023-10-24T09:15:00Z') },
  { id: 'TKT-005', title: 'General inquiry about services', client: 'Ollivanders Wand Shop', category: 'Other', status: 'Closed', createdAt: new Date('2023-10-23T16:45:00Z') },
  { id: 'TKT-006', title: 'Server migration request', client: 'Acme Inc.', category: 'Hosting', status: 'In Progress', createdAt: new Date('2023-10-27T08:00:00Z') },
  { id: 'TKT-007', title: 'Cannot access cPanel', client: 'Stark Industries', category: 'Hosting', status: 'Open', createdAt: new Date('2023-10-27T09:20:00Z') },
  { id: 'TKT-008', title: 'Emergency server reboot', client: 'Wayne Enterprises', category: 'Urgent', status: 'In Progress', createdAt: new Date('2023-10-27T10:00:00Z') },
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
    return target[prop as any];
  },
  set(target, prop, value) {
    (target as any)[prop] = value;
    return true;
  }
});

export const policies: Policy[] = [
    { id: 'POL-001', title: 'Service Level Agreement (SLA)', description: 'Defines the level of service you expect from a vendor, laying out the metrics by which service is measured.', createdAt: new Date('2022-01-01T09:00:00Z') },
    { id: 'POL-002', title: 'Acceptable Use Policy (AUP)', description: 'A set of rules applied by the owner, creator or administrator of a network, website, or service.', createdAt: new Date('2022-01-02T10:00:00Z') },
    { id: 'POL-003', title: 'Privacy Policy', description: 'A statement or legal document that discloses some or all of the ways a party gathers, uses, discloses, and manages a customer or client\'s data.', createdAt: new Date('2022-01-03T11:00:00Z') },
    { id: 'POL-004', title: 'Data Retention Policy', description: 'A company’s established protocol for retaining information for operational or regulatory compliance needs.', createdAt: new Date('2022-01-04T12:00:00Z') },
];

export const agents: Agent[] = [
    { id: 'AGT-001', name: 'Admin User', email: 'admin@unoti.com', role: 'Admin', createdAt: new Date('2022-01-01T09:00:00Z') },
    { id: 'AGT-002', name: 'Jane Smith', email: 'jane.smith@unoti.com', role: 'Support Level 2', createdAt: new Date('2022-02-10T10:00:00Z') },
    { id: 'AGT-003', name: 'Peter Jones', email: 'peter.jones@unoti.com', role: 'Support Level 1', createdAt: new Date('2022-03-15T11:00:00Z') },
];

export const dashboardStats = {
  totalTickets: tickets.length,
  openTickets: tickets.filter(t => t.status === 'Open').length,
  inProgressTickets: tickets.filter(t => t.status === 'In Progress').length,
  closedTickets: tickets.filter(t => t.status === 'Closed').length,
};

export const ticketsByCategory = [
  { category: 'Support', count: tickets.filter(t => t.category === 'Support').length },
  { category: 'Hosting', count: tickets.filter(t => t.category === 'Hosting').length },
  { category: 'Urgent', count: tickets.filter(t => t.category === 'Urgent').length },
  { category: 'Other', count: tickets.filter(t => t.category === 'Other').length },
];