import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/use-seo";
import {
  FlaskConical,
  ArrowRight,
  Dna,
  TestTubes,
  Beaker,
  Atom,
  Shield,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import type { Product } from "@shared/schema";

const categoryIcons: Record<string, typeof FlaskConical> = {
  "EtBr Destroyer": Beaker,
  "DNA Clean-Up": FlaskConical,
  "DNA Extraction": Dna,
  "Plasmid Extraction": Dna,
  "RNase Destroyer": Beaker,
  "RNA Extraction": TestTubes,
  "Straight PCR": Atom,
  "Viral Nucleic Acid": Shield,
  "Exosome ELISA Kit": FlaskConical,
};

const categories = ["All", "EtBr Destroyer", "DNA Clean-Up", "DNA Extraction", "Plasmid Extraction", "RNase Destroyer", "RNA Extraction", "Straight PCR", "Viral Nucleic Acid", "Exosome ELISA Kit"];

export default function Products() {
  const searchString = useSearch();
  const urlCategoryRaw = new URLSearchParams(searchString).get("category");
  const urlCategory = urlCategoryRaw && categories.includes(urlCategoryRaw) ? urlCategoryRaw : "All";
  const [activeCategory, setActiveCategory] = useState(urlCategory);

  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  useSEO({
    title: "Products",
    description:
      "INVIROGENS focus on DNA/RNA extraction kit and EtBr destroyer series, to provide customers with high-quality products at very competitive prices.",
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((p) =>
    activeCategory === "All" ? true : p.category === activeCategory
  ) || [];

  return (
    <div className="min-h-screen pt-20">
      <section className="py-12 lg:py-16 bg-card border-b" data-testid="section-products-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-3">
            <FlaskConical className="w-3 h-3 mr-1.5" />
            Product Catalog
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-products-title">
            Our Products
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore our comprehensive range of molecular biology products designed for efficiency, reliability, and competitive pricing.
          </p>
        </div>
      </section>

      <section className="py-8 border-b sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur-md" data-testid="section-products-filter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                data-testid={`button-filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16" data-testid="section-products-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-56 rounded-t-md rounded-b-none" />
                    <div className="p-5 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                No products match the selected category. Try a different filter.
              </p>
              <Button variant="outline" onClick={() => setActiveCategory("All")} data-testid="button-reset-filter">
                Show All Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredProducts.map((product) => {
                const IconComp = categoryIcons[product.category] || FlaskConical;
                return (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <Card className="group overflow-visible h-full hover-elevate cursor-pointer" data-testid={`card-product-${product.id}`}>
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-md">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <Badge variant="secondary" className="bg-white/90 text-foreground dark:bg-black/70 dark:text-white border-0 text-xs">
                              {product.category}
                            </Badge>
                            {product.featured && (
                              <Badge className="text-xs border-0">Featured</Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <IconComp className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.shortDescription}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center text-primary text-sm font-medium">
                            View Details
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
