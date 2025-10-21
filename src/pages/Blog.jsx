import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';

export default function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            const files = ['/blog/hello-world.md'];
            const loadedPosts = await Promise.all(
                files.map(async (file) => {
                    const res = await fetch(file);
                    if (!res.ok) {
                        console.error('Failed to fetch:', file);
                        return null;
                    }

                    const text = await res.text();
                    const { attributes } = fm(text);

                    return {
                        ...attributes,
                        slug: attributes.slug || file.replace('/blog/', '').replace('.md', ''),
                    };
                })
            );

            // filter out any nulls from failed fetches
            setPosts(loadedPosts.filter(Boolean));
        }

        fetchPosts();
    }, []);

    return (
        <section id="blog">
            <h2>Blog</h2>
            <ul>
                {posts.length === 0 ? (
                    <p style={{ color: '#888' }}>No posts found</p>
                ) : (
                    posts.map((post) => (
                        <li key={post.slug}>
                            <Link to={`/blog/${post.slug}`}>
                                {post.title}{' '}
                                <span style={{ fontSize: '0.8em', color: '#888' }}>{String(post.date)}</span>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}

