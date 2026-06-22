const authorizedUser = {
  name: "authorizedUser",
  title: "Authorized User",
  type: "document",
  fields: [
    {
      name: "username",
      title: "GitHub Username",
      type: "string",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("GitHub username is required"),
    },
    {
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Editor", value: "editor" },
        ],
      },
      initialValue: "editor",
      validation: (Rule: { required: () => { error: (msg: string) => boolean } }) =>
        Rule.required().error("Role is required"),
    },
    {
      name: "lastLogin",
      title: "Last Login",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "username",
      subtitle: "role",
    },
  },
  orderings: [
    { title: "Username", name: "usernameAsc", by: [{ field: "username", direction: "asc" }] },
  ],
};

export default authorizedUser;
