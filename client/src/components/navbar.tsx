import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Menu, X, ChevronDown, Sun, Moon, Search, FlaskConical } from "lucide-react";
import type { Product } from "@shared/schema";

const productLinks = [
  { name: "EtBr Destroyer", href: "/products?category=EtBr+Destroyer" },
  { name: "DNA Clean-Up", href: "/products?category=DNA+Clean-Up" },
  { name: "DNA Extraction", href: "/products?category=DNA+Extraction" },
  { name: "Plasmid Extraction", href: "/products?category=Plasmid+Extraction" },
  { name: "RNase Destroyer", href: "/products?category=RNase+Destroyer" },
  { name: "RNA Extraction", href: "/products?category=RNA+Extraction" },
  { name: "Straight PCR", href: "/products?category=Straight+PCR" },
  { name: "Viral Nucleic Acid", href: "/products?category=Viral+Nucleic+Acid" },
  { name: "Exosome ELISA Kit", href: "/products?category=Exosome+ELISA+Kit" },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products", hasDropdown: true },
  { name: "News", href: "/news" },
  { name: "Ordering Info", href: "/order" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductDropdownOpen(false);
    setMobileProductOpen(false);
    setSearchFocused(false);
  }, [location]);

  const heroPages = ["/"];
  const isHeroPage = heroPages.includes(location);
  const isTransparent = !scrolled && isHeroPage;

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!products || normalizedSearch.length < 3) return [];
    return products
      .filter((p) =>
        [p.name, p.catalogNumber || "", p.category, p.shortDescription]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      )
      .slice(0, 10);
  }, [products, normalizedSearch]);

  const showSearchDropdown = searchFocused && normalizedSearch.length >= 3;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHeroPage
          ? "bg-background/95 backdrop-blur-md border-b"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
          <Link href="/" data-testid="link-home-logo">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className={`text-lg font-bold tracking-tight transition-colors ${
                isTransparent ? "text-white" : "text-foreground"
              }`}>
                INVIROGENS
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div key={link.name} className="relative" ref={dropdownRef}>
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isTransparent
                        ? isActive(link.href) ? "text-white" : "text-white/70 hover:text-white"
                        : isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                    data-testid="button-products-dropdown"
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        productDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute top-full left-0 mt-1 w-56 rounded-md bg-popover border border-popover-border p-1.5 transition-all ${
                      productDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                    }`}
                  >
                    <Link
                      href="/products"
                      className="block px-3 py-2 text-sm font-medium text-foreground rounded-md hover-elevate"
                      data-testid="link-all-products"
                    >
                      All Products
                    </Link>
                    <div className="h-px bg-border my-1" />
                    {productLinks.map((pl) => (
                      <Link
                        key={pl.href}
                        href={pl.href}
                        className="block px-3 py-2 text-sm text-muted-foreground rounded-md hover-elevate hover:text-foreground"
                        data-testid={`link-product-${pl.href.split("/").pop()}`}
                      >
                        {pl.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isTransparent
                      ? isActive(link.href) ? "text-white" : "text-white/70 hover:text-white"
                      : isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:block relative w-full max-w-xs" ref={searchRef}>
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isTransparent ? "text-white/70" : "text-muted-foreground"
              }`}
            />
            <input
              type="text"
              placeholder="At Least 3 Word"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className={`w-full h-10 pl-9 pr-3 text-sm rounded-md border outline-none transition-colors ${
                isTransparent
                  ? "bg-white/10 border-white/30 text-white placeholder:text-white/70"
                  : "bg-background border-border text-foreground placeholder:text-muted-foreground"
              }`}
              data-testid="search-products-input"
            />
            {showSearchDropdown && (
              <div
                className="absolute top-full left-0 mt-1 w-full rounded-md bg-popover border border-popover-border shadow-lg overflow-hidden z-50"
                data-testid="search-products-dropdown"
              >
                {searchResults.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No products found.
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="flex items-center gap-2 px-3 py-2 hover-elevate"
                      data-testid={`search-product-${p.slug}`}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.category}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className={isTransparent ? "text-white hover:text-white" : ""}
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`lg:hidden ${isTransparent ? "text-white hover:text-white" : ""}`}
              onClick={() => {
                setMobileOpen((prev) => {
                  if (prev) {
                    setMobileProductOpen(false);
                  }
                  return !prev;
                });
              }}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-300 border-t bg-background/95 backdrop-blur-md ${
          mobileOpen
            ? "max-h-[calc(100vh-4rem)] opacity-100 overflow-y-auto overscroll-contain"
            : "max-h-0 opacity-0 border-t-0 overflow-hidden"
        }`}
        data-testid="nav-mobile"
      >
        <div className="px-4 py-3 pb-6 space-y-1">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.name}>
                <button
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileProductOpen((prev) => !prev)}
                  data-testid="button-mobile-products"
                >
                  {link.name}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileProductOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`ml-3 space-y-0.5 overflow-hidden transition-all duration-200 ${
                    mobileProductOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <Link
                    href="/products"
                    className="block px-3 py-2 text-sm font-medium text-foreground rounded-md"
                    data-testid="link-mobile-all-products"
                  >
                    All Products
                  </Link>
                  {productLinks.map((pl) => (
                    <Link
                      key={pl.href}
                      href={pl.href}
                      className="block px-3 py-2 text-sm text-muted-foreground rounded-md"
                      data-testid={`link-mobile-${pl.href.split("/").pop()}`}
                    >
                      {pl.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2.5 text-sm font-medium rounded-md ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-mobile-${link.name.toLowerCase()}`}
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
