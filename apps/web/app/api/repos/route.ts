import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { fetchUserRepos } from "@/lib/fetch-user-repos";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return Response.json({ repos: [] });
  }
  try {
    const repos = await fetchUserRepos(session.accessToken);
    return Response.json({ repos });
  } catch {
    return Response.json({ error: "Failed to list repositories" }, { status: 500 });
  }
}
