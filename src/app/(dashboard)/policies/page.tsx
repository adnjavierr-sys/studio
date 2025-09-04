import { PageHeader } from "@/components/page-header";
import { policies } from "@/lib/data";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function PoliciesPage() {
  return (
    <>
      <PageHeader
        title="Pólizas"
        description="Administra las pólizas de servicio y datos de tu empresa."
      />
      <div className="p-6 pt-0 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy) => (
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
    </>
  );
}
