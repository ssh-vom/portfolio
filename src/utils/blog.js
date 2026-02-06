import fm from 'front-matter';

// Static import of all blog posts
const postFiles = import.meta.glob('/src/blog/**/*.md', { eager: true, query: '?raw', import: 'default' });

/**
 * Generate excerpt from content (first 150 characters)
 * @param {string} content - Markdown content
 * @returns {string} Excerpt text
 */
function generateExcerpt(content, maxLength = 150) {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#+\s/g, '') // Remove headers
    .replace(/\*\*|__/g, '') // Remove bold/italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * Get all blog posts with parsed frontmatter
 * @returns {Array} Array of post objects sorted by date (newest first)
 */
export function getAllPosts() {
  const posts = Object.entries(postFiles).map(([path, content]) => {
    const { attributes, body } = fm(content);

    // Extract slug from filename (remove /src/blog/ prefix and .md extension)
    const slug = path.replace('/src/blog/', '').replace('.md', '');

    return {
      ...attributes,
      slug: attributes.slug || slug,
      content: body,
      excerpt: attributes.excerpt || generateExcerpt(body),
      path,
    };
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} Post object or null if not found
 */
export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Get all post slugs
 * @returns {Array} Array of post slugs
 */
export function getAllPostSlugs() {
  const posts = getAllPosts();
  return posts.map(post => post.slug);
}

/**
 * Get posts by tag (if you add tags to frontmatter later)
 * @param {string} tag - Tag to filter by
 * @returns {Array} Filtered posts
 */
export function getPostsByTag(tag) {
  const posts = getAllPosts();
  return posts.filter(post => post.tags && post.tags.includes(tag));
}
