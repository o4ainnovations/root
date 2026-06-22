const teamMember = {
  name: "teamMember",
  title: "Team Member",
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
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Title is required"),
    },
    { name: "bio", title: "Bio", type: "text" },
    { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Executive", value: "executive" },
          { title: "Board", value: "board" },
        ],
      },
      initialValue: "executive",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Type is required"),
    },
    { name: "order", title: "Order", type: "number", initialValue: 0 },
    { name: "seo", title: "SEO & Social", type: "seo" },
  ],
  orderings: [
    { title: "Type & Order", name: "typeOrderAsc", by: [{ field: "type", direction: "asc" }, { field: "order", direction: "asc" }] },
  ],
};

export default teamMember;
