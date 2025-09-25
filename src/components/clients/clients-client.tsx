
"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Users, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/lib/data";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase-config";
import { collection, getDocs, doc, updateDoc, deleteDoc, Timestamp, orderBy, query } from "firebase/firestore";
import { NewClientForm } from "./new-client-form";

export function ClientsClient({ initialClients }: { initialClients: Client[] }) {
  const [clientList, setClientList] = useState<Client[]>(initialClients);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  
  const [editFormData, setEditFormData] = useState({ name: '', email: '', company: '', address: '' });

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsCollection = collection(db, "clients");
      const q = query(clientsCollection, orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      
      const clients: Client[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
        clients.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          company: data.company,
          address: data.address,
          createdAt: createdAt,
        });
      });
      
      setClientList(clients);
    } catch (error) {
      console.error("Error fetching clients: ", error);
      toast({
        title: "Error al Cargar Clientes",
        description: "No se pudieron cargar los datos desde Firestore.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const filteredClients = useMemo(() => {
    return clientList.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clientList, searchTerm]);


  const handleRowClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      try {
        await deleteDoc(doc(db, "clients", selectedClient.id));
        toast({
          title: "Cliente eliminado",
          description: `El cliente ${selectedClient.name} ha sido eliminado.`,
        });
        await fetchClients();
      } catch (error) {
         toast({
          title: "Error al Eliminar",
          description: "No se pudo eliminar el cliente.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedClient(null);
      }
    }
  };
  
  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setEditFormData({ name: client.name, email: client.email, company: client.company, address: client.address });
    setIsEditModalOpen(true);
  };

  const handleUpdateClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedClient) {
      try {
        const clientRef = doc(db, "clients", selectedClient.id);
        await updateDoc(clientRef, editFormData);
        toast({
          title: "Cliente actualizado",
          description: `Los datos de ${editFormData.name} han sido actualizados.`
        });
        await fetchClients();
        setIsEditModalOpen(false);
        setSelectedClient(null);
      } catch (error) {
        toast({
          title: "Error al Actualizar",
          description: "No se pudo actualizar el cliente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSubmitted = async () => {
    setIsAddModalOpen(false);
    await fetchClients();
  };

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Administra los perfiles e información de tus clientes."
      >
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    Añadir Cliente
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
                    <DialogDescription>
                    Completa la información del nuevo cliente.
                    </DialogDescription>
                </DialogHeader>
                <NewClientForm onFormSubmit={handleFormSubmitted} />
            </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="p-6 pt-0">
        <div className="mb-4">
          <Input
            placeholder="Buscar por nombre, email o compañía..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Compañía</TableHead>
                <TableHead>Miembro Desde</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Cargando...</p>
                  </TableCell>
                </TableRow>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} onClick={() => handleRowClick(client.id)} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://picsum.photos/seed/${client.id}/100`} />
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.company}</TableCell>
                    <TableCell>
                      {client.createdAt && format(client.createdAt, "PPP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditModal(client); }}>
                            <Pencil className="mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(client); }}
                          >
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
                    <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No se encontraron clientes.</p>
                     <p className="text-sm text-muted-foreground">
                        Empieza por añadir tu primer cliente.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente
              <span className="font-semibold"> {selectedClient?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Actualiza la información del cliente.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <form onSubmit={handleUpdateClient} className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="company">Compañía</Label>
                <Input id="company" name="company" value={editFormData.company} onChange={(e) => setEditFormData({...editFormData, company: e.target.value})} />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" name="address" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                 <Button type="button" variant="outline" onClick={() => {setIsEditModalOpen(false); setSelectedClient(null)}}>Cancelar</Button>
                 <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
