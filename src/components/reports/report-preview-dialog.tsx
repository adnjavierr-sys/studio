
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "@/lib/data";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import Image from 'next/image';

interface ReportPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: Ticket[];
  onConfirmExport: (data: Ticket[]) => void;
}

export function ReportPreviewDialog({
  isOpen,
  onOpenChange,
  data,
  onConfirmExport,
}: ReportPreviewDialogProps) {
  const previewData = data.slice(0, 10); // Show first 10 rows for preview

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
                 <Image 
                    src="https://i.imgur.com/3z22Z3A.png" 
                    alt="UnoTI Logo"
                    width={150}
                    height={50}
                    className="object-contain"
                 />
                 <div>
                    <DialogTitle className="text-2xl">UTI CONSULTORES PROFESIONALES SA DE CV</DialogTitle>
                    <DialogDescription>
                        Vista Previa del Reporte de Tickets
                    </DialogDescription>
                 </div>
            </div>
            <p className="text-sm text-muted-foreground">
                A continuación se muestra una vista previa de las primeras {previewData.length} filas del reporte.
                Confirma para exportar el reporte completo de {data.length} tickets.
            </p>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Última Actualización</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{ticket.title}</TableCell>
                    <TableCell>{ticket.client}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{ticket.sla}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{format(ticket.createdAt, "PPP")}</TableCell>
                    <TableCell>
                      {ticket.updates && ticket.updates.length > 0
                        ? format(ticket.updates[ticket.updates.length - 1].timestamp, "PPP")
                        : format(ticket.createdAt, "PPP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirmExport(data)}>
            <Download className="mr-2" />
            Confirmar y Exportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
