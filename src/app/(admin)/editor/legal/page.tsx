"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updatePage } from "@/lib/actions/page-content";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PageContent } from "@/types";

const sections = [
  { key: "privacy", label: "Privacy Policy" },
  { key: "terms", label: "Terms of Service" },
  { key: "cookies", label: "Cookie Policy" },
  { key: "gdpr", label: "GDPR Compliance" },
  { key: "whistleblower", label: "Whistleblower Policy" },
];

export default function LegalEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [noindex, setNoindex] = useState(false);

  useEffect(() => {
    sanityClient
      .fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "legal"][0]{_id,seo}`
      )
      .then((doc) => {
        if (doc) {
          setPage(doc);
          setMetaTitle(doc.seo?.metaTitle || "");
          setMetaDescription(doc.seo?.metaDescription || "");
          setNoindex(doc.seo?.noindex || false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    try {
      await updatePage(page._id, { seo: { metaTitle, metaDescription, noindex } });
      toast.success("Legal page updated.");
      router.refresh();
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-48 bg-paper-shadow animate-pulse" />
        <div className="h-96 bg-paper-shadow animate-pulse card-depth-1" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <Link href="/admin/editor" className="label-uppercase text-xs hover:text-ink inline-flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Editor
          </Link>
          <h1 className="font-heading text-3xl font-bold text-ink">Legal & Governance Page</h1>
          <p className="font-serif text-muted-foreground mt-1">/legal</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-none bg-ink text-background button-press shadow-paper font-sans uppercase text-xs tracking-widest px-6 gap-2">
          <Save className="h-3.5 w-3.5" />{saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="card-depth-2 p-8 space-y-10">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">Meta Information</h2>
          <div>
            <label className="label-uppercase block mb-2">Meta Title</label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Legal & Governance | O4A" className="rounded-none border-border bg-background font-serif" />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Meta Description</label>
            <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className="rounded-none border-border bg-background font-serif resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="noindex" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} className="rounded-none border-border" />
            <label htmlFor="noindex" className="font-serif text-foreground">Hide from search engines (noindex)</label>
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">Legal Sections</h2>
          <p className="font-serif text-sm text-muted-foreground">
            {sections.length} sections: {sections.map((s) => s.label).join(", ")}. Each section&apos;s content is managed in the Sanity CMS under the &quot;legal&quot; pageContent document. Full rich text editing is available in Sanity Studio.
          </p>
        </section>

        <div className="border-t border-hairline pt-6">
          <Button onClick={handleSave} disabled={saving} className="rounded-none bg-ink text-background button-press shadow-paper font-sans uppercase text-xs tracking-widest px-8 py-6 gap-2">
            <Save className="h-3.5 w-3.5" />{saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
