import type { AppPost } from '@/types/post';
import { flapTheBirdPost } from './flap-the-bird';
import { flappyGunPost } from './flappygun';
import { saveM8Post } from './savem8';

/**
 * Register every post here. Newest release first.
 * Adding a post: create `./<slug>.tsx` and add it to this array.
 */
const POSTS: AppPost[] = [saveM8Post, flappyGunPost, flapTheBirdPost];

/** All posts, newest release first. */
export function getAllPosts(): AppPost[] {
  return [...POSTS].sort((a, b) => b.meta.releasedOn.localeCompare(a.meta.releasedOn));
}

export function getPostBySlug(slug: string): AppPost | undefined {
  return POSTS.find((post) => post.meta.slug === slug);
}
