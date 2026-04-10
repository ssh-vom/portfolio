import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/blog.js';

function estimateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes < 1 ? '< 1 min' : `${minutes} min`;
}

export default function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const loadedPosts = getAllPosts();
        setPosts(loadedPosts);
    }, []);

    if (posts.length === 0) {
        return null; // Hide section if no posts
    }

    return (
        <>
            <div className="section-header">
                <div className="section-label">Writing</div>
                <h2 className="section-title">Recent Thoughts</h2>
            </div>

            <div className="blog-list">
                {posts.map((post) => (
                    <div key={post.slug} className="blog-item">
                        <div className="blog-date">{String(post.date)}</div>
                        <Link to={`/blog/${post.slug}`} className="blog-title">
                            {post.title}
                        </Link>
                        <div className="blog-read-time">{estimateReadingTime(post.content)}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
