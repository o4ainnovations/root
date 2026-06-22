const pageContent = {
  name: "pageContent",
  title: "Page Content",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Title is required"),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Slug is required"),
    },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }] },
    { name: "lastUpdated", title: "Last Updated", type: "datetime", initialValue: new Date().toISOString() },
    { name: "seo", title: "SEO & Social", type: "seo" },
  ],
};

export default pageContent;
