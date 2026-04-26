import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchUserRepos } from "@/lib/fetch-user-repos";
import RepositoryListClient from "./repository-list-client";
import type { RepoListItem } from "@/lib/types/repo";

export type Repo = RepoListItem;

export default async function RepositoryListSection() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return null;
  }

  let repos: Repo[] = [];

  try {
    repos = await fetchUserRepos(accessToken);
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
