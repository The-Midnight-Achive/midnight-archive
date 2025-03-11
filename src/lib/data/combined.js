import { format } from 'date-fns';
import { parse } from 'node-html-parser';
import readingTime from 'reading-time/lib/reading-time.js';
import { render } from 'svelte/server';

// Ensure this runs only on the server
export const posts = Object.entries(import.meta.glob('/posts/**/*.md', { eager: true, query: { 
    // This is a key change - explicitly request the content and metadata
    content: true,
    frontmatter: true 
  } }))
  .map(([filepath, post]) => {
    const preview = parse(render(post.default).body).querySelector('p');

    console.log(filepath.split('/')[2])
    return {
      ...post.metadata,

      subdir: filepath.split('/')[2],

      // Generate the slug from the file path
      slug: filepath
        .replace(/(\/index)?\.md/, '')
        .split('/')
        .pop(),

      // Whether the file is `my-post.md` or `my-post/index.md`
      isIndexFile: filepath.endsWith('/index.md'),

      // Format date as yyyy-MM-dd
      date: post.metadata.date
        ? format(new Date(post.metadata.date), 'yyyy-MM-dd')
        : undefined,

      preview: {
        html: preview ? preview.toString() : '',
        text: preview ? preview.structuredText ?? preview.toString() : ''
      },

      // Get estimated reading time for the post
      readingTime: readingTime(preview?.structuredText ?? '').text
    };
  })
  // make sure posts are only returned if they are a date in the past
  .filter((post) => new Date(post.date) < new Date())
  // Sort by date
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const combinedPosts = posts

export const reviews = posts.filter((post) => post.subdir === 'reviews').map((post, index, allReviews) => ({
    ...post,
    next: allReviews[index - 1] || null,
    previous: allReviews[index + 1] || null
}))
export const poems = posts.filter((post) => post.subdir === 'poems').map((post, index, allPoems) => ({
    ...post,
    next: allPoems[index - 1] || null,
    previous: allPoems[index + 1] || null
}))
export const writings = posts.filter((post) => post.subdir === 'writings').map((post, index, allWritings) => ({
    ...post,
    next: allWritings[index - 1] || null,
    previous: allWritings[index + 1] || null
}))


function addTimezoneOffset(date) {
  const offsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() + offsetInMilliseconds);
}
