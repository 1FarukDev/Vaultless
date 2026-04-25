import { getServerSession } from "next-auth";
import { Octokit } from "@octokit/rest";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RepositoryListClient from "./repository-list-client";

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  updated_at: string | null;
};

export default async function RepositoryListSection() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return null;
  }

  const octokit = new Octokit({ auth: accessToken });
  let repos: Repo[] = [];

  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      visibility: "all",
      affiliation: "owner,collaborator,organization_member",
      per_page: 100,
    });
    repos = data;
  } catch {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Your repositories
        </h2>
        <p className="text-sm text-white/60">
          Could not load repositories right now.
        </p>
      </section>
    );
  }

  return <RepositoryListClient repos={repos} />;
}
