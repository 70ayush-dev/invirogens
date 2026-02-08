import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
}

export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes("INVIROGENS")
      ? title
      : `${title} | INVIROGENS Biotech`;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", fullTitle);
      }

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", description);
      }
    }

    const canonicalHref = window.location.href;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalHref);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", canonicalHref);

    const ensureMeta = (name: string, value: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", value);
    };

    ensureMeta("robots", "index,follow");
    ensureMeta("twitter:card", "summary_large_image");
    ensureMeta("twitter:title", fullTitle);
    if (description) {
      ensureMeta("twitter:description", description);
    }

    return () => {
      document.title = "INVIROGENS | Molecular Biology Solutions";
    };
  }, [title, description]);
}
