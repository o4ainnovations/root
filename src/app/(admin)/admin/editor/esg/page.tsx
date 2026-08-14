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

export default function EsgEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [commitmentText, setCommitmentText] = useState("");
  const [envText, setEnvText] = useState("");
  const [socialText, setSocialText] = useState("");
  const [govText, setGovText] = useState("");

  useEffect(() => {
    async function load() {
      const doc = await sanityClient.fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "esg"][0]{_id,title,seo,body}`
      );
      if (doc) {
        setPage(doc);
        setMetaTitle(doc.seo?.metaTitle || "");
        setMetaDescription(doc.seo?.metaDescription || "");
        const b = doc.body as Record<string, string> | undefined;
        if (b) {
          setCommitmentText(b.commitmentText || "");
          setEnvText(b.envText || "");
          setSocialText(b.socialText || "");
          setGovText(b.govText || "");
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    try {
      await updatePage(page._id, {
        seo: { metaTitle, metaDescription },
        body: {
          commitmentText,
          envText,
          socialText,
          govText,
        },
      });
      toast.success("ESG page updated.");
      router.refresh();
    } catch {
      toast.error("Failed to save. Please try again.");
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
          <Link
            href="/admin/editor"
            className="label-uppercase text-xs hover:text-ink transition-colors inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Editor
          </Link>
          <h1 className="font-heading text-3xl font-bold text-ink">
            ESG &amp; Sustainability Page
          </h1>
          <p className="font-serif text-muted-foreground mt-1">/esg</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-6 gap-2"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="card-depth-2 p-8 space-y-10">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">
            Meta Information
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Meta Title</label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="ESG & Sustainability | O4A"
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">
              Meta Description
            </label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Our commitment to environmental stewardship, social responsibility, and ethical governance."
              rows={2}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Our Commitment
          </h2>
          <div>
            <label className="label-uppercase block mb-2">
              Commitment Text
            </label>
            <Textarea
              value={commitmentText}
              onChange={(e) => setCommitmentText(e.target.value)}
              placeholder="At O4A, we believe that lasting value is built on a foundation of integrity, accountability, and long-term thinking..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Environmental
          </h2>
          <div>
            <label className="label-uppercase block mb-2">
              Environmental Text
            </label>
            <Textarea
              value={envText}
              onChange={(e) => setEnvText(e.target.value)}
              placeholder="Our environmental initiatives focus on reducing carbon footprint, investing in clean technologies, and promoting sustainable practices across our portfolio companies..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">Social</h2>
          <div>
            <label className="label-uppercase block mb-2">Social Text</label>
            <Textarea
              value={socialText}
              onChange={(e) => setSocialText(e.target.value)}
              placeholder="We are committed to fostering diverse, equitable, and inclusive workplaces, supporting the communities where we operate, and upholding human rights throughout our supply chain..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Governance
          </h2>
          <div>
            <label className="label-uppercase block mb-2">
              Governance Text
            </label>
            <Textarea
              value={govText}
              onChange={(e) => setGovText(e.target.value)}
              placeholder="Strong governance is the backbone of our organization. We maintain rigorous oversight, transparent reporting, and ethical business practices at every level..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <div className="border-t border-hairline pt-6">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-8 py-6 gap-2"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
