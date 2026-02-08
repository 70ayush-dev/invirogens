import { Link } from "wouter";
import { FlaskConical, Mail, Phone, MapPin } from "lucide-react";

const productLinks = [
  { name: "DNA Extraction", href: "/products/dna-extraction" },
  { name: "RNA Extraction", href: "/products/rna-extraction" },
  { name: "EtBr Destroyer", href: "/products/etbr-destroyer" },
  { name: "RNase Destroyer", href: "/products/rnase-destroyer" },
  { name: "Straight PCR", href: "/products/straight-pcr" },
  { name: "Viral Nucleic Acid", href: "/products/viral-nucleic-acid" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "News", href: "/news" },
  { name: "Ordering Info", href: "/order" },
  { name: "Contact", href: "/contact" },
  { name: "Products", href: "/products" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                INVIROGENS
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Equipped with automated systems for production of high-quality molecular biology products and clinical chemistry reagents.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Products
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.href.split("/").pop()}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">70ayush@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">TEL: +886-8-736-7106</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">Mobile: +886-982-951-501</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  No. 82, Ln. 11, Tantou Rd., Changzhi Township, Pingtung County 908, R.O.C.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} INVIROGENS Biotech. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Quality molecular biology solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
