/**
 * Full-bleed band of giant outlined type announcing the next section,
 * sliding horizontally as it crosses the viewport. Scrubbed by a CSS
 * view-timeline, so it tracks scroll exactly in both directions;
 * `reverse` flips the travel so alternating bands cross each other.
 */
export default function Ticker({ text, reverse = false }) {
  return (
    <div className={`ticker${reverse ? ' ticker-reverse' : ''}`} aria-hidden="true">
      <div className="ticker-track">
        {Array.from({ length: 6 }, (_, i) => (
          <span className="ticker-item" key={i}>
            {text}
            <span className="ticker-sep" />
          </span>
        ))}
      </div>
    </div>
  );
}
