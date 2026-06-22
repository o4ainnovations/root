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
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/actions/team";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { PageContent, TeamMember } from "@/types";

export default function AboutEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [missionText, setMissionText] = useState("");
  const [timelineYear, setTimelineYear] = useState("");
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDesc, setTimelineDesc] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [structure, setStructure] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberTitle, setMemberTitle] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberType, setMemberType] = useState<"executive" | "board">(
    "executive"
  );
  const [memberOrder, setMemberOrder] = useState(0);

  useEffect(() => {
    async function load() {
      const doc = await sanityClient.fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "about"][0]{_id,title,seo,body}`
      );
      if (doc) {
        setPage(doc);
        setMetaTitle(doc.seo?.metaTitle || "");
        setMetaDescription(doc.seo?.metaDescription || "");
        const b = doc.body as Record<string, unknown> || {};
        setMissionText((b.missionText as string) || "");
        setTimelineYear((b.timelineYear as string) || "");
        setTimelineTitle((b.timelineTitle as string) || "");
        setTimelineDesc((b.timelineDesc as string) || "");
        setFoundedYear((b.foundedYear as string) || "");
        setHeadquarters((b.headquarters as string) || "");
        setStructure((b.structure as string) || "");
      }
      const members = await sanityClient.fetch<TeamMember[]>(
        `*[_type == "teamMember"] | order(order asc) {_id,name,title,bio,"type": type,"order": order}`
      );
      setTeam(members);
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
        body: { missionText, timelineYear, timelineTitle, timelineDesc, foundedYear, headquarters, structure },
      });
      toast.success("About page updated.");
      router.refresh();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetMemberForm() {
    setShowAddForm(false);
    setEditingMember(null);
    setMemberName("");
    setMemberTitle("");
    setMemberBio("");
    setMemberType("executive");
    setMemberOrder(0);
  }

  function openEdit(member: TeamMember) {
    setEditingMember(member);
    setShowAddForm(true);
    setMemberName(member.name);
    setMemberTitle(member.title);
    setMemberBio(member.bio || "");
    setMemberType(member.type);
    setMemberOrder(member.order);
  }

  async function handleMemberSubmit() {
    if (!memberName.trim() || !memberTitle.trim()) {
      toast.error("Name and title are required.");
      return;
    }
    try {
      if (editingMember) {
        await updateTeamMember(editingMember._id, {
          name: memberName,
          title: memberTitle,
          bio: memberBio,
          type: memberType,
          order: memberOrder,
        });
        toast.success("Team member updated.");
      } else {
        await createTeamMember({
          name: memberName,
          title: memberTitle,
          bio: memberBio,
          type: memberType,
          order: memberOrder,
        });
        toast.success("Team member added.");
      }
      const members = await sanityClient.fetch<TeamMember[]>(
        `*[_type == "teamMember"] | order(order asc) {_id,name,title,bio,"type": type,"order": order}`
      );
      setTeam(members);
      resetMemberForm();
      router.refresh();
    } catch {
      toast.error("Failed to save team member.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteTeamMember(id);
      setTeam((prev) => prev.filter((m) => m._id !== id));
      toast.success(`"${name}" deleted.`);
      router.refresh();
    } catch {
      toast.error("Failed to delete team member.");
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
            About Page
          </h1>
          <p className="font-serif text-muted-foreground mt-1">/about</p>
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
              placeholder="About | O4A"
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
              placeholder="Learn about O4A — our mission, history, team and structure."
              rows={2}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Mission Text */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">
            Mission Text
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Mission Statement</label>
            <Textarea
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              placeholder="O4A is a holding company focused on..."
              rows={6}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">
            Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-uppercase block mb-2">Year</label>
              <Input
                value={timelineYear}
                onChange={(e) => setTimelineYear(e.target.value)}
                placeholder="2020"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Title</label>
              <Input
                value={timelineTitle}
                onChange={(e) => setTimelineTitle(e.target.value)}
                placeholder="Founded"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Description</label>
              <Input
                value={timelineDesc}
                onChange={(e) => setTimelineDesc(e.target.value)}
                placeholder="Company incorporated"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2">
            Sidebar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-uppercase block mb-2">Founded</label>
              <Input
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="2020"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Headquarters</label>
              <Input
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder="City, Country"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Structure</label>
              <Input
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                placeholder="Holding Company"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="space-y-4 border-t border-hairline pt-8">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <h2 className="font-heading text-xl font-bold text-ink">
              Team Members
            </h2>
            {!showAddForm && (
              <Button
                onClick={() => {
                  resetMemberForm();
                  setShowAddForm(true);
                }}
                className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-4 gap-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Team Member
              </Button>
            )}
          </div>

          {team.length > 0 && (
            <table className="w-full border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Name
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Title
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left label-uppercase text-xs">
                    Type
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
                {team.map((m) => (
                  <tr key={m._id} className="border-b border-hairline">
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {m.name}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {m.title}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif capitalize">
                      {m.type}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif">
                      {m.order}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => openEdit(m)}
                          className="rounded-none bg-background text-ink border border-border hover:bg-muted font-sans uppercase text-xs tracking-widest px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(m._id, m.name)}
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

          {team.length === 0 && !showAddForm && (
            <p className="font-serif text-muted-foreground py-4">
              No team members yet. Click &ldquo;Add Team Member&rdquo; to
              create one.
            </p>
          )}

          {showAddForm && (
            <div className="border border-border p-6 space-y-4 bg-background">
              <h3 className="font-heading text-lg font-bold text-ink">
                {editingMember ? "Edit Team Member" : "New Team Member"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-uppercase block mb-2">Name</label>
                  <Input
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Full name"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
                <div>
                  <label className="label-uppercase block mb-2">Title</label>
                  <Input
                    value={memberTitle}
                    onChange={(e) => setMemberTitle(e.target.value)}
                    placeholder="Job title"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
                <div>
                  <label className="label-uppercase block mb-2">Order</label>
                  <Input
                    type="number"
                    value={memberOrder}
                    onChange={(e) => setMemberOrder(Number(e.target.value))}
                    placeholder="0"
                    className="rounded-none border-border bg-background font-serif"
                  />
                </div>
              </div>
              <div>
                <label className="label-uppercase block mb-2">Bio</label>
                <Textarea
                  value={memberBio}
                  onChange={(e) => setMemberBio(e.target.value)}
                  placeholder="Short biography"
                  rows={3}
                  className="rounded-none border-border bg-background font-serif resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-uppercase block mb-2">Type</label>
                  <select
                    value={memberType}
                    onChange={(e) =>
                      setMemberType(e.target.value as "executive" | "board")
                    }
                    className="w-full rounded-none border-border bg-background font-serif px-2.5 py-1 text-base h-8 border outline-none"
                  >
                    <option value="executive">Executive</option>
                    <option value="board">Board</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleMemberSubmit}
                  className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-6 gap-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {editingMember ? "Update" : "Add"} Team Member
                </Button>
                <Button
                  onClick={resetMemberForm}
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
