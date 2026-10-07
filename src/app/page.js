import products from "@/data/products.json";
import { CATEGORIES } from "@/data/site";
import HomeHero from "@/components/home/HomeHero";
import AudienceSplit from "@/components/home/AudienceSplit";
import CategorySlider from "@/components/home/CategorySlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyHimal from "@/components/home/WhyHimal";
import Journey from "@/components/home/Journey";
import Testimonials from "@/components/home/Testimonials";
import FinalCta from "@/components/home/FinalCta";

export default function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length])
  );

  return (
    <>
      <HomeHero />
      <AudienceSplit />
      <CategorySlider counts={counts} />
      <FeaturedProducts products={featured} />
      <WhyHimal />
      <Journey />
      <Testimonials />
      <FinalCta />
    </>
  );
}
