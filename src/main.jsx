import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './pages/App.jsx';
import BlogPost from './pages/BlogPost.jsx';
import './terminal-theme.css';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/blog" element={<Navigate to="/#blog" replace />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
