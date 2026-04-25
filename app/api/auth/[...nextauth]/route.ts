import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import { GITHUB_OAUTH_SCOPE } from "@/lib/github-oauth-scope"

// Use a classic "OAuth App" (Developer settings → OAuth apps), not a "GitHub App"
// client id/secret. GitHub App user tokens (ghu_…) use app permissions, not OAuth
// scopes, and often show empty x-oauth-scopes — private repo listing breaks.
export const authOptions: NextAuthOptions = {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: GITHUB_OAUTH_SCOPE,
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }