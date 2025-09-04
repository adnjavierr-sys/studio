"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { policies, Policy } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function PoliciesPage() {
  const [policyList, setPolicyList] = useState<Policy[]>(policies);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPolicy = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPolicy: Policy = {
      id: `POL-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      createdAt: new Date(),
    };
    setPolicyList([newPolicy, ...policyList]);
    toast({
      title: "Póliza añadida",
      description: `La póliza "${newPolicy.title}" ha sido añadida.`,
    });
    setIsAddModalOpen(false);
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
      <div className="p-6 pt-0 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {policyList.map((policy) => (
          <Card key={policy.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{policy.title}</CardTitle>
                <CardDescription>
                  Creado: {format(policy.createdAt, "PPP")}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Pencil className="mr-2" /> Modificar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2" /> Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {policy.description}
              </p>
            </CardContent>
          </Card>
        ))}
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
              <Label htmlFor="add-description">Descripción</Label>
              <Textarea id="add-description" name="description" placeholder="Describe la póliza..." required rows={5} />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Añadir Póliza</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
