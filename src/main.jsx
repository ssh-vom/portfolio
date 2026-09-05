import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './pages/App.jsx';
import BlogPost from './pages/BlogPost.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import './styles.css';

// Data router (not <BrowserRouter>) — required for viewTransition links
// and useViewTransitionState.
const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/blog', element: <Navigate to="/#writing" replace /> },
    { path: '/blog/:slug', element: <BlogPost /> },
]);

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
    <StrictMode>
        <SmoothScroll>
            <RouterProvider router={router} />
        </SmoothScroll>
    </StrictMode>
);
