import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import About from '../components/About.jsx';
import Timeline from '../components/Timeline.jsx';
import SteamLayout from '../components/SteamLayout.jsx';
import Blog from './Blog.jsx'; // Import from local directory
import '../steam-theme.css';

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || 'ALL');

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'ALL':
                return (
                    <>
                        <About />
                        <Timeline />
                    </>
                );
            case 'PROJECTS':
                return (
                    <div className="steam-box">
                        <div className="steam-box-title">Projects</div>
                        <div style={{ padding: '20px', textAlign: 'center', color: '#8f98a0' }}>
                            Work in Progress...
                        </div>
                    </div>
                );
            case 'EXPERIENCE':
                return <Timeline />;
            case 'BLOG':
                return <Blog />;
            default:
                return <About />;
        }
    };

    return (
        <SteamLayout activeTab={activeTab} onTabChange={handleTabChange}>
            {renderContent()}
        </SteamLayout>
    );
}
