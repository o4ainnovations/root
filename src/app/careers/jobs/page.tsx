import { sanityFetch, sanityClient } from "@/lib/sanity";
import { JobCard } from "@/components/sections/job-card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema, JsonLd, buildJobPostingSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";
import type { Job, PageContent } from "@/types";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "careers-jobs"][0]{seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "Open Positions",
    description: pageContent?.seo?.metaDescription || "Explore open positions across O4A and its portfolio companies.",
    path: "/careers/jobs",
  });
}

const JOBS_QUERY = `*[_type == "job" && active == true] | order(postedDate desc) {
  _id,
  title,
  slug,
  department,
  location,
  employmentType,
  subsidiary,
  description,
  applyUrl,
  postedDate
}`;

export default async function JobsPage() {
  const jobs = await sanityFetch<Job[]>({
    query: JOBS_QUERY,
    tags: ["job"],
  });

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Careers", href: "/careers" }, { name: "Open Positions", href: "/careers/jobs" }]} />
      {jobs.map((job) => (
        <JsonLd key={job._id} data={buildJobPostingSchema({
          title: job.title,
          description: job.description,
          datePosted: job.postedDate,
          location: job.location,
          employmentType: job.employmentType,
          url: `${COMPANY.url}/careers/jobs/${job.slug.current}`,
        })} id={`job-${job._id}`} />
      ))}
      <div className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            Open Positions
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
            Explore opportunities across O4A and our portfolio companies.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-12">
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <ScrollReveal key={job._id}>
                <JobCard
                  job={{
                    id: job._id,
                    title: job.title,
                    location: job.location,
                    department: job.department,
                    type: job.employmentType,
                    subsidiary: job.subsidiary,
                    url: job.applyUrl || `/careers/jobs/${job.slug.current}`,
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="card-inset p-12 text-center">
            <p className="font-serif text-lg text-muted-foreground">
              No open positions at this time. Follow us for future opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
