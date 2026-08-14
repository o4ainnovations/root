"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { sanityFetch } from "@/lib/sanity";
import {
  addAuthorizedUser,
  removeAuthorizedUser,
  updateAuthorizedUserRole,
} from "@/lib/actions/access";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Trash2 } from "lucide-react";
import type { AuthorizedUser } from "@/types";

export default function AccessPageClient() {
  const [users, setUsers] = useState<AuthorizedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");

  const mounted = useRef(false);

  const fetchUsers = useCallback(async () => {
    const data = await sanityFetch<AuthorizedUser[]>({
      query: `*[_type == "authorizedUser"] | order(username asc)`,
      tags: ["authorizedUser"],
    });
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchUsers();
    }
  }, [fetchUsers]);

  async function handleAdd() {
    if (!username.trim()) return;
    try {
      await addAuthorizedUser(username.trim(), role);
      toast.success(`Added ${username.trim()} as ${role}`);
      setUsername("");
      fetchUsers();
    } catch {
      toast.error("Failed to add user");
    }
  }

  async function handleRemove(id: string, name: string) {
    if (!window.confirm(`Remove ${name} from authorized users?`)) return;
    try {
      await removeAuthorizedUser(id);
      toast.success(`Removed ${name}`);
      fetchUsers();
    } catch {
      toast.error("Failed to remove user");
    }
  }

  async function handleRoleChange(id: string, newRole: "admin" | "editor") {
    try {
      await updateAuthorizedUserRole(id, newRole);
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Access Control
        </h1>
        <p className="font-serif text-muted-foreground mt-2">
          Manage who can access the admin panel.
        </p>
      </div>

      <Card className="card-depth-1 rounded-none border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-ink mt-0.5 shrink-0" />
            <div>
              <p className="font-heading font-bold text-ink">
                Authorized Users Only
              </p>
              <p className="text-sm text-muted-foreground font-serif mt-1">
                Only GitHub users listed below can access the admin panel.
                Administrators have full access; editors can manage content but
                cannot modify access controls or site settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-depth-1 rounded-none border-border">
        <CardContent className="p-6">
          <h2 className="font-heading text-lg font-bold text-ink mb-4">
            Add User
          </h2>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="label-uppercase block mb-1.5">
                GitHub Username
              </label>
              <Input
                className="rounded-none"
                placeholder="e.g. octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>
            <div>
              <label className="label-uppercase block mb-1.5">Role</label>
              <select
                className="h-8 rounded-none border border-input bg-transparent px-2.5 py-1 text-sm text-ink"
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "editor")}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <Button className="rounded-none" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-depth-1 rounded-none border-border">
        <CardContent className="p-6">
          <h2 className="font-heading text-lg font-bold text-ink mb-4">
            Authorized Users
          </h2>
          {loading ? (
            <p className="text-muted-foreground font-serif italic py-4">
              Loading...
            </p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground font-serif italic py-4">
              No authorized users configured. Add the first user.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="label-uppercase text-left py-2 px-3 font-normal">
                      Username
                    </th>
                    <th className="label-uppercase text-left py-2 px-3 font-normal">
                      Role
                    </th>
                    <th className="label-uppercase text-left py-2 px-3 font-normal">
                      Status
                    </th>
                    <th className="label-uppercase text-right py-2 px-3 font-normal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-hairline hover:bg-paper-highlight transition-colors"
                    >
                      <td className="py-3 px-3 font-medium text-ink">
                        {user.username}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className="rounded-none"
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role === "admin" ? "Admin" : "Editor"}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        {user.active ? (
                          <span className="text-xs text-ink">Active</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            className="h-8 rounded-none border border-input bg-transparent px-2 py-1 text-sm text-ink"
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                e.target.value as "admin" | "editor"
                              )
                            }
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                          </select>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-none"
                            onClick={() =>
                              handleRemove(user._id, user.username)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
