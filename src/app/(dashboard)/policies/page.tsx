
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Policy, Client } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, PlusCircle, Shield, Loader2 } from "lucide-react";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initializeFirebase } from "@/lib/firebase-config";
import type { FirebaseServices } from "@/lib/firebase-config";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";

const typeColors: { [key: string]: string } = {
  Mensual: "bg-blue-200 text-blue-800",
  Anual: "bg-green-200 text-green-800",
  Ilimitada: "bg-purple-200 text-purple-800",
};

export default function PoliciesPage() {
  const [policyList, setPolicyList] = useState<Policy[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const { toast } = useToast();
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const firebaseServices = initializeFirebase();
    if (firebaseServices) {
      setFirebase(firebaseServices);
    }
  }, []);

  const fetchData = async () => {
    if (!firebase) return;
    setIsLoading(true);
    try {
      const policiesCollection = collection(firebase.db, "policies");
      const policiesQuery = query(policiesCollection, orderBy("createdAt", "desc"));
      const policiesSnapshot = await getDocs(policiesQuery);
      const policies = policiesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          type: data.type,
          clientName: data.clientName,
          createdAt: data.createdAt.toDate(),
        } as Policy;
      });
      setPolicyList(policies);

      const clientsCollection = collection(firebase.db, "clients");
      const clientsQuery = query(clientsCollection, orderBy("name", "asc"));
      const clientsSnapshot = await getDocs(clientsQuery);
      const clientList: Client[] = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
      setClients(clientList);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Error", description: "No se pudieron cargar los datos.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firebase) {
      fetchData();
    }
  }, [firebase, toast]);


  const handleAddPolicy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firebase) return;
    const formData = new FormData(event.currentTarget);
    const newPolicy = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as 'Mensual' | 'Anual' | 'Ilimitada',
      clientName: formData.get('clientName') as string,
      createdAt: Timestamp.now(),
    };
    
    try {
      await addDoc(collection(firebase.db, "policies"), newPolicy);
      toast({
        title: "Póliza añadida",
        description: `La póliza "${newPolicy.title}" ha sido añadida.`,
      });
      fetchData();
    } catch (error) {
       toast({ title: "Error al Añadir", description: "No se pudo añadir la póliza.", variant: "destructive" });
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const openEditModal = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsEditModalOpen(true);
  };

  const handleUpdatePolicy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedPolicy && firebase) {
      const formData = new FormData(event.currentTarget);
      const updatedData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        type: formData.get('type') as 'Mensual' | 'Anual' | 'Ilimitada',
        clientName: formData.get('clientName') as string,
      };
      
      try {
        const policyRef = doc(firebase.db, "policies", selectedPolicy.id);
        await updateDoc(policyRef, updatedData);
        toast({
          title: "Póliza actualizada",
          description: `La póliza "${updatedData.title}" ha sido actualizada.`
        });
        fetchData();
      } catch (error) {
        toast({ title: "Error al Actualizar", description: "No se pudo actualizar la póliza.", variant: "destructive" });
      } finally {
        setIsEditModalOpen(false);
        setSelectedPolicy(null);
      }
    }
  };
  
  const openDeleteDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePolicy = async () => {
    if (selectedPolicy && firebase) {
      try {
        await deleteDoc(doc(firebase.db, "policies", selectedPolicy.id));
        toast({
          title: "Póliza eliminada",
          description: `La póliza "${selectedPolicy.title}" ha sido eliminada.`,
        });
        fetchData();
      } catch (error) {
         toast({ title: "Error al Eliminar", description: "No se pudo eliminar la póliza.", variant: "destructive" });
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedPolicy(null);
      }
    }
  };

  return (
    <>
      <PageHeader
        title="Pólizas"
        description="Administra las pólizas de servicio y datos de tu empresa."
      >
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle />
          Añadir Póliza
        </Button>
      </PageHeader>
      <div className="p-6 pt-0">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || !firebase ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Cargando pólizas...</p>
                  </TableCell>
                </TableRow>
              ) : policyList.length > 0 ? (
                policyList.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.title}</TableCell>
                    <TableCell>{policy.clientName}</TableCell>
                    <TableCell>
                      <Badge className={typeColors[policy.type]}>{policy.type}</Badge>
                    </TableCell>
                    <TableCell>{policy.createdAt && format(policy.createdAt, "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openEditModal(policy)}>
                            <Pencil className="mr-2" /> Modificar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(policy)}>
                            <Trash2 className="mr-2" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Shield className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No se encontraron pólizas.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Add Policy Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nueva Póliza</DialogTitle>
            <DialogDescription>
              Completa la información de la nueva póliza.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPolicy} className="space-y-4 py-4">
            <div>
              <Label htmlFor="add-title">Título</Label>
              <Input id="add-title" name="title" placeholder="Service Level Agreement (SLA)" required />
            </div>
            <div>
              <Label htmlFor="add-clientName">Cliente</Label>
              <Select name="clientName" required>
                <SelectTrigger id="add-clientName">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-type">Tipo de Póliza</Label>
              <Select name="type" required defaultValue="Anual">
                <SelectTrigger id="add-type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensual">Mensual</SelectItem>
                  <SelectItem value="Anual">Anual</SelectItem>
                  <SelectItem value="Ilimitada">Ilimitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-description">Descripción</Label>
              <Textarea id="add-description" name="description" placeholder="Describe la póliza..." required rows={5} />
            </div>
            <div className="flex justify-end pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Añadir Póliza</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Policy Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Póliza</DialogTitle>
            <DialogDescription>
              Actualiza la información de la póliza.
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <form onSubmit={handleUpdatePolicy} className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Título</Label>
                <Input id="edit-title" name="title" defaultValue={selectedPolicy.title} required />
              </div>
              <div>
                <Label htmlFor="edit-clientName">Cliente</Label>
                <Select name="clientName" required defaultValue={selectedPolicy.clientName}>
                  <SelectTrigger id="edit-clientName">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-type">Tipo de Póliza</Label>
                <Select name="type" required defaultValue={selectedPolicy.type}>
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                    <SelectItem value="Anual">Anual</SelectItem>
                    <SelectItem value="Ilimitada">Ilimitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea id="edit-description" name="description" defaultValue={selectedPolicy.description} required rows={5} />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la póliza
              <span className="font-semibold"> {selectedPolicy?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePolicy}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
