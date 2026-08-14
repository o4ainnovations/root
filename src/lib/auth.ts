import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.login = (user as { login?: string }).login;
      return token;
    },
    async session({ session, token }) {
      (session.user as { login?: string }).login = token.login as string;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/",
  },
};

export async function auth() {
  return getServerSession(authOptions);
}
