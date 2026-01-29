import { readingLinks } from '../data/readingLinks.js';

export default function Readings() {
    return (
        <div className="steam-box" id="reading">
            <div className="steam-box-title">Some of my favourite miscellaneous content</div>
            <ul className="reading-list">
                {readingLinks.length === 0 ? (
                    <p className="reading-empty">None found</p>
                ) : (
                    readingLinks.map((link) => (
                        <li key={link} className="reading-item">
                            <a href={link} target="_blank" rel="noopener noreferrer" className="reading-link">
                                {link}
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
