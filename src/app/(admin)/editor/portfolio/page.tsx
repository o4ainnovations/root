"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updatePage } from "@/lib/actions/page-content";
import {
  createSubsidiary,
  updateSubsidiary,
  deleteSubsidiary,
} from "@/lib/actions/subsidiary";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { PageContent, Subsidiary } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PortfolioEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [introText, setIntroText] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSub, setEditingSub] = useState<Subsidiary | null>(null);
  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [subIndustry, setSubIndustry] = useState("");
  const [subUrl, setSubUrl] = useState("");
  const [subStatus, setSubStatus] = useState<
    "active" | "coming-soon" | "past"
  >("active");
  const [subOrder, setSubOrder] = useState(0);

  useEffect(() => {
    async function load() {
      const doc = await sanityClient.fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "portfolio"][0]{_id,title,seo,body}`
      );
      if (doc) {
        setPage(doc);
        setMetaTitle(doc.seo?.metaTitle || "");
        setMetaDescription(doc.seo?.metaDescription || "");
        const b = doc.body as Record<string, unknown> || {};
        setIntroText((b.introText as string) || "");
      }
      const subs = await sanityClient.fetch<
        { _id: string; name: string; slug: string; description: string; industry: string; url?: string; status: string; order: number }[]
      >(
        `*[_type == "subsidiary"] | order(order asc) {_id,name,"slug":slug.current,description,industry,url,status,order}`
      );
      setSubsidiaries(subs as unknown as Subsidiary[]);
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
        body: { introText },
      });
      toast.success("Portfolio page updated.");
      router.refresh();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetSubForm() {
    setShowAddForm(false);
    setEditingSub(null);
    setSubName("");
    setSubSlug("");
    setSubDescription("");
    setSubIndustry("");
    setSubUrl("");
    setSubStatus("active");
    setSubOrder(0);
  }

  function openEdit(sub: Subsidiary) {
    setEditingSub(sub);
    setShowAddForm(true);
    setSubName(sub.name);
    setSubSlug((sub.slug as unknown as string) || "");
    setSubDescription(sub.description || "");
    setSubIndustry(sub.industry || "");
    setSubUrl(sub.url || "");
    setSubStatus(sub.status);
    setSubOrder(sub.order);
  }

  function handleNameChange(name: string) {
    setSubName(name);
    if (!editingSub) {
      setSubSlug(slugify(name));
    }
  }

  async function handleSubSubmit() {
    if (!subName.trim() || !subSlug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }
    try {
      if (editingSub) {
        await updateSubsidiary(editingSub._id, {
          name: subName,
          slug: subSlug,
          description: subDescription,
          industry: subIndustry,
          url: subUrl || undefined,
          status: subStatus,
          order: subOrder,
        });
        toast.success("Subsidiary updated.");
      } else {
        await createSubsidiary({
          name: subName,
          slug: subSlug,
          description: subDescription,
          industry: subIndustry,
          url: subUrl || undefined,
          status: subStatus,
          order: subOrder,
        });
        toast.success("Subsidiary added.");
      }
      const subs = await sanityClient.fetch<
        { _id: string; name: string; slug: string; description: string; industry: string; url?: string; status: string; order: number }[]
      >(
        `*[_type == "subsidiary"] | order(order asc) {_id,name,"slug":slug.current,description,industry,url,status,order}`
      );
      setSubsidiaries(subs as unknown as Subsidiary[]);
      resetSubForm();
      router.refresh();
    } catch {
      toast.error("Failed to save subsidiary.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteSubsidiary(id);
      setSubsidiaries((prev) => prev.filter((s) => s._id !== id));
      toast.success(`"${name}" deleted.`);
      router.refresh();
    } catch {
      toast.error("Failed to delete subsidiary.");
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
            Portfolio Page
          </h1>
          <p className="font-serif text-muted-foreground mt-1">/portfolio</p>
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
              placeholder="Portfolio | O4A"
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
              placeholder="Explore O4A's portfolio of subsidiary companies."
              rows={2}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Intro Text */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">
            Intro Text
          </h2>
          <div>
            <label className="label-uppercase block mb-2">
              Introduction Text
            </label>
            <Textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="O4A's portfolio spans multiple industries..."
              rows={4}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Subsidiaries */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <h2 className="font-heading text-xl font-bold text-ink">
              Subsidiaries
            </h2>
            {!showAddForm && (
              <Button
                onClick={() => {
                  resetSubForm();
                  setShowAddForm(true);
                }}
                className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-4 gap-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Subsidiary
              </Button>
            )}
          </div>

          {subsidiaries.length > 0 && (
            <table className="w-full border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Name
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Status
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Industry
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Order
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subsidiaries.map((s) => (
                  <tr key={s._id} className="border-b border-hairline">
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {s.name}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif capitalize">
                      {s.status}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {s.industry}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {s.order}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => openEdit(s)}
                          className="rounded-none bg-background text-ink border border-border hover:bg-muted font-sans uppercase text-xs tracking-widest px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(s._id, s.name)}
                          className="rounded-none bg-background text-destructive border border-border hover:bg-muted font-sans uppercase text-xs tracking-widest px-3 py-1 gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {subsidiaries.length === 0 && !showAddForm && (
            <p className="font-serif text-muted-foreground py-4">
              No subsidiaries yet. Click &ldquo;Add Subsidiary&rdquo; to create
              one.
            </p>
          )}

          {showAddForm && (
            <div className="border border-border p-6 space-y-4 bg-background">
              <h3 className="font-heading text-lg font-bold text-ink">
                {editingSub ? "Edit Subsidiary" : "New Subsidiary"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-uppercase block mb-2">Name</label>
                  <Input
                    value={subName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Subsidiary name"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
                <div>
                  <label className="label-uppercase block mb-2">Slug</label>
                  <Input
                    value={subSlug}
                    onChange={(e) => setSubSlug(e.target.value)}
                    placeholder="subsidiary-name"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
              </div>
              <div>
                <label className="label-uppercase block mb-2">
                  Description
                </label>
                <Textarea
                  value={subDescription}
                  onChange={(e) => setSubDescription(e.target.value)}
                  placeholder="Describe the subsidiary..."
                  rows={3}
                  className="rounded-none border-border bg-background font-serif resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-uppercase block mb-2">Industry</label>
                  <Input
                    value={subIndustry}
                    onChange={(e) => setSubIndustry(e.target.value)}
                    placeholder="Technology, Healthcare, etc."
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
                <div>
                  <label className="label-uppercase block mb-2">URL</label>
                  <Input
                    value={subUrl}
                    onChange={(e) => setSubUrl(e.target.value)}
                    placeholder="https://..."
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-uppercase block mb-2">Status</label>
                  <select
                    value={subStatus}
                    onChange={(e) =>
                      setSubStatus(
                        e.target.value as "active" | "coming-soon" | "past"
                      )
                    }
                    className="w-full rounded-none border-border bg-background font-serif px-2.5 py-1 text-base h-8 border outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="past">Past</option>
                  </select>
                </div>
                <div>
                  <label className="label-uppercase block mb-2">Order</label>
                  <Input
                    type="number"
                    value={subOrder}
                    onChange={(e) => setSubOrder(Number(e.target.value))}
                    placeholder="0"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleSubSubmit}
                  className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-6 gap-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {editingSub ? "Update" : "Add"} Subsidiary
                </Button>
                <Button
                  onClick={resetSubForm}
                  className="rounded-none bg-background text-ink border border-border hover:bg-muted font-sans uppercase text-xs tracking-widest px-6"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
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
