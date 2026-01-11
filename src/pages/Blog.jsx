import { useState, useEffect } from 'react';
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
            <ul className="blog-list">
                {posts.length === 0 ? (
                    <p className="blog-empty">No posts found</p>
                ) : (
                    posts.map((post) => (
                        <li key={post.slug} className="blog-item">
                            <Link to={`/blog/${post.slug}`} className="blog-link">
                                <div className="blog-title">{post.title}</div>
                                <div className="blog-date">{String(post.date)}</div>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
