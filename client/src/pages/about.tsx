import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import {
  ArrowRight,
  FlaskConical,
  Globe,
  Shield,
  Award,
  Target,
  Users,
  Microscope,
  CheckCircle2,
} from "lucide-react";

const milestones = [
  { year: "2020", title: "Founded In Taiwan", description: "INVIROGENS Biotech Ltd., founded in Taiwan in 2020, is located in southern Taiwan." },
  { year: "20+", title: "Years Experience", description: "The members of INVIROGENS Biotech have 20-years-experience in the DNA/RNA extraction field." },
  { year: "30+", title: "Countries Covered", description: "INVIROGENS covers 30+ countries with dedicated distributors." },
  { year: "DNA/RNA", title: "Core Focus", description: "INVIROGENS focuses on DNA/RNA extraction kits and EtBr destroyer series." },
];

const values = [
  { icon: Award, title: "Automated Systems", description: "Equipped with automated systems for production of high-quality molecular biology products and clinical chemistry reagents." },
  { icon: Target, title: "Competitive Pricing", description: "Supplying high-quality products at very competitive prices." },
  { icon: Globe, title: "Global Distribution", description: "Distributor development in Japan, Korea, India, Europe, Pakistan, China, and USA." },
  { icon: Users, title: "Highest Goal", description: "Supplying the best products is our highest goal." },
];

const capabilities = [
  "DNA isolation",
  "RNA extraction",
  "Plasmid extraction",
  "GEL / PCR purification",
  "EtBr destroyer series",
  "RNase destroyer",
  "Straight PCR reagents",
  "Viral nucleic acid extraction",
];

export default function About() {
  useSEO({
    title: "About Us",
    description: "INVIROGENS Biotech products are equipped with automated systems for production of high-quality molecular biology products and clinical chemistry reagents.",
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-16 lg:py-24 overflow-hidden" data-testid="section-about-hero">
        <div className="absolute inset-0 -z-10">
          <img
            src="/images/about-team.png"
            alt="INVIROGENS research team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary-foreground border-0">
              <FlaskConical className="w-3 h-3 mr-1.5" />
              About Us
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6" data-testid="text-about-title">
              About INVIROGENS
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              We provide products at very competitive prices.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" data-testid="section-about-mission">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-3">About Us</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                About INVIROGENS Biotech
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                INVIROGENS Biotech Ltd., founded in Taiwan in 2020, is located in southern Taiwan.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                INVIROGENS products are equipped with automated systems for production of high-quality molecular biology products and clinical chemistry reagents. INVIROGENS focuses on DNA/RNA extraction kits and EtBr destroyer series, to provide customers with high-quality products at very competitive prices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capabilities.map((cap) => (
                  <div key={cap} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{cap}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-md overflow-hidden">
                <img
                  src="/images/about-facility.png"
                  alt="INVIROGENS production facility"
                  className="w-full h-80 lg:h-[28rem] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-md -z-10 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card" data-testid="section-about-values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">INVIROGENS</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Laboratories Choose Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              20-years-experience team, automated production, and dedicated global distribution coverage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center" data-testid={`card-value-${value.title.toLowerCase().replace(/\s/g, "-")}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" data-testid="section-about-timeline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Key Facts</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Company Highlights
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-px" />
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-start gap-6 mb-8 last:mb-0 ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className={`hidden sm:block flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <Card data-testid={`card-milestone-${milestone.year}`}>
                      <CardContent className="p-4">
                        <p className="text-sm font-bold text-primary mb-1">{milestone.year}</p>
                        <h3 className="font-semibold text-foreground mb-1">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10 mt-5" />
                  <div className="hidden sm:block flex-1" />
                  <div className="sm:hidden ml-10">
                    <Card data-testid={`card-milestone-mobile-${milestone.year}`}>
                      <CardContent className="p-4">
                        <p className="text-sm font-bold text-primary mb-1">{milestone.year}</p>
                        <h3 className="font-semibold text-foreground mb-1">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-primary relative overflow-hidden" data-testid="section-about-cta">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Microscope className="w-12 h-12 text-primary-foreground/60 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Contact & Distributors
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            INVIROGENS will establish distributors in Japan, Korea, India, Europe, Pakistan, China and USA.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" data-testid="button-about-partner">
              Contact Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
