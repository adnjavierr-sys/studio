
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { TicketsTable } from "@/components/tickets/tickets-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NewTicketForm } from "@/components/tickets/new-ticket-form";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { Ticket } from "@/lib/data";


export default function TicketsPage() {
  const [initialTickets, setInitialTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const getTickets = async () => {
    setIsLoading(true);
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
        createdAt: (data.createdAt as Timestamp).toDate(),
        updates: data.updates,
        imageUrl: data.imageUrl,
      });
    });
    
    setInitialTickets(ticketList);
    setIsLoading(false);
  }

  useEffect(() => {
    getTickets();
  }, [tableKey]);


  const handleFormSubmit = () => {
    setIsModalOpen(false);
    setTableKey(prevKey => prevKey + 1); // Trigger re-fetch
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
        {isLoading ? (
             <div className="flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
             </div>
        ) : (
            <TicketsTable initialTickets={initialTickets} />
        )}
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
