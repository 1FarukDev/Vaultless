export type RepoListItem = {
  id: number;
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  updated_at: string | null;
};
