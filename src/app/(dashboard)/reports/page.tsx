
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Download, Trash2, PlusCircle, Bell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ticketsByCategory, clients, reportAutomations as initialAutomations, ReportAutomation } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const [automations, setAutomations] = useState<ReportAutomation[]>(initialAutomations);
  const { toast } = useToast();

  const handleAddAutomation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAutomation: ReportAutomation = {
      id: `AUT-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      clientName: formData.get("client") as string,
      frequency: formData.get("frequency") as "Diaria" | "Semanal" | "Mensual",
      recipientEmail: formData.get("email") as string,
    };
    initialAutomations.unshift(newAutomation);
    setAutomations([...initialAutomations]);
    toast({
      title: "Automatización Creada",
      description: `Se enviarán reportes para ${newAutomation.clientName} con frecuencia ${newAutomation.frequency.toLowerCase()}.`,
    });
    (event.currentTarget as HTMLFormElement).reset();
  };

  const handleDeleteAutomation = (id: string) => {
    const newAutomations = automations.filter(a => a.id !== id);
    // Update the source of truth
    initialAutomations.splice(0, initialAutomations.length, ...newAutomations);
    setAutomations(newAutomations);
    toast({
      title: "Automatización Eliminada",
      description: "La configuración del reporte ha sido eliminada.",
    });
  };

  return (
    <>
      <PageHeader
        title="Reportes"
        description="Genera y exporta reportes de datos de tickets."
      >
        <Button>
          <Download />
          Exportar Reporte
        </Button>
      </PageHeader>
      <div className="p-6 pt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generación de Reportes</CardTitle>
            <CardDescription>
              Selecciona un tipo de reporte para generar y ver los datos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Select defaultValue="tickets-by-category">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tickets-by-category">
                    Tickets por Categoría
                  </SelectItem>
                  <SelectItem value="tickets-by-client">
                    Tickets por Cliente
                  </SelectItem>
                  <SelectItem value="resolution-time">
                    Tiempo Promedio de Resolución (próximamente)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automatización de Reportes</CardTitle>
            <CardDescription>
              Configura el envío automático de reportes a clientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAutomation} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="client">Cliente</Label>
                <Select name="client" required>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="frequency">Frecuencia</Label>
                <Select name="frequency" required defaultValue="Semanal">
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Selecciona una frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diaria">Diaria</SelectItem>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="email">Email del Destinatario</Label>
                <Input type="email" id="email" name="email" placeholder="cliente@ejemplo.com" required />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <PlusCircle className="mr-2" />
                Guardar
              </Button>
            </form>

            <div className="mt-6 rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Destinatario</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automations.length > 0 ? (
                    automations.map((automation) => (
                      <TableRow key={automation.id}>
                        <TableCell className="font-medium">{automation.clientName}</TableCell>
                        <TableCell>{automation.frequency}</TableCell>
                        <TableCell>{automation.recipientEmail}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAutomation(automation.id)}>
                            <Trash2 className="text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">No hay automatizaciones configuradas.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporte: Tickets por Categoría</CardTitle>
            <CardDescription>
              Un resumen del número total de tickets para cada categoría.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Cantidad de Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsByCategory.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
