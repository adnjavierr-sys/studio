
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Agent } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Shield, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { db } from "@/lib/firebase-config";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const agentSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("El email no es válido."),
  role: z.enum(["Admin", "Support Level 1", "Support Level 2"]),
});

type AgentFormValues = z.infer<typeof agentSchema>;

export default function AgentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
  });
  const { isSubmitting } = form.formState;

  const fetchAgent = useCallback(async () => {
    if (typeof id !== 'string') return;
    setIsLoading(true);
    try {
      const docRef = doc(db, "agents", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const agentData: Agent = {
          id: docSnap.id,
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: data.createdAt.toDate(),
        };
        setAgent(agentData);
        form.reset({ name: agentData.name, email: agentData.email, role: agentData.role });
      } else {
        toast({ title: "Error", description: "Agente no encontrado.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching agent:", error);
      toast({ title: "Error", description: "No se pudo cargar el agente.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast, form]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);
  

  const handleDeleteAgent = async () => {
    if (agent) {
      try {
        await deleteDoc(doc(db, "agents", agent.id));
        toast({
          title: "Agente Eliminado",
          description: `El agente ${agent.name} ha sido eliminado.`,
        });
        setIsDeleteConfirmationOpen(false);
        router.push('/agents');
      } catch (error) {
        toast({ title: "Error al Eliminar", description: "No se pudo eliminar el agente.", variant: "destructive" });
      }
    }
  };

  const handleUpdateAgent = async (data: AgentFormValues) => {
    if (agent) {
      try {
        const agentRef = doc(db, "agents", agent.id);
        await updateDoc(agentRef, data);
        
        toast({
          title: "Agente actualizado",
          description: `Los datos de ${data.name} han sido actualizados.`
        });
        await fetchAgent(); // Re-fetch the agent data to show the latest changes
      } catch (error) {
         toast({ title: "Error al Actualizar", description: "No se pudo actualizar el agente.", variant: "destructive" });
      } finally {
        setIsEditModalOpen(false);
      }
    }
  };

  if (isLoading) {
    return (
       <div className="flex h-[80vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
       </div>
    );
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateAgent)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Support Level 1">Soporte Nivel 1</SelectItem>
                            <SelectItem value="Support Level 2">Soporte Nivel 2</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </Form>
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
