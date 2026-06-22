import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/animations/fade-in";
import { MapPin, Briefcase, Building2, Clock, ExternalLink } from "lucide-react";
import { JsonLd, buildJobPostingSchema, BreadcrumbSchema, buildMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";
import type { Job } from "@/types";

const JOB_QUERY = `*[_type == "job" && slug.current == $slug && active == true][0] {
  _id,
  title,
  slug,
  department,
  location,
  employmentType,
  subsidiary,
  description,
  applyUrl,
  seo,
  postedDate
}`;

const typeLabels: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await sanityClient.fetch<Job | null>(JOB_QUERY, { slug });
  if (!job) return { title: "Not Found" };

  return buildMetadata({
    title: job.seo?.metaTitle || job.title,
    description:
      job.seo?.metaDescription ||
      `${job.title} at ${job.subsidiary || "O4A"} — ${job.location}`,
    path: `/careers/jobs/${job.slug.current}`,
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await sanityClient.fetch<Job | null>(JOB_QUERY, { slug });

  if (!job) notFound();

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Careers", href: "/careers" }, { name: "Open Positions", href: "/careers/jobs" }, { name: job.title, href: "" }]} />
      <JsonLd data={buildJobPostingSchema({
        title: job.title,
        description: job.description,
        datePosted: job.postedDate,
        location: job.location,
        employmentType: job.employmentType,
        url: `${COMPANY.url}/careers/jobs/${slug}`,
      })} id="job-posting" />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <div className="page-header">
          <p className="label-uppercase mb-3">
            {job.subsidiary || "O4A"} — {job.department}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink mb-6">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-4">
            <span className="label-uppercase inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="label-uppercase inline-flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              {typeLabels[job.employmentType] || job.employmentType}
            </span>
            {job.subsidiary && (
              <span className="label-uppercase inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {job.subsidiary}
              </span>
            )}
            <span className="label-uppercase inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {new Date(job.postedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </FadeIn>

      <Separator className="my-8 bg-hairline" />

      <FadeIn delay={0.1}>
        <div className="font-serif text-lg leading-relaxed whitespace-pre-line">
          {job.description}
        </div>
      </FadeIn>

      {job.applyUrl && (
        <FadeIn delay={0.2}>
          <div className="mt-10">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link bg-ink text-background px-8 py-4 inline-flex items-center gap-2 text-sm"
            >
              Apply for this position
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </FadeIn>
      )}
    </div>
    </>
  );
}
