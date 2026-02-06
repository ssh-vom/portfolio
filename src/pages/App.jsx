import About from '../components/About.jsx';
import Timeline from '../components/Timeline.jsx';
import Projects from './Projects.jsx';
import Blog from './Blog.jsx';
import SpotifyNowPlaying from '../components/SpotifyNowPlaying.jsx';
import ContactColumn from '../components/ContactColumn.jsx';
import EditorialLayout from '../components/EditorialLayout.jsx';

export default function App() {
    // Intro column content
    const introColumn = (
        <>
            <div className="intro-avatar">
                <img src="/images/pfp.jpeg" alt="Shivom Sharma" />
            </div>
            <div className="intro-name">Shivom Sharma</div>
            <div className="intro-location">Toronto, Ontario</div>
            <div className="intro-description">
                Software Engineer & Mechatronics Student
            </div>
            <SpotifyNowPlaying />
        </>
    );

    // About column content
    const aboutColumn = <About />;

    // Experience column content
    const experienceColumn = <Timeline />;

    // Projects column content
    const projectsColumn = <Projects />;

    // Blog column content
    const blogColumn = <Blog />;

    // Contact column content
    const contactColumn = <ContactColumn />;

    return (
        <EditorialLayout
            introColumn={introColumn}
            aboutColumn={aboutColumn}
            experienceColumn={experienceColumn}
            projectsColumn={projectsColumn}
            blogColumn={blogColumn}
            contactColumn={contactColumn}
        />
    );
}
