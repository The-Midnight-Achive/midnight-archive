import { poems } from '$lib/data/combined'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const { slug } = params

  console.log(poems)

  // get post with metadata
  const post = poems.find((post) => slug === post.slug)

  if (!post) {
    throw error(404, 'Post not found')
  }

  if (new Date(post.date) > new Date()) {
    throw error(404, 'Post not found')
  }

  return {
    post
  }
}
