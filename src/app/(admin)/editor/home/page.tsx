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

export default function HomeEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [portfolioLabel, setPortfolioLabel] = useState("");
  const [aboutLabel, setAboutLabel] = useState("");
  const [investorsLabel, setInvestorsLabel] = useState("");
  const [newsLabel, setNewsLabel] = useState("");
  const [careersLabel, setCareersLabel] = useState("");
  const [contactLabel, setContactLabel] = useState("");

  useEffect(() => {
    async function load() {
      const doc = await sanityClient.fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "home"][0]{_id,title,seo,body}`
      );
      if (doc) {
        setPage(doc);
        setMetaTitle(doc.seo?.metaTitle || "");
        setMetaDescription(doc.seo?.metaDescription || "");
        const b = doc.body as Record<string, string> | undefined;
        if (b) {
          setCompanyName(b.companyName || "");
          setTagline(b.tagline || "");
          setPortfolioLabel(b.portfolioLabel || "");
          setAboutLabel(b.aboutLabel || "");
          setInvestorsLabel(b.investorsLabel || "");
          setNewsLabel(b.newsLabel || "");
          setCareersLabel(b.careersLabel || "");
          setContactLabel(b.contactLabel || "");
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
          companyName,
          tagline,
          portfolioLabel,
          aboutLabel,
          investorsLabel,
          newsLabel,
          careersLabel,
          contactLabel,
        },
      });
      toast.success("Home page updated.");
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
            Home Page
          </h1>
          <p className="font-serif text-muted-foreground mt-1">/</p>
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
              placeholder="O4A — A Holding Company Shaping Tomorrow's Infrastructure"
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
              placeholder="O4A is a holding company that builds, invests in, and operates businesses at the intersection of intelligence, infrastructure, and industry."
              rows={2}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Company Identity
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Company Name</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="O4A"
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Tagline</label>
            <Textarea
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="A holding company shaping tomorrow's infrastructure through intelligence, industry, and investment."
              rows={3}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Navigation Link Labels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-uppercase block mb-2">Portfolio</label>
              <Input
                value={portfolioLabel}
                onChange={(e) => setPortfolioLabel(e.target.value)}
                placeholder="Portfolio"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">About</label>
              <Input
                value={aboutLabel}
                onChange={(e) => setAboutLabel(e.target.value)}
                placeholder="About"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Investors</label>
              <Input
                value={investorsLabel}
                onChange={(e) => setInvestorsLabel(e.target.value)}
                placeholder="Investors"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">News</label>
              <Input
                value={newsLabel}
                onChange={(e) => setNewsLabel(e.target.value)}
                placeholder="News"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Careers</label>
              <Input
                value={careersLabel}
                onChange={(e) => setCareersLabel(e.target.value)}
                placeholder="Careers"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Contact</label>
              <Input
                value={contactLabel}
                onChange={(e) => setContactLabel(e.target.value)}
                placeholder="Contact"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
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
