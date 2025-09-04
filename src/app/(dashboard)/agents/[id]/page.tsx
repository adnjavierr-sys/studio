
"use client";

import { useParams, useRouter } from 'next/navigation';
import { agents } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AgentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="p-6">
        <PageHeader title="Agente no encontrado" description="El agente que buscas no existe."/>
        <Button onClick={() => router.push('/agents')}>
          <ArrowLeft className="mr-2" />
          Volver a Agentes
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Detalles del Agente">
        <Button onClick={() => router.push('/agents')}>
          <ArrowLeft className="mr-2" />
          Volver a Agentes
        </Button>
      </PageHeader>
      <div className="p-6 pt-0">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://picsum.photos/seed/${agent.id}/100`} />
                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{agent.name}</CardTitle>
                <CardDescription>{agent.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-4 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div className="flex items-start space-x-3">
                    <Mail className="text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-muted-foreground">{agent.email}</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <Shield className="text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">Rol</p>
                        <p className="text-muted-foreground">{agent.role}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <Calendar className="text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">Miembro Desde</p>
                        <p className="text-muted-foreground">{format(agent.createdAt, 'PPP')}</p>
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
