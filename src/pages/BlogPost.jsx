import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';

export default function BlogPost() {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [frontmatter, setFrontmatter] = useState({});

    useEffect(() => {
        async function fetchPost() {
            const res = await fetch(`/blog/${slug}.md`);
            const text = await res.text();
            const { content, data } = matter(text);
            setContent(content);
            setFrontmatter(data);
        }
        fetchPost();
    }, [slug]);

    return (
        <section id="blog-post" style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
            <Link to="/blog">← Back to Blog</Link>
            <h1>{frontmatter.title}</h1>
            <div style={{ color: '#888', fontSize: '0.9em', marginBottom: 24 }}>{frontmatter.date}</div>
            <ReactMarkdown>{content}</ReactMarkdown>
        </section>
    );
}
