
"use client";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);
  
  const toggleDarkMode = (checked: boolean) => {
    document.documentElement.classList.toggle('dark', checked);
    setIsDarkMode(checked);
    localStorage.setItem('theme-mode', checked ? 'dark' : 'light');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Configuración Guardada",
      description: "Tus ajustes de correo electrónico han sido guardados exitosamente.",
    });
  };

  return (
    <>
      <PageHeader
        title="Configuración"
        description="Administra la configuración y apariencia de tu aplicación."
      />
      <div className="p-6 pt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personalización de Tema</CardTitle>
            <CardDescription>
              Elige un tema para personalizar la apariencia de la aplicación y activa o desactiva el modo oscuro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode-switch" className="text-base">Modo Oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Activa el modo oscuro para una experiencia visual con menos brillo.
                  </p>
                </div>
                <Switch
                  id="dark-mode-switch"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              <ThemeSwitcher />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Correo Saliente (SMTP)</CardTitle>
            <CardDescription>
              Configura los ajustes de tu servidor de correo para enviar reportes y notificaciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">Servidor SMTP</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">Puerto</Label>
                <Input id="smtp-port" type="number" placeholder="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Nombre de Usuario</Label>
                <Input id="smtp-user" placeholder="user@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-pass">Contraseña</Label>
                <Input id="smtp-pass" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-email">Correo Remitente</Label>
                <Input id="sender-email" type="email" placeholder="noreply@example.com" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
