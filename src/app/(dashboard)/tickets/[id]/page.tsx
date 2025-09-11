
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Ticket } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag, Info, MessageSquare, History, ShieldAlert, ImageIcon, Loader2 } from 'lucide-react';
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
// Paso 1: Importar las funciones necesarias y la instancia de la base de datos.
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp, arrayUnion } from "firebase/firestore";

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
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // EJEMPLO DE LECTURA DE UN DOCUMENTO ESPECÍFICO
  const fetchTicket = useCallback(async () => {
    if (typeof id !== 'string') return;
    try {
      // Paso 2: Crear una referencia al documento del ticket usando su ID.
      const docRef = doc(db, "tickets", id);
      // Paso 3: Usar `getDoc` para obtener el documento.
      const docSnap = await getDoc(docRef);
      // Paso 4: Validar si el documento existe y actualizar el estado.
      if (docSnap.exists()) {
        setTicket({ id: docSnap.id, ...docSnap.data() } as Ticket);
      } else {
        toast({ title: "Error", description: "El ticket no fue encontrado.", variant: "destructive" });
        setTicket(null);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast({ title: "Error", description: "No se pudo cargar el ticket desde Firestore.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (id) {
        setIsLoading(true);
        fetchTicket();
    }
  }, [id, fetchTicket]);

  // EJEMPLO DE ACTUALIZACIÓN DE UN DOCUMENTO (CAMBIAR ESTADO)
  const handleStatusChange = async (newStatus: 'Open' | 'In Progress' | 'Closed') => {
    if (ticket) {
      const oldStatus = ticket.status;
      const updateText = `Estado cambiado de ${statusTranslations[oldStatus]} a ${statusTranslations[newStatus]}.`;
      const ticketUpdate = {
        timestamp: Timestamp.now(),
        author: 'Admin User', // En una app real, aquí iría el usuario autenticado.
        update: updateText,
      };

      try {
        // Paso 2: Crear una referencia al documento que se va a actualizar.
        const ticketRef = doc(db, "tickets", ticket.id);
        // Paso 3: Usar `updateDoc` para modificar campos existentes.
        // `arrayUnion` es útil para añadir elementos a un array sin duplicados.
        await updateDoc(ticketRef, {
          status: newStatus,
          updates: arrayUnion(ticketUpdate) // Agrega la nueva actualización al historial.
        });
        toast({
          title: "Estado Actualizado",
          description: `El ticket ha sido actualizado a "${statusTranslations[newStatus]}".`
        });
        fetchTicket(); // Volver a cargar los datos para reflejar el cambio en la UI.
      } catch (error) {
        console.error("Error updating status:", error);
        toast({ title: "Error al Actualizar", description: "No se pudo actualizar el estado.", variant: "destructive" });
      }
    }
  };
  
  // EJEMPLO DE ACTUALIZACIÓN DE UN DOCUMENTO (AÑADIR COMENTARIO)
  const handleAddComment = async () => {
    if (ticket && newComment.trim()) {
      // Paso 2: Preparar el objeto de actualización que se añadirá al array "updates".
      const ticketUpdate = {
        timestamp: Timestamp.now(),
        author: 'Admin User', // Reemplazar con el usuario actual.
        update: newComment.trim(),
      };

      try {
        // Paso 3: Crear la referencia al documento.
        const ticketRef = doc(db, "tickets", ticket.id);
        // Paso 4: Usar `updateDoc` y `arrayUnion` para añadir el nuevo comentario al historial.
        await updateDoc(ticketRef, {
          updates: arrayUnion(ticketUpdate)
        });
        setNewComment("");
        toast({
          title: "Comentario Añadido",
          description: "Tu comentario ha sido añadido al historial del ticket."
        });
        fetchTicket(); // Volver a cargar los datos.
      } catch (error) {
         console.error("Error adding comment:", error);
         toast({ title: "Error al Comentar", description: "No se pudo añadir el comentario.", variant: "destructive" });
      }
    }
  };

  if (isLoading) {
    return (
       <div className="p-6 flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
       </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <PageHeader title="Ticket no encontrado" description="El ticket que buscas no existe o ha sido eliminado."/>
        <Button onClick={() => router.push('/tickets')}>
          <ArrowLeft className="mr-2" />
          Volver a Tickets
        </Button>
      </div>
    );
  }

  const createdAtDate = ticket.createdAt instanceof Timestamp ? ticket.createdAt.toDate() : new Date();

  return (
    <>
      <PageHeader title={`Ticket #${ticket.id.substring(0, 7)}...`} description={ticket.title}>
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
                    <p className="text-muted-foreground">{format(createdAtDate, 'PPP')}</p>
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
                 <p className="text-muted-foreground bg-slate-50 dark:bg-slate-800 p-4 rounded-md border">{ticket.title}</p>
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
                              {update.timestamp && format((update.timestamp as Timestamp).toDate(), "d MMM, yyyy 'a las' h:mm a", { locale: es })}
                            </p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800 p-3 rounded-md border">{update.update}</p>
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
