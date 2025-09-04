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
        title="Reports"
        description="Generate and export ticket data reports."
      >
        <Button>
          <Download />
          Export Report
        </Button>
      </PageHeader>
      <div className="p-6 pt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Generation</CardTitle>
            <CardDescription>
              Select a report type to generate and view the data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <Select defaultValue="tickets-by-category">
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tickets-by-category">
                    Tickets by Category
                  </SelectItem>
                  <SelectItem value="tickets-by-client">
                    Tickets by Client (coming soon)
                  </SelectItem>
                  <SelectItem value="resolution-time">
                    Average Resolution Time (coming soon)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report: Tickets by Category</CardTitle>
            <CardDescription>
              A summary of the total number of tickets for each category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Ticket Count</TableHead>
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
