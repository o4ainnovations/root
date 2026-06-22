const pressRelease = {
  name: "pressRelease",
  title: "Press Release",
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
    { name: "date", title: "Date", type: "datetime", initialValue: new Date().toISOString() },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }] },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Corporate", value: "corporate" },
          { title: "Product", value: "product" },
          { title: "Partnership", value: "partnership" },
        ],
      },
      initialValue: "corporate",
    },
    { name: "pdf", title: "PDF", type: "file" },
    { name: "featured", title: "Featured", type: "boolean", initialValue: false },
    { name: "seo", title: "SEO & Social", type: "seo" },
  ],
  orderings: [{ title: "Date", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
};

export default pressRelease;
