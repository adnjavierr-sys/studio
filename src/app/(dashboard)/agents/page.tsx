"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, UserCog, Contact } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { agents, Agent } from "@/lib/data";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AgentsPage() {
  const [agentList, setAgentList] = useState<Agent[]>(agents);

  return (
    <>
      <PageHeader
        title="Agentes"
        description="Administra los agentes de soporte."
      >
        <Button>
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
                  <TableRow key={agent.id} className="cursor-pointer">
                    <TableCell className="font-medium">
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
                    <TableCell>{agent.role}</TableCell>
                    <TableCell>{format(agent.createdAt, "PPP")}</TableCell>
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
    </>
  );
}
