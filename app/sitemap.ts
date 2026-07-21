import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${appUrl}/pricing`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${appUrl}/blog`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${appUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes];
}
