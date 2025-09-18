
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewTicketForm } from "@/components/tickets/new-ticket-form";

export function NewTicketDialog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    // Refresh the page to show the new ticket
    router.refresh();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Nuevo Ticket
        </Button>
      </DialogTrigger>
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
  );
}
