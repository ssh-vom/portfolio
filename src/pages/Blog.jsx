import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/blog.js';

function estimateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes < 1 ? '< 1 min' : `${minutes} min`;
}

export default function Blog() {
    const posts = getAllPosts();

    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="blog-list">
            {posts.map((post) => (
                <Link
                    to={`/blog/${post.slug}`}
                    className="blog-item"
                    key={post.slug}
                >
                    <div className="blog-content">
                        <span className="blog-title">{post.title}</span>
                        <span className="blog-meta">{String(post.date)} · {estimateReadingTime(post.content)}</span>
                    </div>
                    <span className="blog-arrow">→</span>
                </Link>
            ))}
        </div>
    );
}
