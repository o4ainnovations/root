const download = {
  name: "download",
  title: "Download",
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
      name: "file",
      title: "File",
      type: "file",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("File is required"),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Investor Relations", value: "investor" },
          { title: "ESG & Sustainability", value: "esg" },
          { title: "Governance", value: "governance" },
        ],
      },
      initialValue: "investor",
    },
    { name: "publishDate", title: "Publish Date", type: "datetime", initialValue: new Date().toISOString() },
    { name: "seo", title: "SEO & Social", type: "seo" },
  ],
  orderings: [{ title: "Date", name: "dateDesc", by: [{ field: "publishDate", direction: "desc" }] }],
};

export default download;
