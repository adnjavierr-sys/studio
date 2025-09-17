
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { initializeFirebase } from "@/lib/firebase-config";
import type { FirebaseServices } from "@/lib/firebase-config";
import { collection, getDocs, addDoc, Timestamp, writeBatch, doc } from "firebase/firestore";
import { Loader2, HardDrive, List, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TestDocument {
  id: string;
  name: string;
  createdAt: Date;
}

export default function DatabaseTestPage() {
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);
  const [testData, setTestData] = useState<TestDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [testName, setTestName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const firebaseServices = initializeFirebase();
    if (firebaseServices) {
      setFirebase(firebaseServices);
    }
  }, []);

  const fetchData = async () => {
    if (!firebase) return;
    setIsLoading(true);
    try {
      const testCollection = collection(firebase.db, "test_collection");
      const querySnapshot = await getDocs(testCollection);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt.toDate(),
      })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setTestData(data);
    } catch (error) {
      console.error("Error fetching test data:", error);
      toast({ title: "Error de Lectura", description: "No se pudieron cargar los datos de prueba.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firebase) {
      fetchData();
    }
  }, [firebase]);

  const handleAddData = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!firebase || !testName.trim()) return;
    setIsSubmitting(true);
    try {
      const testCollection = collection(firebase.db, "test_collection");
      await addDoc(testCollection, {
        name: testName.trim(),
        createdAt: Timestamp.now(),
      });
      toast({ title: "Éxito", description: "El dato de prueba se guardó en Firestore." });
      setTestName("");
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error adding test data:", error);
      toast({ title: "Error de Escritura", description: "No se pudo guardar el dato de prueba.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearCollection = async () => {
      if (!firebase || testData.length === 0) return;
      setIsClearing(true);
      try {
          const testCollectionRef = collection(firebase.db, "test_collection");
          const querySnapshot = await getDocs(testCollectionRef);
          const batch = writeBatch(firebase.db);
          querySnapshot.forEach(doc => {
              batch.delete(doc.ref);
          });
          await batch.commit();
          toast({ title: "Colección Limpiada", description: "Se eliminaron todos los datos de prueba." });
          await fetchData();
      } catch (error) {
          console.error("Error clearing collection:", error);
          toast({ title: "Error al Limpiar", description: "No se pudo limpiar la colección.", variant: "destructive" });
      } finally {
          setIsClearing(false);
      }
  };

  return (
    <>
      <PageHeader
        title="Test de Base de Datos"
        description="Esta página te permite verificar directamente la escritura y lectura en Firestore."
      />
      <div className="p-6 pt-0 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Añadir Datos de Prueba</CardTitle>
            <CardDescription>
              Escribe algo en el campo y haz clic en "Guardar". Si la conexión es exitosa, aparecerá en la lista de la derecha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddData} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-name">Dato de Prueba</Label>
                <Input
                  id="test-name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Escribe cualquier cosa..."
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" disabled={isSubmitting || !firebase}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <HardDrive className="mr-2 h-4 w-4" />
                Guardar en Firestore
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>2. Verificar Datos Guardados</CardTitle>
                <CardDescription>
                  Aquí se mostrarán los datos leídos desde la colección 'test_collection' en Firestore.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                 </Button>
                 <Button variant="destructive" size="icon" onClick={handleClearCollection} disabled={isClearing || testData.length === 0}>
                    {isClearing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                 </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md h-64 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : testData.length > 0 ? (
                testData.map(item => (
                  <div key={item.id} className="text-sm p-2 bg-muted rounded-md">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Guardado: {format(item.createdAt, "PPP p")}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                   <div>
                    <List className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No hay datos de prueba.</p>
                   </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
