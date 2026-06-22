"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { COMPANY } from "@/lib/seo/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updatePage } from "@/lib/actions/page-content";
import {
  createPressRelease,
  updatePressRelease,
  deletePressRelease,
} from "@/lib/actions/press";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { PageContent, PressRelease } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categoryColors: Record<PressRelease["category"], string> = {
  corporate: "bg-ink/10 text-ink border-ink/20",
  product: "bg-green-50 text-green-800 border-green-200",
  partnership: "bg-amber-50 text-amber-800 border-amber-200",
};

export default function NewsEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [introText, setIntroText] = useState("");
  const [mediaContactEmail, setMediaContactEmail] = useState("");
  const [mediaKitMessage, setMediaKitMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState<PressRelease | null>(
    null
  );
  const [releaseTitle, setReleaseTitle] = useState("");
  const [releaseSlug, setReleaseSlug] = useState("");
  const [releaseCategory, setReleaseCategory] = useState<
    "corporate" | "product" | "partnership"
  >("corporate");
  const [releaseFeatured, setReleaseFeatured] = useState(false);
  const [releaseBody, setReleaseBody] = useState("");

  useEffect(() => {
    async function load() {
      const doc = await sanityClient.fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "news"][0]{_id,title,seo,body}`
      );
      if (doc) {
        setPage(doc);
        setMetaTitle(doc.seo?.metaTitle || "");
        setMetaDescription(doc.seo?.metaDescription || "");
        const b = doc.body as Record<string, unknown> || {};
        setIntroText((b.introText as string) || "");
        setMediaContactEmail((b.mediaContactEmail as string) || "");
        setMediaKitMessage((b.mediaKitMessage as string) || "");
      }
      const press = await sanityClient.fetch<
        { _id: string; title: string; slug: string; date: string; category: string; featured: boolean }[]
      >(
        `*[_type == "pressRelease"] | order(date desc) {_id,title,"slug":slug.current,date,category,featured,body}`
      );
      setReleases(press as unknown as PressRelease[]);
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
        body: { introText, mediaContactEmail, mediaKitMessage },
      });
      toast.success("News page updated.");
      router.refresh();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetReleaseForm() {
    setShowAddForm(false);
    setEditingRelease(null);
    setReleaseTitle("");
    setReleaseSlug("");
    setReleaseCategory("corporate");
    setReleaseFeatured(false);
    setReleaseBody("");
  }

  function openEdit(release: PressRelease) {
    setEditingRelease(release);
    setShowAddForm(true);
    setReleaseTitle(release.title);
    setReleaseSlug((release.slug as unknown as string) || "");
    setReleaseCategory(release.category);
    setReleaseFeatured(release.featured);
    setReleaseBody((release.body as string) || "");
  }

  function handleTitleChange(title: string) {
    setReleaseTitle(title);
    if (!editingRelease) {
      setReleaseSlug(slugify(title));
    }
  }

  async function handleReleaseSubmit() {
    if (!releaseTitle.trim() || !releaseSlug.trim()) {
      toast.error("Title and slug are required.");
      return;
    }
    try {
      if (editingRelease) {
        await updatePressRelease(editingRelease._id, {
          title: releaseTitle,
          slug: releaseSlug,
          category: releaseCategory,
          featured: releaseFeatured,
          body: releaseBody || undefined,
        });
        toast.success("Press release updated.");
      } else {
        await createPressRelease({
          title: releaseTitle,
          slug: releaseSlug,
          category: releaseCategory,
          featured: releaseFeatured,
          body: releaseBody || undefined,
        });
        toast.success("Press release added.");
      }
      const press = await sanityClient.fetch<
        { _id: string; title: string; slug: string; date: string; category: string; featured: boolean }[]
      >(
        `*[_type == "pressRelease"] | order(date desc) {_id,title,"slug":slug.current,date,category,featured,body}`
      );
      setReleases(press as unknown as PressRelease[]);
      resetReleaseForm();
      router.refresh();
    } catch {
      toast.error("Failed to save press release.");
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deletePressRelease(id);
      setReleases((prev) => prev.filter((r) => r._id !== id));
      toast.success(`"${title}" deleted.`);
      router.refresh();
    } catch {
      toast.error("Failed to delete press release.");
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            Newsroom Page
          </h1>
          <p className="font-serif text-muted-foreground mt-1">/news</p>
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
              placeholder="Newsroom | O4A"
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
              placeholder="Latest press releases, media resources, and news from O4A."
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
              placeholder="Welcome to the O4A newsroom..."
              rows={4}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Media Contact */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">
            Media Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-uppercase block mb-2">
                Media Contact Email
              </label>
              <Input
                value={mediaContactEmail}
                onChange={(e) => setMediaContactEmail(e.target.value)}
                placeholder={COMPANY.contact.press}
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">
                Media Kit Message
              </label>
              <Input
                value={mediaKitMessage}
                onChange={(e) => setMediaKitMessage(e.target.value)}
                placeholder="Download our media kit for brand assets..."
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <h2 className="font-heading text-xl font-bold text-ink">
              Press Releases
            </h2>
            {!showAddForm && (
              <Button
                onClick={() => {
                  resetReleaseForm();
                  setShowAddForm(true);
                }}
                className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-4 gap-2"
              >
                <Plus className="h-3.5 w-3.5" />
                New Press Release
              </Button>
            )}
          </div>

          {releases.length > 0 && (
            <table className="w-full border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Title
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Category
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Date
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Featured
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {releases.map((r) => (
                  <tr key={r._id} className="border-b border-hairline">
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {r.title}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      <Badge
                        className={`rounded-none font-sans uppercase text-xs tracking-widest border ${categoryColors[r.category]}`}
                      >
                        {r.category}
                      </Badge>
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif text-sm">
                      {r.date ? formatDate(r.date) : "—"}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {r.featured ? (
                        <Badge className="rounded-none bg-ink text-background font-sans uppercase text-xs tracking-widest border border-ink">
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs font-sans uppercase tracking-widest">
                          —
                        </span>
                      )}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => openEdit(r)}
                          className="rounded-none bg-background text-ink border border-border hover:bg-muted font-sans uppercase text-xs tracking-widest px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(r._id, r.title)}
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

          {releases.length === 0 && !showAddForm && (
            <p className="font-serif text-muted-foreground py-4">
              No press releases yet. Click &ldquo;New Press Release&rdquo; to
              create one.
            </p>
          )}

          {showAddForm && (
            <div className="border border-border p-6 space-y-4 bg-background">
              <h3 className="font-heading text-lg font-bold text-ink">
                {editingRelease ? "Edit Press Release" : "New Press Release"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-uppercase block mb-2">Title</label>
                  <Input
                    value={releaseTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Press release title"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
                <div>
                  <label className="label-uppercase block mb-2">Slug</label>
                  <Input
                    value={releaseSlug}
                    onChange={(e) => setReleaseSlug(e.target.value)}
                    placeholder="press-release-title"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-uppercase block mb-2">Category</label>
                  <select
                    value={releaseCategory}
                    onChange={(e) =>
                      setReleaseCategory(
                        e.target.value as
                          | "corporate"
                          | "product"
                          | "partnership"
                      )
                    }
                    className="w-full rounded-none border-border bg-background font-serif px-2.5 py-1 text-base h-8 border outline-none"
                  >
                    <option value="corporate">Corporate</option>
                    <option value="product">Product</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 font-sans uppercase text-xs tracking-widest cursor-pointer">
                    <input
                      type="checkbox"
                      checked={releaseFeatured}
                      onChange={(e) => setReleaseFeatured(e.target.checked)}
                      className="rounded-none border-border"
                    />
                    Featured
                  </label>
                </div>
              </div>
              <div>
                <label className="label-uppercase block mb-2">Body Content (optional)</label>
                <Textarea
                  value={releaseBody}
                  onChange={(e) => setReleaseBody(e.target.value)}
                  placeholder="Enter the press release content..."
                  rows={6}
                  className="rounded-none border-border bg-background font-serif resize-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleReleaseSubmit}
                  className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-6 gap-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {editingRelease ? "Update" : "Add"} Press Release
                </Button>
                <Button
                  onClick={resetReleaseForm}
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
