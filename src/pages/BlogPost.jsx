import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, formatDate } from '../utils/blog.js';
import SiteHeader from '../components/SiteHeader.jsx';
import useTheme from '../hooks/useTheme.js';

export default function BlogPost() {
    const { slug } = useParams();
    const [theme, toggleTheme] = useTheme();

    // Resolved synchronously so the title exists in the first frame —
    // the view transition morphs it from the notebook entry on the home page.
    const post = getPostBySlug(slug);
    const frontmatter = post || {};
    const content = post ? post.content : 'Post not found.';

    const components = {
        img({ src, alt, ...props }) {
            if (!src) return null;

            let width = props.width;

            if (alt) {
                const widthMatch = alt.match(/(\d+)%$/);
                if (widthMatch) {
                    width = widthMatch[1] + '%';
                }
            }

            const fullSrc = src.startsWith('/') ? src : '/' + src;
            return (
                <div style={{ margin: '20px 0' }}>
                    <img
                        src={fullSrc}
                        alt={alt?.replace(/\s+\d+%$/, '') || ''}
                        style={{ maxWidth: '100%', height: 'auto', width: width || 'auto' }}
                        loading="lazy"
                    />
                </div>
            );
        },
    };

    return (
        <>
            <SiteHeader theme={theme} toggleTheme={toggleTheme} homePath="/" />

            <article className="reading-page">
                <Link to="/" viewTransition className="back-link hero-reveal" style={{ '--d': '0.1s' }}>
                    ← Back to home
                </Link>

                <header className="reading-header">
                    <div className="label hero-reveal" style={{ '--d': '0.2s' }}>Writing</div>
                    {/* No hero-reveal: this is the shared view-transition element,
                        it must be fully visible while the morph plays. */}
                    <h1 className="reading-title" style={{ viewTransitionName: 'post-title' }}>
                        {frontmatter.title || 'Post not found'}
                    </h1>
                    {frontmatter.date && (
                        <div className="reading-date hero-reveal" style={{ '--d': '0.26s' }}>
                            {formatDate(frontmatter.date)}
                        </div>
                    )}
                </header>

                <div className="reading-content hero-reveal" style={{ '--d': '0.32s' }}>
                    <ReactMarkdown components={components}>{content}</ReactMarkdown>
                </div>

                <footer className="foot">
                    <span className="label">© {new Date().getFullYear()} Shivom Sharma</span>
                    <span className="label">Toronto, ON</span>
                </footer>
            </article>
        </>
    );
}
