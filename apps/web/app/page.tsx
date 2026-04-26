import HomeContent from "./components/home-content";
import RepositoryListSection from "./components/repository-list-section";

export default function Home() {
  return <HomeContent repositoriesSection={<RepositoryListSection />} />;
}
