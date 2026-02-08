import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/use-seo";
import { ArrowLeft, Newspaper, ArrowRight, Calendar } from "lucide-react";
import type { NewsArticle } from "@shared/schema";

export default function NewsDetail() {
  const params = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery<NewsArticle>({
    queryKey: [`/api/news/${params.slug}`],
    enabled: !!params.slug,
  });

  const { data: allNews } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news"],
  });

  useSEO({
    title: article ? article.title : "News",
    description: article?.excerpt || "The INVIROGENS provide related news.",
  });

  const otherArticles = allNews?.filter((a) => a.slug !== params.slug)?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-6 w-32 mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-40 mb-8" />
          <Skeleton className="h-80 rounded-md mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/news">
            <Button data-testid="button-back-news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" data-testid="page-news-detail">
      <section className="py-6 border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-foreground transition-colors">News</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{article.title}</span>
          </div>
        </div>
      </section>

      <article className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <time className="text-sm text-muted-foreground">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-article-title">
              {article.title}
            </h1>
            <p className="text-lg text-muted-foreground">{article.excerpt}</p>
          </div>

          <div className="rounded-md overflow-hidden mb-10">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              data-testid="img-article"
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {article.content.split("\n").filter(Boolean).map((paragraph, i) => (
              <p key={i} className="text-foreground/80 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="border-t mt-10 pt-8">
            <Link href="/news">
              <Button variant="outline" data-testid="button-back-news">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All News
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {otherArticles.length > 0 && (
        <section className="py-12 lg:py-16 bg-card border-t" data-testid="section-more-news">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">More News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {otherArticles.map((a) => (
                <Link key={a.id} href={`/news/${a.slug}`}>
                  <Card className="group overflow-visible h-full hover-elevate cursor-pointer" data-testid={`card-more-news-${a.id}`}>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-md">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1.5">
                          {a.publishedAt
                            ? new Date(a.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                        <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                          {a.title}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
