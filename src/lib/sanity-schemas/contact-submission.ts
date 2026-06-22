const contactSubmission = {
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Name is required"),
    },
    {
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Email is required"),
    },
    {
      name: "category",
      title: "Inquiry Category",
      type: "string",
      options: {
        list: [
          { title: "General Inquiry", value: "general" },
          { title: "Media / Press", value: "media" },
          { title: "Investor Relations", value: "investor" },
          { title: "Partnership Inquiry", value: "partnership" },
          { title: "Legal / Compliance", value: "legal" },
        ],
      },
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Category is required"),
    },
    {
      name: "subject",
      title: "Subject",
      type: "string",
    },
    {
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Message is required"),
    },
    {
      name: "attachments",
      title: "Attachments",
      type: "array",
      of: [{ type: "file" }],
    },
    {
      name: "read",
      title: "Mark as Read",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "archived",
      title: "Archived",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      description: "Admin-only notes. Not visible to the submitter.",
    },
  ],
  orderings: [
    { title: "Newest", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
    { title: "Unread First", name: "unreadFirst", by: [{ field: "read", direction: "asc" }] },
  ],
};

export default contactSubmission;
