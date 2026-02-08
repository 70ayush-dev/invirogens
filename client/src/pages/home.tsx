import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/use-seo";
import {
  ArrowRight,
  FlaskConical,
  Microscope,
  Shield,
  Globe,
  ChevronLeft,
  ChevronRight,
  Dna,
  TestTubes,
  Beaker,
  Atom,
} from "lucide-react";
import type { Product, NewsArticle } from "@shared/schema";

const heroSlides = [
  {
    image: "/images/slider-1.jpg",
    title: "Exosome Quantification",
    subtitle: "",
    cta: "More Detail",
    ctaLink: "/products?category=Exosome%20ELISA%20Kit",
  },
  {
    image: "/images/slider-2.jpg",
    title: "We provide DNA/RNA extaction kit and EtBr destroyer series at very competitive prices.",
    subtitle: "",
    cta: "More Detail",
    ctaLink: "/about",
  },
  {
    image: "/images/slider-3.jpg",
    title: "INVIROGENS EtBr (Ethidium Bromide) Destroyer",
    subtitle: "Laboratory reagent intended for the removal and destruction of Ethidium Bromide contamination.",
    cta: "More Detail",
    ctaLink: "/products?category=EtBr%20Destroyer",
  },
  {
    image: "/images/slider-4.jpg",
    title: "Wide Mouth Bottle PP",
    subtitle: "Autoclavable, translucent and have excellent contact clarity.",
    cta: "More Detail",
    ctaLink: "/news/wide-mouth-bottle-pp",
  },
  {
    image: "/images/about-facility.png",
    title: "INVIROGENS 15 ml Centrifuge Tubes with Snap Cap are designed for your laboratory needs.",
    subtitle: "",
    cta: "More Detail",
    ctaLink: "/news/centrifuge-tubes-snap-cap",
  },
  {
    image: "/images/home-mid.jpg",
    title: "α+ SolutionTM Straight PCR Lysis Reagent",
    subtitle: "",
    cta: "More Detail",
    ctaLink: "/products?category=Straight%20PCR",
  },
  {
    image: "/images/home-banner.jpg",
    title: "Coming Soon",
    subtitle: "",
  },
];

const stats = [
  { value: "30+", label: "Countries", icon: Globe },
  { value: "20+", label: "Years Experience", icon: Shield },
  { value: "9", label: "Product Lines", icon: FlaskConical },
  { value: "100%", label: "Quality Tested", icon: Microscope },
];

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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useSEO({
    title: "INVIROGENS : Leading Brand Of Molecular Biology",
    description: "INVIROGENS products are equipped with automated systems for production of high-quality molecular biology products and clinical chemistry reagents.",
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: news, isLoading: newsLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products?.filter((p) => p.featured) || [];
  const latestNews = news?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      <section className="relative z-40 h-[70vh] min-h-[460px] overflow-hidden" data-testid="section-hero">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary-foreground border-0">
                <FlaskConical className="w-3 h-3 mr-1.5" />
                We Provide Products At Very Competitive Prices
              </Badge>
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ${
                    index === currentSlide
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute"
                  }`}
                >
                  {index === currentSlide && (
                    <>
                      <h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
                        data-testid="text-hero-title"
                      >
                        {slide.title}
                      </h1>
                      <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {slide.cta && slide.ctaLink ? (
                          <Link href={slide.ctaLink}>
                            <Button size="lg" data-testid="button-hero-cta">
                              {slide.cta}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        ) : null}
                        <Link href="/contact">
                          <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 backdrop-blur-sm text-white border-white/20"
                            data-testid="button-hero-contact"
                          >
                            Contact Us
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
              className={`w-2.5 h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 ${
                index === currentSlide ? "bg-white w-8" : "bg-white/40"
              }`}
              data-testid={`button-slide-${index}`}
            />
          ))}
        </div>

        <div className="absolute bottom-6 right-6 z-50 hidden sm:flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/10 backdrop-blur-sm text-white border-white/20"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
            }
            aria-label="Previous slide"
            data-testid="button-slide-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/10 backdrop-blur-sm text-white border-white/20"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
            }
            aria-label="Next slide"
            data-testid="button-slide-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <section className="relative z-30 py-8" data-testid="section-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" data-testid="section-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">
              <FlaskConical className="w-3 h-3 mr-1.5" />
              Our Products
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Molecular Biology Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              High-quality DNA/RNA extraction kits and laboratory reagents at competitive prices for research and clinical applications.
            </p>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-48 rounded-t-md rounded-b-none" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map((product) => {
                const IconComp = categoryIcons[product.category] || FlaskConical;
                return (
                  <Link key={product.id} href={`/products/${product.slug}`}>
                    <Card className="group overflow-visible h-full hover-elevate cursor-pointer" data-testid={`card-product-${product.id}`}>
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-md">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <Badge variant="secondary" className="bg-white/90 text-foreground dark:bg-black/70 dark:text-white border-0 text-xs">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <IconComp className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm mb-1">
                                {product.name}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {product.shortDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="outline" data-testid="button-view-all-products">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card" data-testid="section-about-teaser">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative">
              <div className="rounded-md overflow-hidden">
                <img
                  src="/images/about-facility.png"
                  alt="INVIROGENS facility"
                  className="w-full h-80 lg:h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-md -z-10 hidden lg:block" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-3">
                About INVIROGENS
              </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                About INVIROGENS
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                INVIROGENS Biotech products are equipped with automated systems for production of high-quality molecular biology products and clinical chemistry reagents.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                INVIROGENS Biotech will establish distributors in Japan, Korea, India, Europe, Pakistan, China and USA, and covers 30+ countries with dedicated distributors.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/about">
                  <Button data-testid="button-about-learn-more">
                    More Detail
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" data-testid="button-about-contact">
                    Contact & Distributors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" data-testid="section-news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="secondary" className="mb-3">
                Latest Updates
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                News
              </h2>
            </div>
            <Link href="/news">
              <Button variant="outline" data-testid="button-view-all-news">
                View All News
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-48 rounded-t-md rounded-b-none" />
                    <div className="p-5 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {latestNews.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <Card className="group overflow-visible h-full hover-elevate cursor-pointer" data-testid={`card-news-${article.id}`}>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-md">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs text-muted-foreground mb-2">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-primary relative overflow-hidden" data-testid="section-cta">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Contact & Distributors
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            If you have interested in our products or any suggestion, please contact us.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" variant="secondary" data-testid="button-cta-contact">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-primary-foreground border-white/20"
                data-testid="button-cta-products"
              >
                Product
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
