
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TicketsTable } from "@/components/tickets/tickets-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NewTicketForm } from "@/components/tickets/new-ticket-form";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { Ticket } from "@/lib/data";


async function getTickets() {
  const ticketsCollection = collection(db, "tickets");
  const q = query(ticketsCollection, orderBy("createdAt", "desc"));
  
  const querySnapshot = await getDocs(q);
  const ticketList: Ticket[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    ticketList.push({
      id: doc.id,
      title: data.title,
      client: data.client,
      category: data.category,
      status: data.status,
      sla: data.sla,
      createdAt: data.createdAt.toDate(),
      updates: data.updates,
      imageUrl: data.imageUrl,
    });
  });
  
  return ticketList;
}

export default async function TicketsPage() {
  const initialTickets = await getTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    setTableKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <PageHeader
        title="Tickets"
        description="Administra y da seguimiento a todos los tickets de soporte al cliente."
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle />
          Nuevo Ticket
        </Button>
      </PageHeader>
      <div className="p-6 pt-0">
        <TicketsTable key={tableKey} initialTickets={initialTickets} />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Ticket</DialogTitle>
            <DialogDescription>
              Completa el siguiente formulario para enviar un nuevo ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <NewTicketForm onFormSubmit={handleFormSubmit} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
