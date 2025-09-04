"use server";

import { categorizeTicket } from "@/ai/flows/categorize-new-tickets";

export async function getTicketCategorySuggestion(ticketText: string): Promise<{ category?: 'Support' | 'Hosting' | 'Urgent' | 'Other', error?: string }> {
  if (!ticketText || ticketText.trim().length < 10) {
    return { error: "Please provide more details in the ticket description for a suggestion." };
  }
  try {
    const result = await categorizeTicket({ ticketText });
    return { category: result.category };
  } catch (e) {
    console.error("Error getting category suggestion:", e);
    return { error: "An unexpected error occurred while getting a category suggestion." };
  }
}
