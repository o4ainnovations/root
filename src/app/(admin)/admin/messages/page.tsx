"use client";

import { useState, useEffect, useMemo } from "react";
import { sanityFetch } from "@/lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Archive,
  ArchiveRestore,
  Search,
  Download,
  Eye,
  EyeOff,
  Reply,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Loader2,
  Circle,
} from "lucide-react";
import {
  markMessageRead,
  markMessageUnread,
  archiveMessage,
  unarchiveMessage,
  addInternalNote,
} from "@/lib/actions/messages";
import type { ContactSubmission } from "@/types";

const MESSAGES_QUERY = `*[_type == "contactSubmission"] | order(_createdAt desc) {
  _id,
  name,
  email,
  category,
  subject,
  message,
  read,
  archived,
  internalNotes,
  _createdAt
}`;

const CATEGORIES = ["general", "media", "investor", "partnership", "legal"] as const;

const categoryStyles: Record<string, string> = {
  general: "border-slate-500 text-slate-600",
  media: "border-purple-600 text-purple-600",
  investor: "border-emerald-600 text-emerald-600",
  partnership: "border-amber-600 text-amber-600",
  legal: "border-red-600 text-red-600",
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  // Note: sanityFetch cache config (next.tags, revalidate) is ignored in "use client" components.
  // Data is fetched directly from Sanity CDN without Next.js server cache layer.
  useEffect(() => {
    let cancelled = false;
    sanityFetch<ContactSubmission[]>({ query: MESSAGES_QUERY }).then((result) => {
      if (cancelled) return;
      setMessages(result);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject || "").toLowerCase().includes(q)
      );
    });
  }, [messages, categoryFilter, searchQuery]);

  const unreadCount = messages.filter((m) => !m.read).length;

  function handleExportCSV() {
    const headers = ["Date", "Name", "Email", "Category", "Subject", "Message", "Read", "Archived"];
    const rows = messages.map((m) => [
      m._createdAt ? new Date(m._createdAt).toISOString().slice(0, 10) : "",
      m.name,
      m.email,
      m.category,
      m.subject || "",
      `"${(m.message || "").replace(/"/g, '""')}"`,
      m.read ? "Yes" : "No",
      m.archived ? "Yes" : "No",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `o4a-messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleMarkRead = async (id: string) => {
    await markMessageRead(id);
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, read: true } : m)),
    );
    toast.success("Marked as read");
  };

  const handleMarkUnread = async (id: string) => {
    await markMessageUnread(id);
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, read: false } : m)),
    );
    toast.success("Marked as unread");
  };

  const handleArchive = async (id: string) => {
    await archiveMessage(id);
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, archived: true } : m)),
    );
    setExpandedId(null);
    toast.success("Message archived");
  };

  const handleUnarchive = async (id: string) => {
    await unarchiveMessage(id);
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, archived: false } : m)),
    );
    toast.success("Message unarchived");
  };

  const handleSaveNote = async (id: string) => {
    const note = (noteInput[id] || "").trim();
    if (!note) return;
    setSavingNote(id);
    await addInternalNote(id, note);
    setMessages((prev) =>
      prev.map((m) =>
        m._id === id ? { ...m, internalNotes: note } : m,
      ),
    );
    setSavingNote(null);
    toast.success("Note saved");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const visibleArchived = categoryFilter === "archived";

  return (
    <div className="space-y-6">
      <div className="page-header flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ink">
            Messages
          </h1>
          <p className="font-serif text-muted-foreground mt-2">
            Contact form submissions from the O4A website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "rounded-none font-sans uppercase text-[0.625rem] tracking-wider px-2.5 py-1 h-auto",
              unreadCount > 0
                ? "border-ink text-ink"
                : "border-border text-muted-foreground",
            )}
          >
            {unreadCount} unread
          </Badge>

          <Button variant="outline" size="sm" className="rounded-none gap-1.5" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5" />
            <span className="font-sans uppercase text-[0.625rem] tracking-wider">
              Export CSV
            </span>
          </Button>
        </div>
      </div>

      <Card className="card-depth-1 border-border">
        <CardContent className="p-0">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm rounded-none"
              />
            </div>

            <Separator orientation="vertical" className="h-5" />

            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "font-sans uppercase text-[0.625rem] tracking-wider px-2.5 py-1 transition-colors border border-transparent",
                  categoryFilter === "all"
                    ? "bg-ink text-paper border-ink"
                    : "text-muted-foreground hover:text-ink hover:border-border",
                )}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "font-sans uppercase text-[0.625rem] tracking-wider px-2.5 py-1 transition-colors border border-transparent capitalize",
                    categoryFilter === cat
                      ? "bg-ink text-paper border-ink"
                      : "text-muted-foreground hover:text-ink hover:border-border",
                  )}
                >
                  {cat}
                </button>
              ))}
              <Separator orientation="vertical" className="h-5 mx-1" />
              <button
                type="button"
                onClick={() => setCategoryFilter("archived")}
                className={cn(
                  "font-sans uppercase text-[0.625rem] tracking-wider px-2.5 py-1 transition-colors border border-transparent",
                  visibleArchived
                    ? "bg-ink text-paper border-ink"
                    : "text-muted-foreground hover:text-ink hover:border-border",
                )}
              >
                Archived
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground font-serif">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading messages...</span>
            </div>
          )}

          {!loading && filteredMessages.length === 0 && (
            <div className="py-24 text-center">
              <MessageSquare className="h-10 w-10 mx-auto mb-4 text-muted-foreground/40" />
              <p className="font-serif text-muted-foreground italic">
                No messages yet.
              </p>
            </div>
          )}

            {!loading &&
            filteredMessages.map((msg) => {
              const isExpanded = expandedId === msg._id;

              return (
                <div
                  key={msg._id}
                  className={cn(
                    "border-b border-border last:border-b-0 transition-colors",
                    isExpanded
                      ? "bg-paper-highlight"
                      : msg.read
                        ? "bg-background"
                        : "bg-ink/[0.02]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleExpand(msg._id)}
                    className={cn(
                      "w-full text-left px-4 py-3 flex items-center gap-3",
                      !msg.read && "pr-3",
                    )}
                  >
                    <span className="shrink-0 mt-0.5">
                      {msg.read ? (
                        <Circle className="h-2.5 w-2.5 text-muted-foreground/40" />
                      ) : (
                        <Circle className="h-2.5 w-2.5 fill-ink text-ink" />
                      )}
                    </span>

                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <span
                        className={cn(
                          "font-sans text-sm whitespace-nowrap",
                          !msg.read ? "font-semibold text-ink" : "text-ink",
                        )}
                      >
                        {msg.name}
                      </span>
                      <span className="text-sm text-muted-foreground truncate">
                        {msg.email}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-none font-sans uppercase text-[0.625rem] tracking-wider shrink-0",
                          categoryStyles[msg.category] ||
                            "border-border text-muted-foreground",
                        )}
                      >
                        {msg.category}
                      </Badge>
                    </div>

                    <div className="hidden md:flex flex-1 min-w-0 items-center gap-2">
                      <span className="font-serif text-sm text-ink truncate">
                        {msg.subject || "(no subject)"}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-3 text-right">
                      <span className="label-uppercase text-[0.625rem] whitespace-nowrap">
                        {msg._createdAt ? formatDate(msg._createdAt) : ""}
                      </span>
                      {msg.archived && (
                        <Badge
                          variant="outline"
                          className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-muted-foreground/30 text-muted-foreground"
                        >
                          Archived
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-4 py-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="label-uppercase text-[0.625rem]">
                            From
                          </span>
                          <p className="font-sans text-sm text-ink">
                            {msg.name} &lt;{msg.email}&gt;
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="label-uppercase text-[0.625rem]">
                            Date
                          </span>
                          <p className="font-sans text-sm text-ink">
                            {msg._createdAt
                              ? new Date(msg._createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )
                              : ""}
                          </p>
                        </div>
                      </div>

                      {msg.subject && (
                        <div className="space-y-1">
                          <span className="label-uppercase text-[0.625rem]">
                            Subject
                          </span>
                          <p className="font-heading text-ink font-medium">
                            {msg.subject}
                          </p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="label-uppercase text-[0.625rem]">
                          Message
                        </span>
                        <div className="font-serif text-ink leading-relaxed text-sm whitespace-pre-wrap bg-ink/[0.03] p-4">
                          {msg.message}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <span className="label-uppercase text-[0.625rem]">
                          Internal Notes
                        </span>
                        {msg.internalNotes && !noteInput[msg._id] && (
                          <div className="font-serif text-sm text-muted-foreground italic p-3 bg-ink/[0.02]">
                            {msg.internalNotes}
                          </div>
                        )}
                        <div className="flex gap-2 items-start">
                          <Textarea
                            placeholder="Add an internal note..."
                            value={noteInput[msg._id] ?? ""}
                            onChange={(e) =>
                              setNoteInput((prev) => ({
                                ...prev,
                                [msg._id]: e.target.value,
                              }))
                            }
                            className="rounded-none h-16 text-sm font-serif"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none shrink-0"
                            disabled={!noteInput[msg._id]?.trim() || savingNote === msg._id}
                            onClick={() => handleSaveNote(msg._id)}
                          >
                            {savingNote === msg._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <span className="font-sans uppercase text-[0.625rem] tracking-wider">
                                Save
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex flex-wrap items-center gap-2">
                        {msg.read ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-none gap-1.5"
                            onClick={() => handleMarkUnread(msg._id)}
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                            <span className="font-sans uppercase text-[0.625rem] tracking-wider">
                              Mark Unread
                            </span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-none gap-1.5"
                            onClick={() => handleMarkRead(msg._id)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="font-sans uppercase text-[0.625rem] tracking-wider">
                              Mark Read
                            </span>
                          </Button>
                        )}

                        {msg.archived ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-none gap-1.5"
                            onClick={() => handleUnarchive(msg._id)}
                          >
                            <ArchiveRestore className="h-3.5 w-3.5" />
                            <span className="font-sans uppercase text-[0.625rem] tracking-wider">
                              Unarchive
                            </span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-none gap-1.5"
                            onClick={() => handleArchive(msg._id)}
                          >
                            <Archive className="h-3.5 w-3.5" />
                            <span className="font-sans uppercase text-[0.625rem] tracking-wider">
                              Archive
                            </span>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-none gap-1.5"
                          onClick={() => {
                            window.location.href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Your message to O4A")}`;
                          }}
                        >
                          <Reply className="h-3.5 w-3.5" />
                          <span className="font-sans uppercase text-[0.625rem] tracking-wider">
                            Reply
                          </span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
