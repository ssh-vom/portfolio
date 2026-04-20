import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/blog.js';
import MinimalHeader from '../components/MinimalHeader.jsx';

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
                    fontFamily: 'Departure Mono, monospace',
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
    const [content, setContent] = useState('');
    const [frontmatter, setFrontmatter] = useState({});
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        const post = getPostBySlug(slug);
        if (post) {
            setContent(post.content);
            setFrontmatter(post);
        } else {
            setContent('Post not found.');
            setFrontmatter({});
        }
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
                        onError={(e) => {
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
        <div data-theme={theme}>
            <MinimalHeader theme={theme} toggleTheme={toggleTheme} />

            <div className="reading-container">
                <Link to="/" className="back-link">
                    ← Back to home
                </Link>

                <div className="reading-header">
                    <div className="reading-label">Blog</div>
                    <h1 className="reading-title">
                        {frontmatter.title || 'Loading...'}
                    </h1>
                    {frontmatter.date && (
                        <div className="reading-date">
                            {String(frontmatter.date)}
                        </div>
                    )}
                </div>

                <div className="reading-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[]}
                        components={components}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>

            <footer className="site-footer">
                <span>© {new Date().getFullYear()} Shivom Sharma — Toronto, ON</span>
            </footer>
        </div>
    );
}
