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
        <div className="steam-box" id="blog">
            <div className="steam-box-title">Blog Posts</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {posts.length === 0 ? (
                    <p style={{ color: '#888' }}>No posts found</p>
                ) : (
                    posts.map((post) => (
                        <li key={post.slug} style={{ marginBottom: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid transparent' }}>
                            <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ fontSize: '16px', color: '#66c0f4', fontWeight: 'bold' }}>{post.title}</div>
                                <div style={{ fontSize: '12px', color: '#8f98a0', marginTop: '4px' }}>{String(post.date)}</div>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
