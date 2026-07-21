import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

// Pre-render sẵn toàn bộ post tại build time (SSG) — vì tập bài viết có sẵn,
// không phụ thuộc request. Post mới thêm sau vẫn render on-demand nhờ Cache Components.
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: 'article' },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // JSON-LD giúp Google hiển thị rich snippet cho bài viết
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
  };

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <time className="text-xs text-gray-400">{post.publishedAt}</time>
      <h1 className="mt-2 font-display text-3xl font-bold">{post.title}</h1>
      <p className="mt-6 leading-relaxed text-gray-700">{post.content}</p>
    </article>
  );
}
