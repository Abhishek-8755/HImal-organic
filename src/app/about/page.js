import AboutHero from "@/components/about/AboutHero";
import MissionVision from "@/components/about/MissionVision";
import PromiseCards from "@/components/about/PromiseCards";
import Milestones from "@/components/about/Milestones";
import TeamCards from "@/components/about/TeamCards";
import AboutCta from "@/components/about/AboutCta";

export const metadata = {
  title: "About Us",
  description:
    "The story behind Himal Organic: hill farmers, living soil, native seeds and a simple promise of pure food from the Himalayas.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <PromiseCards />
      <Milestones />
      <TeamCards />
      <AboutCta />
    </>
  );
}
