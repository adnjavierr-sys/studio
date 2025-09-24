"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase-config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const clientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("El email no es válido."),
  company: z.string().min(1, "La compañía es obligatoria."),
  address: z.string().min(1, "La dirección es obligatoria."),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function NewClientForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      address: "",
    },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ClientFormValues) => {
    try {
      await addDoc(collection(db, "clients"), {
        ...data,
        createdAt: Timestamp.now(),
      });
      toast({
        title: "Cliente añadido",
        description: `El cliente ${data.name} ha sido añadido.`,
      });
      onFormSubmit();
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error al Añadir",
        description: "No se pudo añadir el cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compañía</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, Anytown, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Añadir Cliente
          </Button>
        </div>
      </form>
    </Form>
  );
}
