
"use client";

import { useState } from "react";
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
import { agents } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KeyRound, User, Mail, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  // Simulate fetching the current logged-in user. In a real app, this would come from an auth context.
  const [currentUser, setCurrentUser] = useState(agents[0]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    
    // Update user in our "database"
    const userIndex = agents.findIndex(a => a.id === currentUser.id);
    if (userIndex !== -1) {
      agents[userIndex] = { ...agents[userIndex], name, email };
      setCurrentUser({ ...currentUser, name, email });
    }

    toast({
      title: "Perfil Actualizado",
      description: "Tu información personal ha sido actualizada.",
    });
  };
  
  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
     const formData = new FormData(event.currentTarget);
     const newPassword = formData.get("new-password") as string;
     const confirmPassword = formData.get("confirm-password") as string;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }
    
     if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    // Update password in our "database"
    const userIndex = agents.findIndex(a => a.id === currentUser.id);
    if (userIndex !== -1) {
      agents[userIndex].password = newPassword;
      setCurrentUser({ ...currentUser, password: newPassword });
    }

    toast({
      title: "Contraseña Actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente.",
    });
    (event.currentTarget as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHeader
        title="Mi Perfil"
        description="Administra tu información personal y de seguridad."
      />
      <div className="p-6 pt-0 grid gap-6 md:grid-cols-2">
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
             <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://picsum.photos/seed/${currentUser.id}/100`} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu nombre y correo electrónico.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" defaultValue={currentUser.name} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                 <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" defaultValue={currentUser.email} className="pl-9" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>
              Asegúrate de usar una contraseña segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="new-password" name="new-password" type={showNewPassword ? "text" : "password"} className="pl-9 pr-10" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                 <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirm-password" name="confirm-password" type={showConfirmPassword ? "text" : "password"} className="pl-9 pr-10" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">Actualizar Contraseña</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
