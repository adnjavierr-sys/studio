
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { Agent } from "@/lib/data";
import { AgentsClient } from "@/components/agents/agents-client";

async function getAgents() {
    const agentsCollection = collection(db, "agents");
    const q = query(agentsCollection, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    const agents = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Timestamp to Date
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: createdAt,
        password: data.password,
      } as Agent;
    });
    return agents;
}

export default async function AgentsPage() {
  const initialAgents = await getAgents();

  return <AgentsClient initialAgents={initialAgents} />;
}
