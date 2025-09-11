
"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
// Paso 1: Importar las funciones necesarias de Firestore y la configuración de la base de datos.
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, orderBy, query } from "firebase/firestore";

export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // EJEMPLO DE LECTURA DE DATOS: Esta función lee todos los documentos de la colección "clients".
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      // Paso 2: Obtener una referencia a la colección "clients" en Firestore.
      const clientsCollection = collection(db, "clients");
      // Opcional: Crear una consulta para ordenar los clientes por fecha de creación.
      const q = query(clientsCollection, orderBy("createdAt", "desc"));
      
      // Paso 3: Ejecutar la consulta para obtener una "instantánea" (snapshot) de la colección.
      const querySnapshot = await getDocs(q);
      
      // Paso 4: Recorrer cada documento en la instantánea y formatear los datos.
      const clients: Client[] = [];
      querySnapshot.forEach((doc) => {
        // doc.id es el ID único del documento.
        // doc.data() contiene todos los campos del documento.
        clients.push({ id: doc.id, ...doc.data() } as Client);
      });
      
      // Paso 5: Actualizar el estado del componente con los datos leídos.
      setClientList(clients);
    } catch (error) {
      console.error("Error fetching clients: ", error);
      toast({
        title: "Error al Cargar Clientes",
        description: "No se pudieron cargar los datos desde Firestore. Revisa las reglas de seguridad.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);


  const handleRowClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  // EJEMPLO DE ELIMINACIÓN DE DATOS: Esta función elimina un documento específico.
  const handleDeleteClient = async () => {
    if (selectedClient) {
      try {
        // Paso 2: Crear una referencia al documento específico usando su ID.
        const clientDocRef = doc(db, "clients", selectedClient.id);
        
        // Paso 3: Llamar a deleteDoc para eliminar el documento de Firestore.
        await deleteDoc(clientDocRef);
        
        toast({
          title: "Cliente eliminado",
          description: `El cliente ${selectedClient.name} ha sido eliminado.`,
        });
        fetchClients(); // Volver a cargar la lista para reflejar el cambio.
      } catch (error) {
         toast({
          title: "Error al Eliminar",
          description: "No se pudo eliminar el cliente. Revisa los permisos de Firestore.",
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
    setIsEditModalOpen(true);
  };

  // EJEMPLO DE ACTUALIZACIÓN DE DATOS: Esta función actualiza un documento existente.
  const handleUpdateClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedClient) {
      const formData = new FormData(event.currentTarget);
      const updatedData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        address: formData.get('address') as string,
      };
      
      try {
        // Paso 2: Crear una referencia al documento que se va a actualizar.
        const clientRef = doc(db, "clients", selectedClient.id);
        
        // Paso 3: Llamar a updateDoc con la referencia y los nuevos datos.
        await updateDoc(clientRef, updatedData);
        
        toast({
          title: "Cliente actualizado",
          description: `Los datos de ${updatedData.name} han sido actualizados.`
        });
        fetchClients(); // Volver a cargar la lista para reflejar el cambio.
      } catch (error) {
        toast({
          title: "Error al Actualizar",
          description: "No se pudo actualizar el cliente. Revisa los permisos de Firestore.",
          variant: "destructive",
        });
      } finally {
        setIsEditModalOpen(false);
        setSelectedClient(null);
      }
    }
  };

  // EJEMPLO DE ESCRITURA DE DATOS: Esta función crea un nuevo documento.
  const handleAddClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Paso 2: Preparar el objeto con los datos que se guardarán.
    const newClient = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      address: formData.get('address') as string,
      createdAt: Timestamp.now(), // Usar Timestamp de Firestore para la fecha.
    };
    
    try {
      // Paso 3: Llamar a addDoc, pasándole la referencia a la colección y los nuevos datos.
      // Firestore generará automáticamente un ID único para el nuevo documento.
      await addDoc(collection(db, "clients"), newClient);
      
      toast({
        title: "Cliente añadido",
        description: `El cliente ${newClient.name} ha sido añadido.`,
      });
      fetchClients(); // Volver a cargar la lista para incluir el nuevo cliente.
    } catch (error) {
       toast({
        title: "Error al Añadir",
        description: "No se pudo añadir el cliente. Revisa los permisos de Firestore.",
        variant: "destructive",
      });
    } finally {
      setIsAddModalOpen(false);
    }
  };


  return (
    <>
      <PageHeader
        title="Clientes"
        description="Administra los perfiles e información de tus clientes."
      >
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle />
          Añadir Cliente
        </Button>
      </PageHeader>
      <div className="p-6 pt-0">
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
                    <p className="mt-2 text-muted-foreground">Cargando clientes...</p>
                  </TableCell>
                </TableRow>
              ) : clientList.length > 0 ? (
                clientList.map((client) => (
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
                      {client.createdAt && format((client.createdAt as Timestamp).toDate(), "PPP")}
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

      {/* Delete Confirmation Dialog */}
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

      {/* Edit Client Modal */}
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
                <Input id="name" name="name" defaultValue={selectedClient.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={selectedClient.email} />
              </div>
              <div>
                <Label htmlFor="company">Compañía</Label>
                <Input id="company" name="company" defaultValue={selectedClient.company} />
              </div>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" name="address" defaultValue={selectedClient.address} />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Client Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Completa la información del nuevo cliente.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient} className="space-y-4 py-4">
            <div>
              <Label htmlFor="add-name">Nombre</Label>
              <Input id="add-name" name="name" placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input id="add-email" name="email" type="email" placeholder="john.doe@example.com" required />
            </div>
            <div>
              <Label htmlFor="add-company">Compañía</Label>
              <Input id="add-company" name="company" placeholder="Acme Inc." required />
            </div>
            <div>
              <Label htmlFor="add-address">Dirección</Label>
              <Input id="add-address" name="address" placeholder="123 Main St, Anytown, USA" required />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Añadir Cliente</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
