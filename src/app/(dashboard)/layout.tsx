'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, FileText, LayoutDashboard, Ticket, Users, Shield, PanelLeft, Settings } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
  { href: '/tickets', icon: Ticket, label: 'Tickets' },
  { href: '/clients', icon: Users, label: 'Clientes' },
  { href: '/reports', icon: BarChart, label: 'Reportes' },
  { href: '/policies', icon: Shield, label: 'Políticas' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Logo className="w-8 h-8"/>
                <span className="font-semibold text-lg">UnoTI-Ticket</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: 'bg-primary text-primary-foreground',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{ children: 'Configuración', className: 'bg-primary text-primary-foreground' }}>
                        <Settings />
                        <span>Configuración</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://picsum.photos/100" alt="Avatar de Usuario" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="flex flex-col text-left">
                            <span className="text-sm font-medium">Usuario Admin</span>
                            <span className="text-xs text-muted-foreground">admin@unoti.com</span>
                        </span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <div>
              {/* Header content like search or notifications can go here */}
            </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
