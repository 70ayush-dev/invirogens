import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/use-seo";
import {
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  Dna,
  TestTubes,
  Beaker,
  Atom,
  Shield,
  Mail,
  CheckCircle2,
  Package,
  ListOrdered,
  Settings2,
  AlertTriangle,
} from "lucide-react";
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

const tabs = [
  { key: "component", label: "Component", icon: Package },
  { key: "procedure", label: "Brief Procedure", icon: ListOrdered },
  { key: "specification", label: "Specification", icon: Settings2 },
  { key: "troubleshooting", label: "Troubleshooting", icon: AlertTriangle },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function renderMarkdownTable(text: string) {
  const lines = text.split("\n").filter(Boolean);
  const tableLines = lines.filter((l) => l.startsWith("|"));
  if (tableLines.length < 2) return null;

  const headerRow = tableLines[0];
  const dataRows = tableLines.slice(2);

  const parseRow = (row: string) =>
    row
      .split("|")
      .filter((_, i, arr) => i > 0 && i < arr.length - 1)
      .map((cell) => cell.trim());

  const headers = parseRow(headerRow);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-3 py-2 font-medium text-foreground border border-border"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, i) => {
            const cells = parseRow(row);
            return (
              <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/30"}>
                {cells.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-muted-foreground border border-border">
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function renderSimpleComponentsTable(text: string) {
  const rawLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (rawLines.length < 2) return null;

  // Merge parenthetical continuation lines into previous value rows.
  const lines: string[] = [];
  for (const line of rawLines) {
    if (line.startsWith("(") && lines.length > 0) {
      lines[lines.length - 1] = `${lines[lines.length - 1]} ${line}`;
      continue;
    }
    lines.push(line);
  }

  const rows: Array<{ item: string; value: string }> = [];
  const codeLike = (s: string) => /^[A-Z]{2,}[A-Z0-9\- ]*\d+$/i.test(s);
  const headingLike = (s: string) =>
    /^(components?|applications?|specification|specifications|storage|package|size)$/i.test(s);

  for (let i = 0; i < lines.length; ) {
    const current = lines[i];
    const next = lines[i + 1];

    // Case A: catalog number followed by heading-style rows (e.g., APDIY100 + Components/Applications...)
    if (codeLike(current) && next && headingLike(next)) {
      rows.push({ item: "Catalog No.", value: current });
      i += 1;
      continue;
    }

    // Case B: SKU-code table rows with optional continuation lines.
    if (codeLike(current)) {
      const valueParts: string[] = [];
      let j = i + 1;
      while (j < lines.length && !codeLike(lines[j])) {
        valueParts.push(lines[j]);
        j += 1;
      }
      rows.push({ item: current, value: valueParts.join(" ").trim() });
      i = j;
      continue;
    }

    // Case C: default key/value pair layout.
    rows.push({ item: current, value: next ?? "" });
    i += 2;
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left px-3 py-2 font-medium text-foreground border border-border w-1/3">
              Item
            </th>
            <th className="text-left px-3 py-2 font-medium text-foreground border border-border">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.item}-${i}`} className={i % 2 === 0 ? "" : "bg-muted/30"}>
              <td className="px-3 py-2 text-foreground border border-border">{row.item}</td>
              <td className="px-3 py-2 text-muted-foreground border border-border">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabContent({
  content,
  tabKey,
}: {
  content: string | null | undefined;
  tabKey: TabKey;
}) {
  if (!content) {
    return (
      <p className="text-muted-foreground text-sm italic">
        Information not available for this product.
      </p>
    );
  }

  const hasTable = content.includes("|---|");

  if (hasTable) {
    const lines = content.split("\n");
    const tableStartIdx = lines.findIndex((l) => l.startsWith("|"));
    const preText = tableStartIdx > 0 ? lines.slice(0, tableStartIdx).join("\n") : "";
    const tableText = lines
      .slice(tableStartIdx)
      .filter((l) => l.startsWith("|"))
      .join("\n");
    const afterTableIdx = lines.findIndex(
      (l, i) => i > tableStartIdx && !l.startsWith("|") && l.trim() !== ""
    );
    const afterText =
      afterTableIdx > 0 ? lines.slice(afterTableIdx).join("\n") : "";

    return (
      <div className="space-y-4">
        {preText && (
          <div className="space-y-2">
            {preText
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {line}
                </p>
              ))}
          </div>
        )}
        {renderMarkdownTable(tableText)}
        {afterText && (
          <div className="space-y-2">
            {afterText
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {line}
                </p>
              ))}
          </div>
        )}
      </div>
    );
  }

  if (tabKey === "component") {
    const simpleTable = renderSimpleComponentsTable(content);
    if (simpleTable) return simpleTable;
  }

  const paragraphs = content.split("\n").filter(Boolean);
  return (
    <div className="space-y-2">
      {paragraphs.map((para, i) => {
        const isBullet = para.startsWith("- ");
        const isNumbered = /^\d+\./.test(para);
        if (isBullet) {
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="text-primary mt-1.5 text-xs">&#8226;</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {para.slice(2)}
              </p>
            </div>
          );
        }
        if (isNumbered) {
          const match = para.match(/^(\d+)\.\s*(.*)/);
          return (
            <div key={i} className="flex items-start gap-2 pl-2">
              <span className="text-primary font-medium text-sm mt-0 min-w-[1.5rem]">
                {match?.[1]}.
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {match?.[2]}
              </p>
            </div>
          );
        }
        const isHeader =
          para.endsWith(":") || para.startsWith("For ") || para.startsWith("Important");
        return (
          <p
            key={i}
            className={`text-sm leading-relaxed ${
              isHeader ? "font-medium text-foreground mt-3" : "text-muted-foreground"
            }`}
          >
            {para}
          </p>
        );
      })}
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("component");

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", params.slug],
    enabled: !!params.slug,
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useSEO({
    title: product ? `${product.name}` : "Product Details",
    description:
      product
        ? `${product.name} - technical details, components, procedures and specifications.`
        : "INVIROGENS product details and specifications.",
  });

  const relatedProducts =
    allProducts
      ?.filter((p) => p.category === product?.category && p.id !== product?.id)
      ?.slice(0, 3) || [];

  const getTabContent = (tab: TabKey) => {
    if (!product) return null;
    switch (tab) {
      case "component":
        return product.components;
      case "procedure":
        return product.procedure;
      case "specification":
        return product.specifications;
      case "troubleshooting":
        return product.troubleshooting;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <Skeleton className="h-96 rounded-md" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <FlaskConical className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button data-testid="button-back-products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComp = categoryIcons[product.category] || FlaskConical;

  return (
    <div className="min-h-screen pt-20" data-testid="page-product-detail">
      <section className="py-6 border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
              data-testid="link-breadcrumb-home"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
              data-testid="link-breadcrumb-products"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="relative rounded-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 lg:h-[28rem] object-cover"
                data-testid="img-product"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-foreground dark:bg-black/70 dark:text-white border-0"
                >
                  {product.category}
                </Badge>
                {product.featured && <Badge className="border-0">Featured</Badge>}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <IconComp className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="outline">{product.category}</Badge>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold text-foreground mb-2"
                data-testid="text-product-name"
              >
                {product.name}
              </h1>

              {product.catalogNumber && (
                <p
                  className="text-sm text-primary font-medium mb-4"
                  data-testid="text-catalog-number"
                >
                  Cat. No: {product.catalogNumber}
                </p>
              )}

              {product.storageInfo && (
                <Card className="mb-6 bg-card/70">
                  <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      Storage & Shipping
                    </p>
                    <div className="space-y-1">
                      {product.storageInfo
                        .split("\n")
                        .filter(Boolean)
                        .map((line, index) => (
                          <p key={index} className="text-sm text-foreground">
                            {line}
                          </p>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/contact">
                  <Button data-testid="button-product-inquiry">
                    <Mail className="w-4 h-4 mr-2" />
                    Request Quote
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" data-testid="button-product-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-card border-t" data-testid="section-product-tabs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap border-b border-border mb-8 gap-0">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                  }`}
                  data-testid={`tab-${tab.key}`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.key === "component"
                      ? "Comp."
                      : tab.key === "procedure"
                      ? "Proc."
                      : tab.key === "specification"
                      ? "Spec."
                      : "Trouble."}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="min-h-[200px]" data-testid={`tab-content-${activeTab}`}>
            <TabContent content={getTabContent(activeTab)} tabKey={activeTab} />
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section
          className="py-12 lg:py-16 border-t"
          data-testid="section-related-products"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {relatedProducts.map((rp) => {
                const RPIcon = categoryIcons[rp.category] || FlaskConical;
                return (
                  <Link key={rp.id} href={`/products/${rp.slug}`}>
                    <Card
                      className="group overflow-visible h-full hover-elevate cursor-pointer"
                      data-testid={`card-related-${rp.id}`}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-md">
                          <img
                            src={rp.image}
                            alt={rp.name}
                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                              <RPIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm mb-1">
                                {rp.name}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
