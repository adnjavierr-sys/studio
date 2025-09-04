
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { agents } from '@/lib/data';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const agent = agents.find(a => a.email === email);

    if (agent) {
      toast({
        title: "Inicio de Sesión Exitoso",
        description: `Bienvenido de nuevo, ${agent.name}.`,
      });
      router.push('/dashboard');
    } else {
      toast({
        title: "Error de Autenticación",
        description: "El correo es incorrecto.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Logo className="w-16 h-16 mx-auto mb-4" />
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tu correo para acceder a tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="agente@unoti.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
