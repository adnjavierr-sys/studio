
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tickets, Ticket } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag, Info, MessageSquare, History, ShieldAlert, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { es } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const statusColors: { [key: string]: string } = {
  Open: "bg-green-200 text-green-800",
  "In Progress": "bg-yellow-200 text-yellow-800",
  Closed: "bg-red-200 text-red-800",
};

const slaColors: { [key: string]: string } = {
  Baja: "bg-blue-200 text-blue-800",
  Normal: "bg-gray-200 text-gray-800",
  Alta: "bg-orange-200 text-orange-800",
};

const statusTranslations: { [key: string]: string } = {
  Open: "Abierto",
  "In Progress": "En Progreso",
  Closed: "Cerrado",
};

const categoryTranslations: { [key: string]: string } = {
  Support: "Soporte",
  Hosting: "Hosting",
  Oportuno: "Oportuno",
  Other: "Otro",
};

export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  
  const [ticket, setTicket] = useState<Ticket | undefined>(
    tickets.find((t) => t.id === id)
  );
  const [newComment, setNewComment] = useState("");

  const handleStatusChange = (newStatus: 'Open' | 'In Progress' | 'Closed') => {
    if (ticket) {
      const oldStatus = ticket.status;
      const updatedTicket = { 
        ...ticket, 
        status: newStatus,
        updates: [
          ...(ticket.updates || []),
          {
            timestamp: new Date(),
            author: 'Admin User', // Replace with actual user later
            update: `Estado cambiado de ${statusTranslations[oldStatus]} a ${statusTranslations[newStatus]}.`
          }
        ]
      };
      setTicket(updatedTicket);
      // Here you would also update the central data source
      const ticketIndex = tickets.findIndex(t => t.id === ticket.id);
      if (ticketIndex !== -1) {
        tickets[ticketIndex] = updatedTicket;
      }
      toast({
        title: "Estado Actualizado",
        description: `El ticket ha sido actualizado a "${statusTranslations[newStatus]}".`
      });
    }
  };
  
  const handleAddComment = () => {
    if (ticket && newComment.trim()) {
       const updatedTicket = { 
        ...ticket, 
        updates: [
          ...(ticket.updates || []),
          {
            timestamp: new Date(),
            author: 'Admin User', // Replace with actual user later
            update: newComment
          }
        ]
      };
      setTicket(updatedTicket);
      // Here you would also update the central data source
      const ticketIndex = tickets.findIndex(t => t.id === ticket.id);
      if (ticketIndex !== -1) {
        tickets[ticketIndex] = updatedTicket;
      }
      setNewComment("");
      toast({
        title: "Comentario Añadido",
        description: "Tu comentario ha sido añadido al historial del ticket."
      });
    }
  };

  if (!ticket) {
    return (
      <div className="p-6">
        <PageHeader title="Ticket no encontrado" description="El ticket que buscas no existe."/>
        <Button onClick={() => router.push('/tickets')}>
          <ArrowLeft className="mr-2" />
          Volver a Tickets
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={`Ticket #${ticket.id}`} description={ticket.title}>
        <Button onClick={() => router.push('/tickets')}>
          <ArrowLeft className="mr-2" />
          Volver a Tickets
        </Button>
      </PageHeader>
      <div className="p-6 pt-0 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Cliente</p>
                    <p className="text-muted-foreground">{ticket.client}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha de Creación</p>
                    <p className="text-muted-foreground">{format(ticket.createdAt, 'PPP')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Tag className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Categoría</p>
                    <Badge variant="secondary">{categoryTranslations[ticket.category]}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Info className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Estado</p>
                    <Badge className={statusColors[ticket.status]}>
                      {statusTranslations[ticket.status]}
                    </Badge>
                  </div>
                </div>
                 <div className="flex items-center space-x-3">
                  <ShieldAlert className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Prioridad (SLA)</p>
                    <Badge className={slaColors[ticket.sla]}>
                      {ticket.sla}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                 <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                 <p className="text-muted-foreground bg-slate-50 p-4 rounded-md border">{ticket.title}</p>
              </div>
               {ticket.imageUrl && (
                <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><ImageIcon className="mr-2" /> Imagen Adjunta</h3>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border cursor-pointer">
                                <Image
                                    src={ticket.imageUrl}
                                    alt="Imagen adjunta del ticket"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-2">
                            <Image 
                                src={ticket.imageUrl} 
                                alt="Imagen adjunta del ticket" 
                                width={1200} 
                                height={800} 
                                className="rounded-md"
                            />
                        </DialogContent>
                    </Dialog>
                </div>
               )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2" />
                Historial y Seguimiento
              </CardTitle>
              <CardDescription>Comentarios y cambios de estado del ticket.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(ticket.updates || []).slice().reverse().map((update, index) => (
                   <div key={index} className="flex gap-4">
                     <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                           {update.author.charAt(0)}
                        </div>
                        {index !== (ticket.updates || []).length - 1 && (
                          <div className="w-px flex-grow bg-border"></div>
                        )}
                     </div>
                     <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{update.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(update.timestamp, "d MMM, yyyy 'a las' h:mm a", { locale: es })}
                            </p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground bg-slate-50 p-3 rounded-md border">{update.update}</p>
                     </div>
                   </div>
                ))}
                {(!ticket.updates || ticket.updates.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">No hay actualizaciones para este ticket.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Cambiar Estado</Label>
                <Select value={ticket.status} onValueChange={(value) => handleStatusChange(value as any)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Abierto</SelectItem>
                    <SelectItem value="In Progress">En Progreso</SelectItem>
                    <SelectItem value="Closed">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Añadir Comentario</Label>
                <Textarea 
                  id="comment" 
                  placeholder="Añade una nota o actualización..." 
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              <Button onClick={handleAddComment} className="w-full">
                <MessageSquare className="mr-2" />
                Añadir Comentario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
