"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updatePage } from "@/lib/actions/page-content";
import { createJob, updateJob, deleteJob } from "@/lib/actions/job";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { PageContent, Job } from "@/types";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract", "internship"] as const;

export default function CareersEditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [whyO4AText, setWhyO4AText] = useState("");
  const [value1Title, setValue1Title] = useState("");
  const [value1Desc, setValue1Desc] = useState("");
  const [value2Title, setValue2Title] = useState("");
  const [value2Desc, setValue2Desc] = useState("");
  const [value3Title, setValue3Title] = useState("");
  const [value3Desc, setValue3Desc] = useState("");
  const [value4Title, setValue4Title] = useState("");
  const [value4Desc, setValue4Desc] = useState("");
  const [hiringTitle, setHiringTitle] = useState("");
  const [hiringSteps, setHiringSteps] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobSaving, setJobSaving] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    slug: "",
    department: "",
    location: "",
    employmentType: "full-time" as Job["employmentType"],
    subsidiary: "",
    description: "",
    applyUrl: "",
  });

  useEffect(() => {
    async function load() {
      const doc = await sanityClient.fetch<PageContent>(
        `*[_type == "pageContent" && slug.current == "careers"][0]{_id,title,seo,body}`
      );
      if (doc) {
        setPage(doc);
        setMetaTitle(doc.seo?.metaTitle || "");
        setMetaDescription(doc.seo?.metaDescription || "");
        const b = doc.body as Record<string, unknown> | undefined;
        if (b) {
          setWhyO4AText((b.whyO4AText as string) || "");
          setValue1Title((b.value1Title as string) || "");
          setValue1Desc((b.value1Desc as string) || "");
          setValue2Title((b.value2Title as string) || "");
          setValue2Desc((b.value2Desc as string) || "");
          setValue3Title((b.value3Title as string) || "");
          setValue3Desc((b.value3Desc as string) || "");
          setValue4Title((b.value4Title as string) || "");
          setValue4Desc((b.value4Desc as string) || "");
          setHiringTitle((b.hiringTitle as string) || "");
          setHiringSteps((b.hiringSteps as string) || "");
        }
      }
    }
    async function loadJobs() {
      const data = await sanityClient.fetch<Job[]>(
        `*[_type == "job"]{_id,title,slug,department,location,employmentType,subsidiary,description,applyUrl,active,postedDate} | order(postedDate desc)`
      );
      setJobs(data);
      setJobsLoading(false);
    }
    Promise.all([load(), loadJobs()]).finally(() => setLoading(false));
  }, []);

  function resetJobForm() {
    setJobForm({
      title: "",
      slug: "",
      department: "",
      location: "",
      employmentType: "full-time",
      subsidiary: "",
      description: "",
      applyUrl: "",
    });
    setEditingJobId(null);
    setShowJobForm(false);
  }

  function populateJobForm(job: Job) {
    setJobForm({
      title: job.title,
      slug: job.slug?.current || "",
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      subsidiary: job.subsidiary || "",
      description: job.description,
      applyUrl: job.applyUrl || "",
    });
    setEditingJobId(job._id);
    setShowJobForm(true);
  }

  async function handleSavePage() {
    if (!page) return;
    setSaving(true);
    try {
      await updatePage(page._id, {
        seo: { metaTitle, metaDescription },
        body: {
          whyO4AText,
          value1Title,
          value1Desc,
          value2Title,
          value2Desc,
          value3Title,
          value3Desc,
          value4Title,
          value4Desc,
          hiringTitle,
          hiringSteps,
        },
      });
      toast.success("Careers page updated.");
      router.refresh();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleJobSubmit() {
    if (!jobForm.title.trim() || !jobForm.department.trim() || !jobForm.location.trim()) {
      toast.error("Title, department, and location are required.");
      return;
    }
    setJobSaving(true);
    try {
      const slug = jobForm.slug.trim() || generateSlug(jobForm.title);
      if (editingJobId) {
        await updateJob(editingJobId, {
          title: jobForm.title,
          slug,
          department: jobForm.department,
          location: jobForm.location,
          employmentType: jobForm.employmentType,
          subsidiary: jobForm.subsidiary,
          description: jobForm.description,
          applyUrl: jobForm.applyUrl,
        });
        toast.success("Job updated.");
      } else {
        await createJob({
          title: jobForm.title,
          slug,
          department: jobForm.department,
          location: jobForm.location,
          employmentType: jobForm.employmentType,
          subsidiary: jobForm.subsidiary,
          description: jobForm.description,
          applyUrl: jobForm.applyUrl,
        });
        toast.success("Job posted.");
      }
      const data = await sanityClient.fetch<Job[]>(
        `*[_type == "job"]{_id,title,slug,department,location,employmentType,subsidiary,description,applyUrl,active,postedDate} | order(postedDate desc)`
      );
      setJobs(data);
      resetJobForm();
      router.refresh();
    } catch {
      toast.error("Failed to save job. Please try again.");
    } finally {
      setJobSaving(false);
    }
  }

  async function handleDeleteJob(id: string) {
    if (!confirm("Delete this job listing? This cannot be undone.")) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted.");
      router.refresh();
    } catch {
      toast.error("Failed to delete job.");
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
            Careers Page
          </h1>
          <p className="font-serif text-muted-foreground mt-1">/careers</p>
        </div>
        <Button
          onClick={handleSavePage}
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
              placeholder="Careers | O4A"
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
              placeholder="Explore career opportunities at O4A and our portfolio companies. Join us in building the future."
              rows={2}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Why O4A Section
          </h2>
          <div>
            <label className="label-uppercase block mb-2">Why O4A Text</label>
            <Textarea
              value={whyO4AText}
              onChange={(e) => setWhyO4AText(e.target.value)}
              placeholder="At O4A, you'll work alongside some of the brightest minds across industries..."
              rows={5}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <section className="space-y-6 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Our Values
          </h2>

          <div className="space-y-4 border-l-2 border-hairline pl-4">
            <p className="label-uppercase text-xs text-muted-foreground">
              Value 1
            </p>
            <div>
              <label className="label-uppercase block mb-2">Title</label>
              <Input
                value={value1Title}
                onChange={(e) => setValue1Title(e.target.value)}
                placeholder="Long-Term Thinking"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Description</label>
              <Textarea
                value={value1Desc}
                onChange={(e) => setValue1Desc(e.target.value)}
                placeholder="We make decisions with a multi-decade horizon..."
                rows={3}
                className="rounded-none border-border bg-background font-serif resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 border-l-2 border-hairline pl-4">
            <p className="label-uppercase text-xs text-muted-foreground">
              Value 2
            </p>
            <div>
              <label className="label-uppercase block mb-2">Title</label>
              <Input
                value={value2Title}
                onChange={(e) => setValue2Title(e.target.value)}
                placeholder="Intellectual Rigor"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Description</label>
              <Textarea
                value={value2Desc}
                onChange={(e) => setValue2Desc(e.target.value)}
                placeholder="We challenge assumptions and pursue truth with precision..."
                rows={3}
                className="rounded-none border-border bg-background font-serif resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 border-l-2 border-hairline pl-4">
            <p className="label-uppercase text-xs text-muted-foreground">
              Value 3
            </p>
            <div>
              <label className="label-uppercase block mb-2">Title</label>
              <Input
                value={value3Title}
                onChange={(e) => setValue3Title(e.target.value)}
                placeholder="Operational Excellence"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Description</label>
              <Textarea
                value={value3Desc}
                onChange={(e) => setValue3Desc(e.target.value)}
                placeholder="We hold ourselves to the highest standards of execution..."
                rows={3}
                className="rounded-none border-border bg-background font-serif resize-none"
              />
            </div>
          </div>

          <div className="space-y-4 border-l-2 border-hairline pl-4">
            <p className="label-uppercase text-xs text-muted-foreground">
              Value 4
            </p>
            <div>
              <label className="label-uppercase block mb-2">Title</label>
              <Input
                value={value4Title}
                onChange={(e) => setValue4Title(e.target.value)}
                placeholder="Radical Ownership"
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Description</label>
              <Textarea
                value={value4Desc}
                onChange={(e) => setValue4Desc(e.target.value)}
                placeholder="We take full responsibility for outcomes..."
                rows={3}
                className="rounded-none border-border bg-background font-serif resize-none"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-hairline pt-8">
          <h2 className="font-heading text-xl font-bold text-ink">
            Hiring Process
          </h2>
          <div>
            <label className="label-uppercase block mb-2">
              Hiring Section Title
            </label>
            <Input
              value={hiringTitle}
              onChange={(e) => setHiringTitle(e.target.value)}
              placeholder="Our Hiring Process"
              className="rounded-none border-border bg-background font-serif"
            />
          </div>
          <div>
            <label className="label-uppercase block mb-2">
              Hiring Steps
            </label>
            <p className="text-xs text-muted-foreground font-serif mb-2">
              One step per line. Each line will be displayed as a numbered step
              on the careers page.
            </p>
            <Textarea
              value={hiringSteps}
              onChange={(e) => setHiringSteps(e.target.value)}
              placeholder={`Submit your application\nInitial screening call\nTechnical or case interview\nTeam interview\nOffer & onboarding`}
              rows={8}
              className="rounded-none border-border bg-background font-serif resize-none"
            />
          </div>
        </section>

        <div className="border-t border-hairline pt-6">
          <Button
            onClick={handleSavePage}
            disabled={saving}
            className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-8 py-6 gap-2"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <section className="card-depth-2 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-ink border-b border-hairline pb-2 flex-1">
            Job Listings
          </h2>
          {!showJobForm && (
            <Button
              onClick={() => {
                resetJobForm();
                setShowJobForm(true);
              }}
              className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-4 gap-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Post New Job
            </Button>
          )}
        </div>

        {showJobForm && (
          <div className="border border-border p-6 space-y-4">
            <h3 className="font-heading text-lg font-bold text-ink">
              {editingJobId ? "Edit Job" : "Post a New Job"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-uppercase block mb-2">Title *</label>
                <Input
                  value={jobForm.title}
                  onChange={(e) =>
                    setJobForm((f) => ({
                      ...f,
                      title: e.target.value,
                      slug: editingJobId ? f.slug : generateSlug(e.target.value),
                    }))
                  }
                  placeholder="Senior Software Engineer"
                  className="rounded-none border-border bg-background font-serif"
                />
              </div>
              <div>
                <label className="label-uppercase block mb-2">Slug</label>
                <Input
                  value={jobForm.slug}
                  onChange={(e) =>
                    setJobForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="senior-software-engineer"
                  className="rounded-none border-border bg-background font-serif"
                />
              </div>
              <div>
                <label className="label-uppercase block mb-2">
                  Department *
                </label>
                <Input
                  value={jobForm.department}
                  onChange={(e) =>
                    setJobForm((f) => ({ ...f, department: e.target.value }))
                  }
                  placeholder="Engineering"
                  className="rounded-none border-border bg-background font-serif"
                />
              </div>
              <div>
                <label className="label-uppercase block mb-2">
                  Location *
                </label>
                <Input
                  value={jobForm.location}
                  onChange={(e) =>
                    setJobForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="New York, NY / Remote"
                  className="rounded-none border-border bg-background font-serif"
                />
              </div>
              <div>
                <label className="label-uppercase block mb-2">
                  Employment Type
                </label>
                <select
                  value={jobForm.employmentType}
                  onChange={(e) =>
                    setJobForm((f) => ({
                      ...f,
                      employmentType: e.target.value as Job["employmentType"],
                    }))
                  }
                  className="h-8 w-full min-w-0 rounded-none border border-border bg-background px-2.5 py-1 font-serif text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-uppercase block mb-2">Subsidiary</label>
                <Input
                  value={jobForm.subsidiary}
                  onChange={(e) =>
                    setJobForm((f) => ({ ...f, subsidiary: e.target.value }))
                  }
                  placeholder="O4A portfolio company name"
                  className="rounded-none border-border bg-background font-serif"
                />
              </div>
            </div>
            <div>
              <label className="label-uppercase block mb-2">Description</label>
              <Textarea
                value={jobForm.description}
                onChange={(e) =>
                  setJobForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the role, responsibilities, and qualifications..."
                rows={5}
                className="rounded-none border-border bg-background font-serif resize-none"
              />
            </div>
            <div>
              <label className="label-uppercase block mb-2">Apply URL</label>
              <Input
                value={jobForm.applyUrl}
                onChange={(e) =>
                  setJobForm((f) => ({ ...f, applyUrl: e.target.value }))
                }
                placeholder="https://..."
                className="rounded-none border-border bg-background font-serif"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleJobSubmit}
                disabled={jobSaving}
                className="rounded-none bg-ink text-background hover:bg-ink/90 button-press shadow-paper font-sans uppercase text-xs tracking-widest px-6 gap-2"
              >
                <Save className="h-3.5 w-3.5" />
                {jobSaving
                  ? "Saving..."
                  : editingJobId
                    ? "Update Job"
                    : "Create Job"}
              </Button>
              <Button
                onClick={resetJobForm}
                className="rounded-none border-border bg-background hover:bg-muted font-sans uppercase text-xs tracking-widest px-6 gap-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {jobsLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-full bg-paper-shadow animate-pulse" />
            <div className="h-8 w-full bg-paper-shadow animate-pulse" />
            <div className="h-8 w-full bg-paper-shadow animate-pulse" />
          </div>
        ) : jobs.length === 0 ? (
          <p className="font-serif text-muted-foreground text-sm py-8 text-center border border-border">
            No job listings yet. Click &ldquo;Post New Job&rdquo; to add one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-border">
              <thead>
                <tr>
                  <th className="border-b border-hairline px-4 py-2 text-left text-[0.6875rem] tracking-wider label-uppercase">
                    Title
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left text-[0.6875rem] tracking-wider label-uppercase">
                    Department
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left text-[0.6875rem] tracking-wider label-uppercase">
                    Location
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left text-[0.6875rem] tracking-wider label-uppercase">
                    Type
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-left text-[0.6875rem] tracking-wider label-uppercase">
                    Subsidiary
                  </th>
                  <th className="border-b border-hairline px-4 py-2 text-right text-[0.6875rem] tracking-wider label-uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif text-sm">
                      {job.title}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif text-sm text-muted-foreground">
                      {job.department}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif text-sm text-muted-foreground">
                      {job.location}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-sans text-[0.6875rem] tracking-wider uppercase">
                      {job.employmentType}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-left font-serif text-sm text-muted-foreground">
                      {job.subsidiary || "—"}
                    </td>
                    <td className="border-b border-hairline px-4 py-2 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          onClick={() => populateJobForm(job)}
                          className="rounded-none h-7 px-2 font-sans uppercase text-[0.625rem] tracking-wider border-border bg-background hover:bg-muted"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteJob(job._id)}
                          className="rounded-none h-7 px-2 font-sans uppercase text-[0.625rem] tracking-wider border-border bg-background hover:bg-muted text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
