const postFiles = import.meta.glob('/src/blog/**/*.md', { eager: true, query: '?raw', import: 'default' });

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const attributes = {};
  if (!match) return { attributes, body: raw };
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i !== -1) attributes[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { attributes, body: raw.slice(match[0].length) };
}

export function getAllPosts() {
  const posts = Object.entries(postFiles).map(([path, content]) => {
    const { attributes, body } = parseFrontMatter(content);
    const slug = path.replace('/src/blog/', '').replace('.md', '');

    return {
      ...attributes,
      slug: attributes.slug || slug,
      content: body,
      path,
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((post) => post.slug === slug) || null;
}
