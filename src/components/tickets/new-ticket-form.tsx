
"use client";

import { useState, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Loader2, Mail, Upload, X } from "lucide-react";
import { getTicketCategorySuggestion } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Client, Ticket } from "@/lib/data";
import Image from 'next/image';
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, Timestamp, query, orderBy } from "firebase/firestore";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ticketSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  client: z.string().min(1, "El cliente es obligatorio."),
  clientEmail: z.string().email().optional(),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  category: z.enum(["Support", "Hosting", "Oportuno", "Other"]),
  sla: z.enum(["Normal", "Alta", "Baja"]),
  image: z
    .custom<File | undefined>()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo de la imagen es 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se aceptan formatos .jpg, .jpeg, .png y .webp."
    ),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function NewTicketForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsCollection = collection(db, "clients");
        const q = query(clientsCollection, orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        const clientList: Client[] = [];
        querySnapshot.forEach((doc) => {
          clientList.push({ id: doc.id, ...doc.data() } as Client);
        });
        setClients(clientList);
      } catch (error) {
        console.error("Error fetching clients for form: ", error);
      }
    };
    fetchClients();
  }, []);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      client: "",
      clientEmail: "",
      description: "",
      category: "Support",
      sla: "Normal",
      image: undefined,
    },
  });

  const handleClientChange = (clientName: string) => {
    const selectedClient = clients.find(c => c.name === clientName);
    if (selectedClient) {
      form.setValue("client", selectedClient.name);
      form.setValue("clientEmail", selectedClient.email);
    }
  };

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    let imageUrl: string | undefined = undefined;

    if (data.image) {
      // In a real app, upload to Firebase Storage. For now, use a placeholder.
      // This part requires setting up Firebase Storage, which is a separate step.
      // For demonstration, we'll use a placeholder image.
      imageUrl = 'https://picsum.photos/seed/newticket/1200/800';
      toast({
        title: "Nota sobre la imagen",
        description: "La subida de archivos real requiere Firebase Storage. Se usó una imagen de marcador de posición.",
      });
    }

    const newTicketData = {
      title: data.description, // Using description as title for more detail
      client: data.client,
      category: data.category,
      status: 'Open' as 'Open' | 'In Progress' | 'Closed',
      sla: data.sla,
      createdAt: Timestamp.now(),
      imageUrl: imageUrl,
      updates: [{
        timestamp: Timestamp.now(),
        author: 'System',
        update: `Ticket Creado: ${data.title}`
      }]
    };

    try {
      await addDoc(collection(db, "tickets"), newTicketData);
      toast({
        title: "Ticket Enviado",
        description: "Tu nuevo ticket ha sido creado exitosamente.",
      });
      onFormSubmit();
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error al Crear Ticket",
        description: "No se pudo crear el ticket. Revisa los permisos de Firestore.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestCategory = async () => {
    setIsSuggesting(true);
    const description = form.getValues("description");
    const result = await getTicketCategorySuggestion(description);
    if (result.category) {
      form.setValue("category", result.category);
      toast({
        title: "Categoría Sugerida",
        description: `Hemos sugerido la categoría "${result.category}" basada en tu descripción.`,
      });
    } else {
      toast({
        title: "Sugerencia Fallida",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsSuggesting(false);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      setPreview(URL.createObjectURL(file));
    } else {
      form.setValue('image', undefined);
      setPreview(null);
    }
  };

  const removeImage = () => {
    form.setValue('image', undefined);
    setPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Ticket</FormLabel>
              <FormControl>
                <Input placeholder="ej., El sitio web muestra un error 500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={handleClientChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.name}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email del Cliente</FormLabel>
                <FormControl>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="email@cliente.com" {...field} readOnly className="pl-9 bg-slate-50" />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Por favor, describe el problema en detalle..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adjuntar Imagen (Opcional)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2" />
                        Seleccionar Archivo
                    </Button>
                    <Input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef}
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={handleFileChange} 
                    />
                    {preview && (
                        <div className="relative group">
                            <Image src={preview} alt="Vista previa" width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                            <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={removeImage}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoría</FormLabel>
                <div className="flex items-center gap-2">
                    <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    >
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Support">Soporte</SelectItem>
                        <SelectItem value="Hosting">Hosting</SelectItem>
                        <SelectItem value="Oportuno">Oportuno</SelectItem>
                        <SelectItem value="Other">Otro</SelectItem>
                    </SelectContent>
                    </Select>
                    <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSuggestCategory}
                    disabled={isSuggesting}
                    aria-label="Sugerir Categoría"
                    >
                    {isSuggesting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <Wand2 />
                    )}
                    </Button>
                </div>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="sla"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prioridad (SLA)</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            Enviar Ticket
          </Button>
        </div>
      </form>
    </Form>
  );
}
