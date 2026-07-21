import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = { title: 'Blog' };

export default async function BlogIndexPage() {
  const posts = await getAllPosts(); // getAllPosts() đã tự "use cache" bên trong lib/posts.ts

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold">Blog</h1>
      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="font-display text-xl font-bold group-hover:text-[var(--color-accent)]">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-600">{post.description}</p>
              <time className="mt-2 block text-xs text-gray-400">{post.publishedAt}</time>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
