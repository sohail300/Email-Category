import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.id_token = token.id_token;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 86400,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};
