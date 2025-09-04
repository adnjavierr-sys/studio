import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ticketsByCategory } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reportes"
        description="Genera y exporta reportes de datos de tickets."
      >
        <Button>
          <Download />
          Exportar Reporte
        </Button>
      </PageHeader>
      <div className="p-6 pt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generación de Reportes</CardTitle>
            <CardDescription>
              Selecciona un tipo de reporte para generar y ver los datos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Select defaultValue="tickets-by-category">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tickets-by-category">
                    Tickets por Categoría
                  </SelectItem>
                  <SelectItem value="tickets-by-client">
                    Tickets por Cliente (próximamente)
                  </SelectItem>
                  <SelectItem value="resolution-time">
                    Tiempo Promedio de Resolución (próximamente)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporte: Tickets por Categoría</CardTitle>
            <CardDescription>
              Un resumen del número total de tickets para cada categoría.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Cantidad de Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsByCategory.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
