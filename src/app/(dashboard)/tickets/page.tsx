
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

export default function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [version, setVersion] = useState(0);
  
  const handleFormSubmit = () => {
    setIsModalOpen(false);
    // Increment version to trigger re-fetch in TicketsTable
    setVersion(v => v + 1);
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
        <TicketsTable key={version} />
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
