import { posts } from '$lib/data/combined'

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        posts: posts.slice(0, 5)
      };
}
