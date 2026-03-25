import Hero from "@/components/landing/Hero";
import ProductGrid from "@/components/landing/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <ProductGrid />
    </main>
  );
}
