
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Ticket, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart, Cell } from 'recharts';
// Paso 1: Importar las funciones necesarias y la instancia de la base de datos.
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Ticket as TicketType } from '@/lib/data';

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });
  const [categoryData, setCategoryData] = useState<{ category: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // EJEMPLO DE LECTURA DE UNA COLECCIÓN COMPLETA
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Paso 2: Obtener una referencia a la colección "tickets".
        const ticketsCollection = collection(db, "tickets");
        
        // Paso 3: Usar `getDocs` para obtener todos los documentos de la colección.
        const querySnapshot = await getDocs(ticketsCollection);
        const tickets: TicketType[] = [];
        querySnapshot.forEach((doc) => {
          tickets.push({ id: doc.id, ...doc.data() } as TicketType);
        });

        // Paso 4: Procesar los datos leídos para calcular estadísticas.
        // Se calcula el total de tickets y se filtra por estado para obtener los contadores.
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'Open').length;
        const inProgress = tickets.filter(t => t.status === 'In Progress').length;
        const closed = tickets.filter(t => t.status === 'Closed').length;
        setStats({ total, open, inProgress, closed });
        
        // Se calculan los tickets por categoría para la gráfica.
        const categoryCounts: { [key: string]: number } = { Support: 0, Hosting: 0, Oportuno: 0, Other: 0 };
        tickets.forEach(ticket => {
          if (ticket.category in categoryCounts) {
            categoryCounts[ticket.category]++;
          }
        });
        setCategoryData(Object.entries(categoryCounts).map(([key, value]) => ({ category: key, count: value })));
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartConfig = {
    count: {
      label: 'Tickets',
    },
    Support: { label: 'Soporte', color: 'hsl(var(--chart-1))' },
    Hosting: { label: 'Hosting', color: 'hsl(var(--chart-2))' },
    Oportuno: { label: 'Oportuno', color: 'hsl(var(--chart-3))' },
    Other: { label: 'Otro', color: 'hsl(var(--chart-4))' },
  };
  
  const StatCard = ({ title, value, icon: Icon, description }: { title: string; value: number; icon: React.ElementType; description: string; }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageHeader
        title="Panel"
        description="Aquí tienes un resumen rápido de tu sistema de gestión de tickets."
      />
      <div className="p-6 pt-0 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Tickets Totales" value={stats.total} icon={Ticket} description="Todos los tickets creados" />
        <StatCard title="Tickets Abiertos" value={stats.open} icon={Clock} description="Tickets esperando respuesta" />
        <StatCard title="En Progreso" value={stats.inProgress} icon={BarChart} description="Tickets en los que se está trabajando" />
        <StatCard title="Tickets Cerrados" value={stats.closed} icon={CheckCircle} description="Tickets resueltos" />
      </div>

      <div className="p-6 pt-0">
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsBarChart data={categoryData} accessibilityLayer>
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
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
