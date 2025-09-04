
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { agents } from '@/lib/data';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const agentExists = agents.some(agent => agent.email === email);

    if (agentExists) {
      toast({
        title: "Correo de Recuperación Enviado",
        description: `Si la cuenta existe, se ha enviado un enlace de recuperación a ${email}.`,
      });
      router.push('/login');
    } else {
       toast({
        title: "Correo de Recuperación Enviado",
        description: `Si la cuenta existe, se ha enviado un enlace de recuperación a ${email}.`,
      });
      router.push('/login');
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">¿Olvidaste tu Contraseña?</CardTitle>
        <CardDescription>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Enviar Enlace de Recuperación
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Iniciar Sesión
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
