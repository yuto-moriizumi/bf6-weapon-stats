import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      // Discord now returns the `iss` parameter (RFC 9207) in the
      // authorization response. Auth.js falls back to "https://authjs.dev"
      // when `issuer` is not set, which makes the callback fail with
      // `unexpected "iss" (issuer) response parameter value`.
      issuer: "https://discord.com",
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.discordId = profile.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId as string;
      }
      return session;
    },
  },
});
