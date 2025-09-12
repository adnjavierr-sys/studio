
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Client } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, Building, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Paso 1: Importar el nuevo hook `useFirebase`.
import { useFirebase } from '@/hooks/use-firebase';
import { doc, getDoc, Timestamp } from "firebase/firestore";

export default function ClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  // Paso 2: Usar el hook para obtener los servicios de Firebase.
  const firebase = useFirebase();

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      // Paso 3: Asegurarse de que Firebase esté inicializado antes de usar `db`.
      if (!firebase) return;
      if (typeof id !== 'string') return;
      setIsLoading(true);
      try {
        const docRef = doc(firebase.db, "clients", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() } as Client);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id, firebase]);
  
  if (isLoading || !firebase) {
    return (
       <div className="flex h-[80vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
       </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <PageHeader title="Cliente no encontrado" description="El cliente que buscas no existe o ha sido eliminado."/>
        <Button onClick={() => router.push('/clients')}>
          <ArrowLeft className="mr-2" />
          Volver a Clientes
        </Button>
      </div>
    );
  }
  
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(client.address)}&output=embed`;
  const createdAtDate = client.createdAt instanceof Timestamp ? client.createdAt.toDate() : new Date();

  return (
    <>
      <PageHeader title="Detalles del Cliente">
        <Button onClick={() => router.push('/clients')}>
          <ArrowLeft className="mr-2" />
          Volver a Clientes
        </Button>
      </PageHeader>
      <div className="p-6 pt-0">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://picsum.photos/seed/${client.id}/100`} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{client.name}</CardTitle>
                <CardDescription>{client.company}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-4 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div className="flex items-start space-x-3">
                    <Mail className="text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-muted-foreground">{client.email}</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-3">
                    <Building className="text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">Compañía</p>
                        <p className="text-muted-foreground">{client.company}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <Calendar className="text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">Miembro Desde</p>
                        <p className="text-muted-foreground">{format(createdAtDate, 'PPP')}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <MapPin className="text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm font-medium">Dirección</p>
                        <p className="text-muted-foreground">{client.address}</p>
                    </div>
                </div>
             </div>
             <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Ubicación</h3>
                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                    <iframe
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={mapSrc}>
                    </iframe>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
