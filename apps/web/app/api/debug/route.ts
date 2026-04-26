import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: "Not signed in" })
  }

  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })

  const scopes = response.headers.get("x-oauth-scopes")
  const acceptedScopes = response.headers.get("x-accepted-oauth-scopes")

  // Never return the raw token — it is a secret. If you logged a token in chat,
  // revoke it in GitHub settings immediately.
  return Response.json({
    ok: response.ok,
    status: response.status,
    scopesFromHeader: scopes,
    acceptedScopesFromHeader: acceptedScopes,
    hint:
      "If scopes are empty and your token starts with ghu_, you are likely using GitHub App credentials instead of a classic OAuth App. Create an OAuth App and set GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET to that app's values, then sign out and sign in again.",
  })
}