"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { COMPANY } from "@/lib/seo/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updatePage } from "@/lib/actions/page-content";
import { createDownload, deleteDownload } from "@/lib/actions/download";
import { Save, ArrowLeft, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import type { PageContent, Download as DownloadType } from "@/types";

export default function InvestorsEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ownershipHeading, setOwnershipHeading] = useState("");
  const [ownershipBody, setOwnershipBody] = useState("");
  const [governanceHeading, setGovernanceHeading] = useState("");
  const [governanceBody, setGovernanceBody] = useState("");
  const [financialHeading, setFinancialHeading] = useState("");
  const [financialBody, setFinancialBody] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactResponse, setContactResponse] = useState("");
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [downloadTitle, setDownloadTitle] = useState("");
  const [downloadCategory, setDownloadCategory] = useState<"investor" | "esg" | "governance">("investor");

  useEffect(() => {
    async function load() {
      const doc = await sanityClient.fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "investors"][0]{_id,title,seo,body}`
      );
      if (doc) {
        setPage(doc);
        setMetaTitle(doc.seo?.metaTitle || "");
        setMetaDescription(doc.seo?.metaDescription || "");
        const b = doc.body as Record<string, unknown> || {};
        setOwnershipHeading((b.ownershipHeading as string) || "");
        setOwnershipBody((b.ownershipBody as string) || "");
        setGovernanceHeading((b.governanceHeading as string) || "");
        setGovernanceBody((b.governanceBody as string) || "");
        setFinancialHeading((b.financialHeading as string) || "");
        setFinancialBody((b.financialBody as string) || "");
        setContactEmail((b.contactEmail as string) || "");
        setContactResponse((b.contactResponse as string) || "");
      }
      const dl = await sanityClient.fetch<DownloadType[]>(
        `*[_type == "download"] | order(publishDate desc) {_id,title,category,publishDate,file{asset->{url}}}`
      );
      setDownloads(dl);
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
        body: { ownershipHeading, ownershipBody, governanceHeading, governanceBody, financialHeading, financialBody, contactEmail, contactResponse },
      });
      toast.success("Investors page updated.");
      router.refresh();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddDownload(e: FormEvent) {
    e.preventDefault();
    if (!downloadTitle.trim()) return;
    try {
      await createDownload({ title: downloadTitle, category: downloadCategory });
      toast.success("Download added.");
      setDownloadTitle("");
      const dl = await sanityClient.fetch<DownloadType[]>(
        `*[_type == "download"] | order(publishDate desc) {_id,title,category,publishDate,file{asset->{url}}}`
      );
      setDownloads(dl);
      router.refresh();
    } catch { toast.error("Failed to add download."); }
  }

  async function handleDeleteDownload(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteDownload(id);
      setDownloads(prev => prev.filter(d => d._id !== id));
      toast.success(`"${title}" deleted.`);
      router.refresh();
    } catch { toast.error("Failed to delete."); }
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
          <Link href="/admin/editor" className="label-uppercase text-xs hover:text-ink transition-colors inline-flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Editor
          </Link>
          <h1 className="font-heading text-3xl font-bold text-ink">
            Investors Page
          </h1>
          <p className="font-serif text-muted-foreground mt-1">
            /investors
          </p>
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
        {/* Meta Information */}
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">
            Meta Information
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Meta Title</label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Investor Relations | O4A"
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Meta Description</label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Investor information for O4A — governance, financials, and reports."
              rows={2}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Ownership */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Ownership & Structure Section
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Section Heading</label>
            <Input
              value={ownershipHeading}
              onChange={(e) => setOwnershipHeading(e.target.value)}
              placeholder="Ownership & Structure"
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Section Body</label>
            <Textarea
              value={ownershipBody}
              onChange={(e) => setOwnershipBody(e.target.value)}
              placeholder="O4A is a privately held holding company..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Governance */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Governance Section
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Section Heading</label>
            <Input
              value={governanceHeading}
              onChange={(e) => setGovernanceHeading(e.target.value)}
              placeholder="Governance"
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Section Body</label>
            <Textarea
              value={governanceBody}
              onChange={(e) => setGovernanceBody(e.target.value)}
              placeholder="O4A is governed by its Board..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Financial Overview */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Financial Overview Section
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Section Heading</label>
            <Input
              value={financialHeading}
              onChange={(e) => setFinancialHeading(e.target.value)}
              placeholder="Financial Overview"
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Section Body</label>
            <Textarea
              value={financialBody}
              onChange={(e) => setFinancialBody(e.target.value)}
              placeholder="As a private company..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Downloads */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Downloads
          </h2>

          <form onSubmit={handleAddDownload} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="label-uppercase block mb-2">Title</label>
              <Input value={downloadTitle} onChange={(e) => setDownloadTitle(e.target.value)} placeholder="Annual Report 2025" className="rounded-none border-border bg-background font-serif" />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Category</label>
              <select value={downloadCategory} onChange={(e) => setDownloadCategory(e.target.value as typeof downloadCategory)} className="rounded-none border border-border bg-background font-serif px-3 py-2 h-10">
                <option value="investor">Investor</option>
                <option value="esg">ESG</option>
                <option value="governance">Governance</option>
              </select>
            </div>
            <Button type="submit" className="rounded-none bg-ink text-background button-press shadow-paper font-sans uppercase text-xs tracking-widest px-4 gap-2">
              <Upload className="h-3.5 w-3.5" /> Add
            </Button>
          </form>

          {downloads.length > 0 ? (
            <table className="w-full border border-border mt-4">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2 font-sans text-[0.6875rem] tracking-wider uppercase text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-2 font-sans text-[0.6875rem] tracking-wider uppercase text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-2 font-sans text-[0.6875rem] tracking-wider uppercase text-muted-foreground">Date</th>
                  <th className="text-right px-4 py-2 font-sans text-[0.6875rem] tracking-wider uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d) => (
                  <tr key={d._id} className="border-b border-hairline">
                    <td className="px-4 py-2 font-serif text-sm text-foreground">{d.title}</td>
                    <td className="px-4 py-2"><span className="label-uppercase text-[0.625rem]">{d.category}</span></td>
                    <td className="px-4 py-2 font-serif text-sm text-muted-foreground">{new Date(d.publishDate).getFullYear()}</td>
                    <td className="px-4 py-2 text-right">
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteDownload(d._id, d.title)} className="text-muted-foreground hover:text-ink">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="font-serif text-sm text-muted-foreground italic py-2">No downloads yet.</p>
          )}
        </section>

        {/* Contact Info */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Contact Info
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Contact Email</label>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={COMPANY.contact.investors}
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">Response Time</label>
            <Input
              value={contactResponse}
              onChange={(e) => setContactResponse(e.target.value)}
              placeholder="2 business days"
              className="rounded-none border-border bg-background font-serif"
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
