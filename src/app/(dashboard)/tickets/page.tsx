
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { Ticket, TicketUpdate } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { TicketsTable } from "@/components/tickets/tickets-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NewTicketDialog } from "@/components/tickets/new-ticket-dialog";


async function getTickets() {
    const ticketsCollection = collection(db, "tickets");
    const q = query(ticketsCollection, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    const ticketList: Ticket[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Timestamps to Dates
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
      const updates = (data.updates || []).map((update: any) => ({
        ...update,
        timestamp: update.timestamp instanceof Timestamp ? update.timestamp.toDate() : new Date(),
      }));

      ticketList.push({
        id: doc.id,
        title: data.title,
        client: data.client,
        category: data.category,
        status: data.status,
        sla: data.sla,
        createdAt: createdAt,
        updates: updates,
        imageUrl: data.imageUrl,
      });
    });
    
    return ticketList;
}

export default async function TicketsPage() {
  const initialTickets = await getTickets();

  return (
    <>
      <PageHeader
        title="Tickets"
        description="Administra y da seguimiento a todos los tickets de soporte al cliente."
      >
        <NewTicketDialog />
      </PageHeader>
      <div className="p-6 pt-0">
          <TicketsTable initialTickets={initialTickets} />
      </div>
    </>
  );
}
