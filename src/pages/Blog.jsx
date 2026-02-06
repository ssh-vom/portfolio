import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/blog.js';

export default function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadedPosts = getAllPosts();
        setPosts(loadedPosts);
    }, []);

    return (
        <>
            <div className="column-title">Writing</div>
            
            <div className="blog-list">
                {posts.length === 0 ? (
                    <p className="spotify-not-playing">No posts yet</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.slug} className="blog-item">
                            <div className="blog-date">{String(post.date)}</div>
                            <Link to={`/blog/${post.slug}`} className="blog-title">
                                {post.title}
                            </Link>
                            {post.excerpt && (
                                <div className="blog-excerpt">{post.excerpt}</div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
