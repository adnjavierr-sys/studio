"use client";

import { useState } from "react";
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
import { Wand2, Loader2 } from "lucide-react";
import { getTicketCategorySuggestion } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  client: z.string().min(1, "Client is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["Support", "Hosting", "Urgent", "Other"]),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export function NewTicketForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      client: "",
      description: "",
      category: "Support",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    // Here you would typically send the data to your backend.
    // We'll simulate it with a delay.
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast({
      title: "Ticket Submitted",
      description: "Your new ticket has been created successfully.",
    });
    onFormSubmit();
  };

  const handleSuggestCategory = async () => {
    setIsSuggesting(true);
    const description = form.getValues("description");
    const result = await getTicketCategorySuggestion(description);
    if (result.category) {
      form.setValue("category", result.category);
      toast({
        title: "Category Suggested",
        description: `We've suggested the "${result.category}" category based on your description.`,
      });
    } else {
      toast({
        title: "Suggestion Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsSuggesting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Website is showing a 500 error" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe the issue in detail..."
                  className="resize-none"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Hosting">Hosting</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSuggestCategory}
                  disabled={isSuggesting}
                  aria-label="Suggest Category"
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
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
            Submit Ticket
          </Button>
        </div>
      </form>
    </Form>
  );
}
