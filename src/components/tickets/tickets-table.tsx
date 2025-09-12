
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Ticket as TicketIcon, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Ticket } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { initializeFirebase } from "@/lib/firebase-config";
import type { FirebaseServices } from "@/lib/firebase-config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const statusColors: { [key: string]: string } = {
  Open: "bg-green-200 text-green-800",
  "In Progress": "bg-yellow-200 text-yellow-800",
  Closed: "bg-red-200 text-red-800",
};

const slaColors: { [key: string]: string } = {
  Baja: "bg-blue-200 text-blue-800",
  Normal: "bg-gray-200 text-gray-800",
  Alta: "bg-orange-200 text-orange-800",
};

const statusTranslations: { [key: string]: string } = {
  Open: "Abierto",
  "In Progress": "En Progreso",
  Closed: "Cerrado",
};

const categoryTranslations: { [key: string]: string } = {
  Support: "Soporte",
  Hosting: "Hosting",
  Oportuno: "Oportuno",
  Other: "Otro",
};

function TicketsTableContent() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const firebaseServices = initializeFirebase();
    if (firebaseServices) {
      setFirebase(firebaseServices);
    }
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!firebase) return;
      setIsLoading(true);
      try {
        const ticketsCollection = collection(firebase.db, "tickets");
        const q = query(ticketsCollection, orderBy("createdAt", "desc"));
        
        const querySnapshot = await getDocs(q);
        const ticketList: Ticket[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ticketList.push({
            id: doc.id,
            title: data.title,
            client: data.client,
            category: data.category,
            status: data.status,
            sla: data.sla,
            createdAt: data.createdAt.toDate(),
            updates: data.updates,
            imageUrl: data.imageUrl,
          });
        });
        
        setTickets(ticketList);
      } catch (error) {
        console.error("Error fetching tickets: ", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los tickets.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (firebase) {
      fetchTickets();
    }
  }, [firebase]);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && Object.keys(categoryTranslations).includes(category)) {
      setCategoryFilter(category);
    }
  }, [searchParams]);

  const filteredTickets = tickets
    .filter((ticket) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.client.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      );
    })
    .filter((ticket) => statusFilter === "All" || ticket.status === statusFilter)
    .filter((ticket) => categoryFilter === "All" || ticket.category === categoryFilter);
  
  const handleRowClick = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Buscar por ID, título o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todos los Estados</SelectItem>
            <SelectItem value="Open">Abierto</SelectItem>
            <SelectItem value="In Progress">En Progreso</SelectItem>
            <SelectItem value="Closed">Cerrado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Todas las Categorías</SelectItem>
            <SelectItem value="Support">Soporte</SelectItem>
            <SelectItem value="Hosting">Hosting</SelectItem>
            <SelectItem value="Oportuno">Oportuno</SelectItem>
            <SelectItem value="Other">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Creado en</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading || !firebase ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Cargando tickets...</p>
                  </TableCell>
                </TableRow>
              ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} onClick={() => handleRowClick(ticket.id)} className="cursor-pointer">
                  <TableCell className="font-medium">{ticket.id.substring(0, 7)}...</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.client}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{categoryTranslations[ticket.category]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={slaColors[ticket.sla]}>
                      {ticket.sla}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[ticket.status]}>
                      {statusTranslations[ticket.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(ticket.createdAt, "PPP")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Pencil className="mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <TicketIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No se encontraron tickets.</p>
                   <p className="text-sm text-muted-foreground">
                        Empieza por crear tu primer ticket.
                    </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function TicketsTable() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TicketsTableContent />
    </Suspense>
  );
}
