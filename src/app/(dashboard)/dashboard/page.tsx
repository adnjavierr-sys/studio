
"use client";

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Ticket, Clock, CheckCircle } from 'lucide-react';
import { dashboardStats, ticketsByCategory } from '@/lib/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart, Cell } from 'recharts';

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function DashboardPage() {
  const chartConfig = {
    count: {
      label: 'Tickets',
    },
    Support: { label: 'Soporte', color: 'hsl(var(--chart-1))' },
    Hosting: { label: 'Hosting', color: 'hsl(var(--chart-2))' },
    Oportuno: { label: 'Oportuno', color: 'hsl(var(--chart-3))' },
    Other: { label: 'Otro', color: 'hsl(var(--chart-4))' },
  };

  return (
    <>
      <PageHeader
        title="Panel"
        description="Aquí tienes un resumen rápido de tu sistema de gestión de tickets."
      />
      <div className="p-6 pt-0 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Totales</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">Todos los tickets creados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Abiertos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.openTickets}</div>
            <p className="text-xs text-muted-foreground">Tickets esperando respuesta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.inProgressTickets}</div>
            <p className="text-xs text-muted-foreground">Tickets en los que se está trabajando</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Cerrados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.closedTickets}</div>
            <p className="text-xs text-muted-foreground">Tickets resueltos</p>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={ticketsByCategory} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent labelKey="category" />}
                />
                <Bar dataKey="count" radius={4}>
                  {ticketsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
