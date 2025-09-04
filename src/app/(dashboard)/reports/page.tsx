
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Download, Trash2, PlusCircle, Bell, Send } from "lucide-react";
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
import { tickets, ticketsByCategory, clients, reportAutomations as initialAutomations, ReportAutomation } from "@/lib/data";
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
import Papa from "papaparse";

export default function ReportsPage() {
  const [automations, setAutomations] = useState<ReportAutomation[]>(initialAutomations || []);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [manualRecipientEmail, setManualRecipientEmail] = useState("");
  const [selectedManualClient, setSelectedManualClient] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  
  const handleClientChange = (clientName: string) => {
    const client = clients.find(c => c.name === clientName);
    if (client) {
      setRecipientEmail(client.email);
    } else {
      setRecipientEmail("");
    }
  };
  
  const handleManualClientChange = (clientName: string) => {
    setSelectedManualClient(clientName);
    const client = clients.find(c => c.name === clientName);
    if (client) {
      setManualRecipientEmail(client.email);
    } else {
      setManualRecipientEmail("");
    }
  };

  const handleAddAutomation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
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
    form.reset();
    setRecipientEmail("");
  };

  const handleDeleteAutomation = (id: string) => {
    const indexToDelete = initialAutomations.findIndex(a => a.id === id);
    if (indexToDelete > -1) {
      initialAutomations.splice(indexToDelete, 1);
    }
    setAutomations([...initialAutomations]);

    toast({
      title: "Automatización Eliminada",
      description: "La configuración del reporte ha sido eliminada.",
    });
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/tickets?category=${encodeURIComponent(category)}`);
  };

  const handleExport = () => {
    const dataToExport = tickets.map(ticket => ({
      ID: ticket.id,
      Titulo: ticket.title,
      Cliente: ticket.client,
      Categoria: ticket.category,
      Estado: ticket.status,
      "Fecha de Creacion": ticket.createdAt.toISOString(),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_tickets.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Reporte Exportado",
      description: "El reporte de tickets se ha descargado como CSV.",
    });
  };
  
  const handleManualSend = () => {
    if (!selectedManualClient || !manualRecipientEmail) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un cliente y asegúrate de que el email es válido.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reporte Enviado",
      description: `El reporte para ${selectedManualClient} ha sido enviado a ${manualRecipientEmail}.`,
    });
  };

  return (
    <>
      <PageHeader
        title="Reportes"
        description="Genera y exporta reportes de datos de tickets."
      >
        <Button onClick={handleExport}>
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
                <CardTitle>Envío Manual de Reporte</CardTitle>
                <CardDescription>
                Envía un reporte de inmediato a un cliente específico.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="manual-client">Cliente</Label>
                        <Select onValueChange={handleManualClientChange}>
                            <SelectTrigger id="manual-client">
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
                        <Label htmlFor="manual-email">Email del Destinatario</Label>
                        <Input
                            type="email"
                            id="manual-email"
                            placeholder="cliente@ejemplo.com"
                            value={manualRecipientEmail}
                            onChange={(e) => setManualRecipientEmail(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleManualSend} className="w-full md:w-auto">
                        <Send className="mr-2" />
                        Enviar Reporte
                    </Button>
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
                <Select name="client" required onValuechange={handleClientChange}>
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
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="cliente@ejemplo.com" 
                  required 
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
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
                  {automations && automations.length > 0 ? (
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
                    <TableRow key={item.category} onClick={() => handleCategoryClick(item.category)} className="cursor-pointer">
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

    