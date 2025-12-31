import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import fm from 'front-matter';
import SteamLayout from '../components/SteamLayout.jsx';

export default function BlogPost() {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [frontmatter, setFrontmatter] = useState({});

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/blog/${slug}.md`);
                if (res.ok) {
                    const text = await res.text();
                    const { attributes: data, body: content } = fm(text);
                    setContent(content);
                    setFrontmatter(data);
                } else {
                    setContent('Post not found.');
                }
            } catch (e) {
                console.error(e);
                setContent('Error loading post.');
            }
        }
        fetchPost();
    }, [slug]);

    const components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={atomDark}
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
    };

    return (
        <SteamLayout activeTab="BLOG">
            <div className="steam-box" id="blog-post">
                 <div style={{ marginBottom: '15px' }}>
                    <Link 
                        to="/?tab=BLOG" 
                        className="edit-profile-btn" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                        <i className="fa fa-arrow-left"></i> Back to Blog
                    </Link>
                </div>

                <div className="steam-box-title" style={{ fontSize: '24px', borderBottom: '1px solid #3d4450', marginBottom: '15px', paddingBottom: '10px' }}>
                    {frontmatter.title || 'Loading...'}
                </div>
                
                {frontmatter.date && (
                    <div style={{ color: '#8f98a0', fontSize: '13px', marginBottom: '20px' }}>
                        Posted on {String(frontmatter.date)}
                    </div>
                )}

                <div className="steam-post-content" style={{ color: '#c6d4df', fontSize: '14px', lineHeight: '1.6' }}>
                    <ReactMarkdown components={components}>{content}</ReactMarkdown>
                </div>
            </div>
        </SteamLayout>
    );
}
