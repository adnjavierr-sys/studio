
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

export default function SettingsPage() {
  const { toast } = useToast();

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
        description="Administra la configuración de tu aplicación."
      />
      <div className="p-6 pt-0">
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
