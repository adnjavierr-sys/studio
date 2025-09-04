
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Contact, KeyRound, Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { agents as initialAgents, Agent } from "@/lib/data";
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

export default function AgentsPage() {
  const [agentList, setAgentList] = useState<Agent[]>(initialAgents);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

  const handleDeleteAgent = () => {
    if (selectedAgent) {
      const indexToDelete = initialAgents.findIndex(a => a.id === selectedAgent.id);
      if (indexToDelete > -1) {
        initialAgents.splice(indexToDelete, 1);
      }
      setAgentList([...initialAgents]);
      toast({
        title: "Agente Eliminado",
        description: `El agente ${selectedAgent.name} ha sido eliminado.`,
      });
      setIsDeleteConfirmationOpen(false);
      setSelectedAgent(null);
    }
  };

  const handleAddAgent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAgent: Agent = {
      id: `AGT-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'Admin' | 'Support Level 1' | 'Support Level 2',
      password: formData.get('password') as string,
      createdAt: new Date(),
    };
    initialAgents.unshift(newAgent);
    setAgentList([...initialAgents]);
    toast({
      title: "Agente añadido",
      description: `El agente ${newAgent.name} ha sido añadido.`,
    });
    setIsAddModalOpen(false);
  };

  const handleUpdateAgent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedAgent) {
      const formData = new FormData(event.currentTarget);
      const updatedAgent = {
        ...selectedAgent,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as 'Admin' | 'Support Level 1' | 'Support Level 2',
      };
      const newAgentList = agentList.map(a => a.id === updatedAgent.id ? updatedAgent : a);
      setAgentList(newAgentList);
      initialAgents.splice(initialAgents.findIndex(a => a.id === updatedAgent.id), 1, updatedAgent);
      toast({
        title: "Agente actualizado",
        description: `Los datos de ${updatedAgent.name} han sido actualizados.`
      });
      setIsEditModalOpen(false);
      setSelectedAgent(null);
    }
  };
  
  const handleSetTemporaryPassword = () => {
    if (selectedAgent) {
      const tempPassword = Math.random().toString(36).slice(-8);
      const agentIndex = initialAgents.findIndex(a => a.id === selectedAgent.id);
      if (agentIndex !== -1) {
        initialAgents[agentIndex].password = tempPassword;
        // Also update the agent in the local state if needed, though it's not displayed
        const updatedAgent = { ...selectedAgent, password: tempPassword };
        setSelectedAgent(updatedAgent);
        const newAgentList = agentList.map(a => a.id === updatedAgent.id ? updatedAgent : a);
        setAgentList(newAgentList);

        alert(`La nueva contraseña temporal para ${selectedAgent.name} es: ${tempPassword}`);

        toast({
          title: "Contraseña Temporal Generada",
          description: `Se ha establecido una nueva contraseña para ${selectedAgent.name}.`,
        });
      }
    }
  };


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
      <div className="p-6 pt-0">
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
              {agentList.length > 0 ? (
                agentList.map((agent) => (
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
                    <TableCell className="cursor-pointer" onClick={() => handleRowClick(agent.id)}>{format(agent.createdAt, "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openEditModal(agent)}>
                            <Pencil className="mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => openDeleteModal(agent)}>
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
                    <p className="mt-2 text-muted-foreground">No se encontraron agentes.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
                <Button type="button" variant="outline" onClick={handleSetTemporaryPassword}>
                  <KeyRound />
                  Generar Contraseña Temporal
                </Button>
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

    
