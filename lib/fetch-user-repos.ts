import { Octokit } from "@octokit/rest";
import type { RepoListItem } from "@/lib/types/repo";

export async function fetchUserRepos(accessToken: string): Promise<RepoListItem[]> {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility: "all",
    affiliation: "owner,collaborator,organization_member",
    per_page: 100,
  });
  return data.map((repo) => ({
    id: repo.id,
    owner: repo.owner?.login ?? "",
    name: repo.name,
    description: repo.description,
    language: repo.language,
    private: repo.private,
    updated_at: repo.updated_at,
  }));
}
