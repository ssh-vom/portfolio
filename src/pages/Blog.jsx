import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/blog.js';

export default function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Load posts statically using the blog utilities
        const loadedPosts = getAllPosts();
        setPosts(loadedPosts);
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
