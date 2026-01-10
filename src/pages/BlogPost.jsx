import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/blog.js';
import SteamLayout from '../components/SteamLayout.jsx';

function Mermaid({ chart }) {
    const [svg, setSvg] = useState('');

    useEffect(() => {
        import('mermaid').then(mermaid => {
            mermaid.default.initialize({
                theme: 'dark',
                themeVariables: {
                    primaryColor: '#66c0f4',
                    primaryTextColor: '#c6d4df',
                    primaryBorderColor: '#3d4450',
                    lineColor: '#8f98a0',
                    secondaryColor: '#2a475e',
                    tertiaryColor: '#1b2838',
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
    const [readingMode, setReadingMode] = useState(() => {
        return localStorage.getItem('readingMode') === 'true';
    });

    useEffect(() => {
        // Load post statically using the blog utilities
        const post = getPostBySlug(slug);
        if (post) {
            setContent(post.content);
            setFrontmatter(post);
        } else {
            setContent('Post not found.');
            setFrontmatter({});
        }
    }, [slug]);

    const toggleReadingMode = () => {
        const newMode = !readingMode;
        setReadingMode(newMode);
        localStorage.setItem('readingMode', newMode.toString());
    };

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match && match[1] === 'mermaid') {
                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
            }
            return !inline && match ? (
                <SyntaxHighlighter
                    style={gruvboxDark}
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
        <SteamLayout activeTab="BLOG" readingMode={readingMode}>
            <div className={`steam-box ${readingMode ? 'reading-mode' : ''}`} id="blog-post">
                <div className="blog-post-actions">
                    <Link
                        to="/?tab=BLOG"
                        className="edit-profile-btn blog-post-button"
                    >
                        <i className="fa fa-arrow-left"></i> Back to Blog
                    </Link>
                    <button
                        onClick={toggleReadingMode}
                        className="edit-profile-btn blog-post-button"
                    >
                        <i className={`fa ${readingMode ? 'fa-compress' : 'fa-expand'}`}></i>
                        {readingMode ? 'Exit Reading Mode' : 'Reading Mode'}
                    </button>
                </div>

                <div className="steam-box-title blog-post-title">
                    {frontmatter.title || 'Loading...'}
                </div>

                {frontmatter.date && (
                    <div className="blog-post-date">
                        Posted on {String(frontmatter.date)}
                    </div>
                )}

                <div className="steam-post-content blog-post-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[]}
                        components={components}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </SteamLayout>
    );
}
