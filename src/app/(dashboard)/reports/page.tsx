
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { Ticket, Client } from "@/lib/data";
import { ReportsClient } from "@/components/reports/reports-client";

async function getTickets() {
    const ticketsCollection = collection(db, "tickets");
    const ticketsQuery = query(ticketsCollection, orderBy("createdAt", "desc"));
    const ticketsSnapshot = await getDocs(ticketsQuery);
    const ticketList: Ticket[] = ticketsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        client: data.client,
        category: data.category,
        status: data.status,
        sla: data.sla,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updates: data.updates,
        imageUrl: data.imageUrl,
      } as Ticket;
    });
    return ticketList;
}

async function getClients() {
    const clientsCollection = collection(db, "clients");
    const clientsQuery = query(clientsCollection, orderBy("name", "asc"));
    const clientsSnapshot = await getDocs(clientsQuery);
    const clientList: Client[] = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
    return clientList;
}

export default async function ReportsPage() {
  const tickets = await getTickets();
  const clients = await getClients();

  return <ReportsClient initialTickets={tickets} initialClients={clients} />;
}
