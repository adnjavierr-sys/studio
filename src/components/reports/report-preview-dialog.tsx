
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Vista Previa del Reporte de Tickets</DialogTitle>
          <DialogDescription>
            A continuación se muestra una vista previa de las primeras {previewData.length} filas del reporte.
            Confirma para exportar el reporte completo de {data.length} tickets.
          </DialogDescription>
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
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.client}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{format(ticket.createdAt, "PPP")}</TableCell>
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
