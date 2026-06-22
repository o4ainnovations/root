const job = {
  name: "job",
  title: "Job Listing",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Job title is required"),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Slug is required"),
    },
    {
      name: "department",
      title: "Department",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Department is required"),
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Location is required"),
    },
    {
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Contract", value: "contract" },
          { title: "Internship", value: "internship" },
        ],
      },
      initialValue: "full-time",
    },
    {
      name: "subsidiary",
      title: "Subsidiary / Company",
      type: "string",
      description: "Which O4A company this role is for.",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Description is required"),
    },
    {
      name: "applyUrl",
      title: "Apply URL",
      type: "url",
      description: "Link to the application form or ATS.",
    },
    {
      name: "seo",
      title: "SEO & Social",
      type: "seo",
    },
    {
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Toggle off to hide this job from the public listings.",
    },
    {
      name: "postedDate",
      title: "Posted Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
  orderings: [
    { title: "Posted Date", name: "dateDesc", by: [{ field: "postedDate", direction: "desc" }] },
  ],
};

export default job;
