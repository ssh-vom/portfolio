import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/blog.js';
import SiteHeader from '../components/SiteHeader.jsx';
import useTheme from '../hooks/useTheme.js';

function formatDate(date) {
    const d = new Date(date);
    if (isNaN(d)) return String(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function Mermaid({ chart }) {
    const [svg, setSvg] = useState('');

    useEffect(() => {
        import('mermaid').then(mermaid => {
            mermaid.default.initialize({
                theme: 'base',
                themeVariables: {
                    primaryColor: '#292524',
                    primaryTextColor: '#faf9f7',
                    primaryBorderColor: '#57534e',
                    lineColor: '#78716c',
                    secondaryColor: '#44403c',
                    tertiaryColor: '#1c1917',
                    fontFamily: 'IBM Plex Mono, monospace',
                },
                securityLevel: 'loose',
            });
            mermaid.default.render(`mermaid-${Date.now()}`, chart).then(({ svg }) => {
                setSvg(svg);
            }).catch(err => {
                console.error('Mermaid render error:', err);
                setSvg('<pre class="mermaid-error">' + chart + '</pre>');
            });
        });
    }, [chart]);

    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function BlogPost() {
    const { slug } = useParams();
    const [theme, toggleTheme] = useTheme();

    // Resolved synchronously so the title exists in the first frame —
    // the view transition morphs it from the notebook entry on the home page.
    const post = getPostBySlug(slug);
    const frontmatter = post || {};
    const content = post ? post.content : 'Post not found.';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match && match[1] === 'mermaid') {
                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
            }
            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
        img({ node, src, alt, ...props }) {
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
                        onError={() => {
                            console.error('Image failed to load:', fullSrc);
                        }}
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
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[]}
                        components={components}
                    >
                        {content}
                    </ReactMarkdown>
                </div>

                <footer className="foot">
                    <span className="label">© {new Date().getFullYear()} Shivom Sharma</span>
                    <span className="label">Toronto, ON</span>
                </footer>
            </article>
        </>
    );
}
