
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { Policy, Client } from "@/lib/data";
import { PoliciesClient } from "@/components/policies/policies-client";

async function getPolicies() {
    const policiesCollection = collection(db, "policies");
    const policiesQuery = query(policiesCollection, orderBy("createdAt", "desc"));
    const policiesSnapshot = await getDocs(policiesQuery);
    const policies = policiesSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Timestamp to Date
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        type: data.type,
        clientName: data.clientName,
        createdAt: createdAt,
      } as Policy;
    });
    return policies;
}

async function getClients() {
    const clientsCollection = collection(db, "clients");
    const clientsQuery = query(clientsCollection, orderBy("name", "asc"));
    const clientsSnapshot = await getDocs(clientsQuery);
    // Convert Timestamp to Date for createdAt field if it exists.
    const clientList: Client[] = clientsSnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
        return { 
            id: doc.id, 
            ...data,
            createdAt: createdAt
        } as Client
    });
    return clientList;
}

export default async function PoliciesPage() {
  const initialPolicies = await getPolicies();
  const clients = await getClients();

  return <PoliciesClient initialPolicies={initialPolicies} clients={clients} />;
}
