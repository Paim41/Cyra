import { Landing } from "@/sections/Landing";
import { getLatestRelease } from "@/lib/releases";
export const revalidate = 300;
export default async function Page() {
  return <Landing latestRelease={await getLatestRelease()} />;
}
