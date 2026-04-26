import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import VaultlessWizard from "../components/vaultless-wizard";
import { fetchUserRepos } from "@/lib/fetch-user-repos";
import type { RepoListItem } from "@/lib/types/repo";

export default async function WorkflowPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  let repos: RepoListItem[] = [];
  if (token) {
    try {
      repos = await fetchUserRepos(token);
    } catch {
      repos = [];
    }
  }

  return (
    <VaultlessWizard initialRepos={repos} isAuthenticated={!!session} />
  );
}
