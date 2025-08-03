import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createServerComponentClient } from "@/lib/supabase"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session?.user?.email) {
        // Get user ID from Supabase
        const supabase = createServerComponentClient()
        const { data: profile } = await supabase.from("profiles").select("id").eq("email", session.user.email).single()

        if (profile) {
          session.user.id = profile.id
        }
      }
      return session
    },
    async jwt({ token, account }: any) {
      return token
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
