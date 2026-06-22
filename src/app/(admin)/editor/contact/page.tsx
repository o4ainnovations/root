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

export default function ContactEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [introText, setIntroText] = useState("");
  const [generalEmail, setGeneralEmail] = useState("");
  const [pressEmail, setPressEmail] = useState("");
  const [investorsEmail, setInvestorsEmail] = useState("");
  const [partnershipsEmail, setPartnershipsEmail] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");

  useEffect(() => {
    sanityClient
      .fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "contact"][0]{_id,seo,body}`
      )
      .then((doc) => {
        if (doc) {
          setPage(doc);
          setMetaTitle(doc.seo?.metaTitle || "");
          setMetaDescription(doc.seo?.metaDescription || "");
          const b = doc.body as Record<string, unknown> || {};
          setIntroText((b.introText as string) || "");
          setGeneralEmail((b.generalEmail as string) || "");
          setPressEmail((b.pressEmail as string) || "");
          setInvestorsEmail((b.investorsEmail as string) || "");
          setPartnershipsEmail((b.partnershipsEmail as string) || "");
          setOfficeLocation((b.officeLocation as string) || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    try {
      await updatePage(page._id, { seo: { metaTitle, metaDescription }, body: { introText, generalEmail, pressEmail, investorsEmail, partnershipsEmail, officeLocation } });
      toast.success("Contact page updated.");
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
          <h1 className="font-heading text-3xl font-bold text-ink">Contact Page</h1>
          <p className="font-serif text-muted-foreground mt-1">/contact</p>
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
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Contact | O4A" className="rounded-none border-border bg-background font-serif" />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Meta Description</label>
            <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className="rounded-none border-border bg-background font-serif resize-none" />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">Intro Text</h2>
          <Textarea value={introText} onChange={(e) => setIntroText(e.target.value)} rows={3} className="rounded-none border-border bg-background font-serif resize-none" />
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">Contact Emails</h2>
          {[{ label: "General", value: generalEmail, setter: setGeneralEmail }, { label: "Press", value: pressEmail, setter: setPressEmail }, { label: "Investors", value: investorsEmail, setter: setInvestorsEmail }, { label: "Partnerships", value: partnershipsEmail, setter: setPartnershipsEmail }].map((f) => (
            <div key={f.label}>
              <label className="label-uppercase block mb-2">{f.label} Email</label>
              <Input value={f.value} onChange={(e) => f.setter(e.target.value)} className="rounded-none border-border bg-background font-serif" />
            </div>
          ))}
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">Office</h2>
          <div>
            <label className="label-uppercase block mb-2">Office Location</label>
            <Input value={officeLocation} onChange={(e) => setOfficeLocation(e.target.value)} placeholder="United Kingdom" className="rounded-none border-border bg-background font-serif" />
          </div>
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
