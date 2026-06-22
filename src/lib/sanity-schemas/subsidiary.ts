const subsidiary = {
  name: "subsidiary",
  title: "Subsidiary",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Name is required"),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Slug is required"),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Description is required"),
    },
    {
      name: "industry",
      title: "Industry",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Industry is required"),
    },
    { name: "url", title: "Website URL", type: "url" },
    { name: "logo", title: "Logo", type: "image" },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Coming Soon", value: "coming-soon" },
          { title: "Past", value: "past" },
        ],
      },
      initialValue: "active",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Status is required"),
    },
    { name: "order", title: "Order", type: "number", initialValue: 0 },
    { name: "seo", title: "SEO & Social", type: "seo" },
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
};

export default subsidiary;
