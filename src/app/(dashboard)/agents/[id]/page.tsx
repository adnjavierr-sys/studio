
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { agents, Agent } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Shield, Pencil, Trash2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AgentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [agent, setAgent] = useState<Agent | undefined>(
    agents.find((a) => a.id === id)
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const handleDeleteAgent = () => {
    if (agent) {
      const indexToDelete = agents.findIndex(a => a.id === agent.id);
      if (indexToDelete > -1) {
        agents.splice(indexToDelete, 1);
      }
      toast({
        title: "Agente Eliminado",
        description: `El agente ${agent.name} ha sido eliminado.`,
      });
      setIsDeleteConfirmationOpen(false);
      router.push('/agents');
    }
  };

  const handleUpdateAgent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (agent) {
      const formData = new FormData(event.currentTarget);
      const updatedAgentData = {
        ...agent,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as 'Admin' | 'Support Level 1' | 'Support Level 2',
      };
      
      const agentIndex = agents.findIndex(a => a.id === agent.id);
      if (agentIndex !== -1) {
        agents[agentIndex] = updatedAgentData;
      }

      setAgent(updatedAgentData);
      
      toast({
        title: "Agente actualizado",
        description: `Los datos de ${updatedAgentData.name} han sido actualizados.`
      });
      setIsEditModalOpen(false);
    }
  };

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
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                <Pencil /> Editar
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteConfirmationOpen(true)}>
                <Trash2 /> Eliminar
            </Button>
            <Button onClick={() => router.push('/agents')} variant="secondary">
                <ArrowLeft className="mr-2" />
                Volver a Agentes
            </Button>
        </div>
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
      
      {/* Edit Agent Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Agente</DialogTitle>
            <DialogDescription>
              Actualiza la información del agente.
            </DialogDescription>
          </DialogHeader>
          {agent && (
            <form onSubmit={handleUpdateAgent} className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input id="edit-name" name="name" defaultValue={agent.name} required />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={agent.email} required />
              </div>
              <div>
                <Label htmlFor="edit-role">Rol</Label>
                 <Select name="role" required defaultValue={agent.role}>
                    <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Support Level 1">Soporte Nivel 1</SelectItem>
                    <SelectItem value="Support Level 2">Soporte Nivel 2</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
              </div>
               <div className="flex justify-end pt-4 gap-2">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Agent Confirmation */}
      <AlertDialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al agente 
              <span className="font-semibold"> {agent?.name}</span> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAgent}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
