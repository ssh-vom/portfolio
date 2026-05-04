import roles from '../data/experience.yaml';

function parseTitle(title) {
  const parts = title.split(',').map((s) => s.trim());
  return {
    company: parts[0] || '',
    role: parts[1] || '',
  };
}

function getYear(dateStr) {
  const match = dateStr.match(/(\d{4})/);
  return match ? match[1] : '';
}

export default function ExperienceTimeline({ inline = false }) {
  const sorted = [...roles].sort((a, b) => {
    const ya = getYear(a.date) || '0';
    const yb = getYear(b.date) || '0';
    return parseInt(yb) - parseInt(ya);
  });

  const groups = [];
  sorted.forEach((role, idx) => {
    const year = getYear(role.date);
    const isLast = idx === sorted.length - 1;
    const label = isLast && parseInt(year) < 2024 ? 'Earlier' : year;
    const existing = groups.find((g) => g.label === label);
    const { company, role: roleTitle } = parseTitle(role.title);
    if (existing) {
      existing.entries.push({ company, role: roleTitle, date: role.date });
    } else {
      groups.push({
        label,
        entries: [{ company, role: roleTitle, date: role.date }],
      });
    }
  });

  const Wrapper = inline ? 'div' : 'aside';
  const wrapperProps = inline ? { className: 'experience-timeline-inline' } : { className: 'experience-timeline', id: 'experience' };

  return (
    <Wrapper {...wrapperProps}>
      {!inline && <div className="et-header">Experience Timeline</div>}
      <div className="et-track">
        {groups.map((group, gi) => (
          <div className="et-group" key={group.label}>
            <div className="et-node-wrap">
              <div
                className={`et-node ${gi === 0 ? 'active' : gi === groups.length - 1 ? 'older' : ''}`}
              />
              {gi < groups.length - 1 && <div className="et-line" />}
            </div>
            <div className="et-content">
              <div className="et-year">{group.label}</div>
              {group.entries.map((entry, ei) => (
                <div className="et-entry" key={ei}>
                  <div className="et-company">{entry.company}</div>
                  <div className="et-role">{entry.role}</div>
                  {group.entries.length > 1 && ei < group.entries.length - 1 && (
                    <div className="et-entry-divider" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
