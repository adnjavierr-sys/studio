
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { Client } from "@/lib/data";
import { ClientsClient } from "@/components/clients/clients-client";

async function getClients() {
    const clientsCollection = collection(db, "clients");
    const q = query(clientsCollection, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    const clients: Client[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      clients.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        company: data.company,
        address: data.address,
        createdAt: (data.createdAt as Timestamp).toDate(),
      });
    });
    
    return clients;
}


export default async function ClientsPage() {
  const initialClients = await getClients();
  return <ClientsClient initialClients={initialClients} />;
}
