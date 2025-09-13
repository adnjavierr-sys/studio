
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Contact, KeyRound, Eye, EyeOff, Loader2, Users, Shield, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Agent } from "@/lib/data";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { initializeFirebase } from "@/lib/firebase-config";
import type { FirebaseServices } from "@/lib/firebase-config";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export default function AgentsPage() {
  const [agentList, setAgentList] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    const firebaseServices = initializeFirebase();
    if (firebaseServices) {
      setFirebase(firebaseServices);
    }
  }, []);

  const fetchAgents = async () => {
    if (!firebase) return;
    setIsLoading(true);
    try {
      const agentsCollection = collection(firebase.db, "agents");
      const q = query(agentsCollection, orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      const agents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: data.createdAt.toDate(),
          password: data.password,
        } as Agent;
      });
      
      setAgentList(agents);
    } catch (error) {
      console.error("Error fetching agents: ", error);
      toast({ title: "Error", description: "No se pudieron cargar los agentes.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firebase) {
      fetchAgents();
    }
  }, [firebase, toast]);
  
  const filteredAgents = useMemo(() => {
    return agentList
      .filter(agent => roleFilter === "All" || agent.role === roleFilter)
      .filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        agent.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [agentList, roleFilter, searchTerm]);

  const agentStats = useMemo(() => {
    const total = agentList.length;
    const admins = agentList.filter(a => a.role === 'Admin').length;
    const level1 = agentList.filter(a => a.role === 'Support Level 1').length;
    const level2 = agentList.filter(a => a.role === 'Support Level 2').length;
    return { total, admins, level1, level2 };
  }, [agentList]);


  const handleRowClick = (agentId: string) => {
    router.push(`/agents/${agentId}`);
  };

  const openEditModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDeleteConfirmationOpen(true);
  }

  const handleDeleteAgent = async () => {
    if (selectedAgent && firebase) {
      try {
        await deleteDoc(doc(firebase.db, "agents", selectedAgent.id));
        toast({
          title: "Agente Eliminado",
          description: `El agente ${selectedAgent.name} ha sido eliminado.`,
        });
        fetchAgents();
      } catch (error) {
        toast({ title: "Error al Eliminar", description: "No se pudo eliminar el agente.", variant: "destructive" });
      } finally {
        setIsDeleteConfirmationOpen(false);
        setSelectedAgent(null);
      }
    }
  };

  const handleAddAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firebase) return;
    const formData = new FormData(event.currentTarget);
    const newAgent = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'Admin' | 'Support Level 1' | 'Support Level 2',
      password: formData.get('password') as string,
      createdAt: Timestamp.now(),
    };
    
    // Simple validation
    if (!newAgent.name || !newAgent.email || !newAgent.role || !newAgent.password) {
        toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
        return;
    }

    try {
      await addDoc(collection(firebase.db, "agents"), newAgent);
      toast({
        title: "Agente añadido",
        description: `El agente ${newAgent.name} ha sido añadido.`,
      });
      fetchAgents();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding agent:", error);
      toast({ title: "Error al Añadir", description: "No se pudo añadir el agente.", variant: "destructive" });
    }
  };
  
  const handleUpdateAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedAgent && firebase) {
      const formData = new FormData(event.currentTarget);
      const updatedData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as 'Admin' | 'Support Level 1' | 'Support Level 2',
      };
      
      try {
        const agentRef = doc(firebase.db, "agents", selectedAgent.id);
        await updateDoc(agentRef, updatedData);
        toast({
          title: "Agente actualizado",
          description: `Los datos de ${updatedData.name} han sido actualizados.`
        });
        fetchAgents();
      } catch (error) {
        toast({ title: "Error al Actualizar", description: "No se pudo actualizar el agente.", variant: "destructive" });
      } finally {
        setIsEditModalOpen(false);
        setSelectedAgent(null);
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType; }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
        </CardContent>
    </Card>
);

  return (
    <>
      <PageHeader
        title="Agentes"
        description="Administra los agentes de soporte."
      >
        <Button onClick={() => { setIsAddModalOpen(true); setShowPassword(false); }}>
          <PlusCircle />
          Añadir Agente
        </Button>
      </PageHeader>
      <div className="p-6 pt-0 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total de Agentes" value={agentStats.total} icon={Users} />
            <StatCard title="Administradores" value={agentStats.admins} icon={Shield} />
            <StatCard title="Soporte Nivel 1" value={agentStats.level1} icon={UserCheck} />
            <StatCard title="Soporte Nivel 2" value={agentStats.level2} icon={Contact} />
        </div>
        
        <Card>
            <CardHeader>
                 <CardTitle>Lista de Agentes</CardTitle>
                 <CardDescription>Busca, filtra y gestiona los agentes de tu equipo.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filtrar por rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">Todos los Roles</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Support Level 1">Soporte Nivel 1</SelectItem>
                            <SelectItem value="Support Level 2">Soporte Nivel 2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Agente</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Miembro Desde</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {isLoading || !firebase ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                                <p className="mt-2 text-muted-foreground">Cargando agentes...</p>
                            </TableCell>
                        </TableRow>
                    ) : filteredAgents.length > 0 ? (
                        filteredAgents.map((agent) => (
                        <TableRow key={agent.id} >
                            <TableCell className="font-medium cursor-pointer" onClick={() => handleRowClick(agent.id)}>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                <AvatarImage src={`https://picsum.photos/seed/${agent.id}/100`} />
                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                <p>{agent.name}</p>
                                <p className="text-sm text-muted-foreground">{agent.email}</p>
                                </div>
                            </div>
                            </TableCell>
                            <TableCell className="cursor-pointer" onClick={() => handleRowClick(agent.id)}>{agent.role}</TableCell>
                            <TableCell className="cursor-pointer" onClick={() => handleRowClick(agent.id)}>
                            {agent.createdAt && format(agent.createdAt, "PPP")}
                            </TableCell>
                            <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                <DropdownMenuItem onClick={(e) => {e.stopPropagation(); openEditModal(agent)}}>
                                    <Pencil className="mr-2" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={(e) => {e.stopPropagation(); openDeleteModal(agent)}}>
                                    <Trash2 className="mr-2" /> Eliminar
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            <Contact className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">No se encontraron agentes que coincidan con tu búsqueda.</p>
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
        </Card>
      </div>
      
      {/* Add Agent Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Agente</DialogTitle>
            <DialogDescription>
              Completa la información del nuevo agente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAgent} className="space-y-4 py-4">
            <div>
              <Label htmlFor="add-name">Nombre</Label>
              <Input id="add-name" name="name" placeholder="Jane Doe" required />
            </div>
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input id="add-email" name="email" type="email" placeholder="jane.doe@example.com" required />
            </div>
            <div>
              <Label htmlFor="add-password">Contraseña</Label>
              <div className="relative">
                <Input id="add-password" name="password" type={showPassword ? "text" : "password"} required className="pr-10" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="add-role">Rol</Label>
              <Select name="role" required defaultValue="Support Level 1">
                <SelectTrigger id="add-role">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Support Level 1">Soporte Nivel 1</SelectItem>
                  <SelectItem value="Support Level 2">Soporte Nivel 2</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Añadir Agente</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Agent Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Agente</DialogTitle>
            <DialogDescription>
              Actualiza la información del agente.
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <form onSubmit={handleUpdateAgent} className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input id="edit-name" name="name" defaultValue={selectedAgent.name} required />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={selectedAgent.email} required />
              </div>
              <div>
                <Label htmlFor="edit-role">Rol</Label>
                 <Select name="role" required defaultValue={selectedAgent.role}>
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
              <span className="font-semibold"> {selectedAgent?.name}</span> y todos sus datos asociados.
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
