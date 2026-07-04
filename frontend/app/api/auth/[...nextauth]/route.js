import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getApiUrl } from "@/lib/apiUrl";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const res = await fetch(getApiUrl("users/google"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
            }),
          });
          const data = await res.json();
          if (res.ok && data.data?.token) {
            user.backendToken = data.data.token;
            user.isAdmin = data.data.user.isAdmin;
            return true;
          }
          console.error("Google sign-in backend rejected:", res.status, data);
          return false;
        } catch (error) {
          console.error("Error connecting to backend during Google login:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.isAdmin = token.isAdmin;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
