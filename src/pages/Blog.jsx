import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';

export default function Blog() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            const files = [
                '/blog/hello-world.md',
            ];
            const loadedPosts = await Promise.all(
                files.map(async (file) => {
                    const res = await fetch(file);
                    const text = await res.text();
                    const { data } = matter(text);
                    return {
                        ...data,
                        slug: data.slug || file.replace('/blog/', '').replace('.md', ''),
                    };
                })
            );
            setPosts(loadedPosts);
        }
        fetchPosts();
    }, []);

    return (
        <section id="blog">
            <h2>Blog</h2>
            <ul>
                <li>test</li>
            </ul>
        </section>
        // {posts.map((post) => (
        //     <li key={post.slug}>
        //         <Link to={`/blog/${post.slug}`}>{post.title} <span style={{ fontSize: '0.8em', color: '#888' }}>{post.date}</span></Link>
        //     </li>
        // ))
    );
}
