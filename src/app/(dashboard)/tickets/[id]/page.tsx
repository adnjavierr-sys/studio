"use client";

import { useParams, useRouter } from 'next/navigation';
import { tickets } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const statusColors: { [key: string]: string } = {
  Open: "bg-green-200 text-green-800",
  "In Progress": "bg-yellow-200 text-yellow-800",
  Closed: "bg-red-200 text-red-800",
};

const statusTranslations: { [key: string]: string } = {
  Open: "Abierto",
  "In Progress": "En Progreso",
  Closed: "Cerrado",
};

const categoryTranslations: { [key: string]: string } = {
  Support: "Soporte",
  Hosting: "Hosting",
  Urgent: "Urgente",
  Other: "Otro",
};

export default function TicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const ticket = tickets.find((t) => t.id === id);

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
      <div className="p-6 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Ticket</CardTitle>
            <CardDescription>Información completa sobre el ticket seleccionado.</CardDescription>
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
                  <p className="text-muted-foreground">{format(ticket.createdAt, 'PPP p')}</p>
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
            </div>
            <div className="pt-4">
               <h3 className="text-lg font-semibold mb-2">Descripción</h3>
               <p className="text-muted-foreground bg-slate-50 p-4 rounded-md border">{ticket.title}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
