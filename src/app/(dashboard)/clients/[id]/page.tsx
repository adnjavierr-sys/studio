"use client";

import { useParams, useRouter } from 'next/navigation';
import { clients } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Building, User } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="p-6">
        <PageHeader title="Cliente no encontrado" description="El cliente que buscas no existe."/>
        <Button onClick={() => router.push('/clients')}>
          <ArrowLeft className="mr-2" />
          Volver a Clientes
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Detalles del Cliente">
        <Button onClick={() => router.push('/clients')}>
          <ArrowLeft className="mr-2" />
          Volver a Clientes
        </Button>
      </PageHeader>
      <div className="p-6 pt-0">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://picsum.photos/seed/${client.id}/100`} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{client.name}</CardTitle>
                <CardDescription>{client.company}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-4 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="flex items-center space-x-3">
                    <Mail className="text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-muted-foreground">{client.email}</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-3">
                    <Building className="text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">Compañía</p>
                        <p className="text-muted-foreground">{client.company}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Calendar className="text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium">Miembro Desde</p>
                        <p className="text-muted-foreground">{format(client.createdAt, 'PPP')}</p>
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
