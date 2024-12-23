/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Metadata } from "next";
import { BlogJsonLd } from "@/components/BlogJsonLd";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const param = await params;
  const post = await getBlogPostBySlug(param.slug);

  if (!post) {
    return {};
  }

  const ogImage = post.image || "/og-default.jpg";

  return {
    title: `${post.title} | وبلاگ اکسپی`,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://expi.work/blog/${param.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const param = await params;
  const post = await getBlogPostBySlug(param.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BlogJsonLd post={post} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary transition-colors group"
      >
        <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>بازگشت به وبلاگ</span>
      </Link>

      <article>
        {post.image && (
          <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {post.tags.map((tag: any) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-6 prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={post.content} />
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
