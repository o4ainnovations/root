"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitContactForm } from "@/lib/actions/contact";

const categories = [
  { value: "general", label: "General Inquiry" },
  { value: "media", label: "Media / Press" },
  { value: "investor", label: "Investor Relations" },
  { value: "partnership", label: "Partnership Inquiry" },
  { value: "legal", label: "Legal / Compliance" },
];

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("general");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    try {
      await submitContactForm({ name, email, category, subject, message });
      toast.success("Message sent successfully. We will respond within 2 business days.");
      form.reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="label-uppercase block">
          Inquiry Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                "label-uppercase px-3 py-1.5 border border-border transition-colors",
                category === cat.value && "bg-ink text-background border-ink",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="category" value={category} />
      </div>

      <div>
        <label className="label-uppercase block mb-2" htmlFor="name">
          Full Name
        </label>
        <Input
          id="name"
          name="name"
          required
          className="rounded-none border-border bg-background font-serif"
        />
      </div>

      <div>
        <label className="label-uppercase block mb-2" htmlFor="email">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-none border-border bg-background font-serif"
        />
      </div>

      <div>
        <label className="label-uppercase block mb-2" htmlFor="subject">
          Subject
        </label>
        <Input
          id="subject"
          name="subject"
          required
          className="rounded-none border-border bg-background font-serif"
        />
      </div>

      <div>
        <label className="label-uppercase block mb-2" htmlFor="message">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          className="rounded-none border-border bg-background font-serif resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-8 py-6 w-full md:w-auto"
      >
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
