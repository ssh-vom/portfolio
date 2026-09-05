import { useEffect, useRef, useState } from 'react';
import './ControllerStudy.css';

// Simplified projection of TP1_B_0_BUTTON.glb; see controller-study.md.
const PLANE = 'matrix(.866 .5 -.866 .5 300 210)';
const SIZE = 220;
const unit = (mm) => (mm + 90) * SIZE / 180;
const buttons = [[24, 53.5], [60, 61.5], [-12, 9.5], [24, 15.5], [60, 23.5], [-60, -24.5], [-24, -24.5], [12, -22.5]].map(([x, y]) => [unit(x), unit(y)]);
const joystickButtons = [[19.8, 45.5], [57.8, 35.5], [24.7, 7.5], [62.8, -2.5]].map(([x, y]) => [unit(x), unit(y)]);
const stick = [unit(-41.6), unit(17.5)];
const stickScreen = [300 + 0.866 * (stick[0] - stick[1]), 210 + 0.5 * (stick[0] + stick[1])];
const mounts = [[10, 10], [210, 10], [10, 210], [210, 210]];
const magnetPositions = [-60, -30, 0, 30, 60].map(unit);
const ease = (start, end, p) => { const t = Math.max(0, Math.min(1, (p - start) / (end - start))); return t * t * (3 - 2 * t); };

function Plate({ x = 0, y = 0, width = SIZE, height = SIZE, depth = 12, kind = '' }) {
  return (
    <g className={`iso-plate ${kind}`}>
      <g transform={PLANE}>
        <path className="iso-side-left" d={`M${x} ${y + height}h${width}l${depth} ${depth}h-${width}Z`} />
        <path className="iso-side-right" d={`M${x + width} ${y}v${height}l${depth} ${depth}v-${height}Z`} />
        <rect className="iso-plate-top" x={x} y={y} width={width} height={height} rx="3" />
      </g>
    </g>
  );
}

function MagnetFace({ x, connector = false }) {
  // Local coordinates are length along the side wall and vertical depth,
  // NOT the horizontal lid plane. Both magnet sets face across the join.
  return (
    <g transform={`matrix(-.866 .5 0 1 ${300 + x * 0.866} ${210 + x * 0.5})`} className={connector ? 'iso-mating-face' : 'iso-controller-face'}>
      <rect className="iso-vertical-wall" width="220" height="60" rx="2" />
      <path className="iso-rail" d="M4 8h212v6H4ZM4 47h212v6H4Z" />
      {magnetPositions.map((position) => <g key={position}><circle className="iso-magnet-rim" cx={position} cy="32" r="9" /><circle className="iso-magnet" cx={position} cy="32" r="7" /></g>)}
    </g>
  );
}

function PlateDetails({ inputs }) {
  return <g transform={PLANE}>
    <rect className="iso-display" x="150" y="20" width="48" height="19" rx="2" />
    <path className="iso-display-ink" d="M158 30h7m4 0h7m4 0h10" />
    {[30, 58, 86].map((x) => <rect key={x} className="iso-function" x={x} y="21" width="18" height="16" rx="3" />)}
    {inputs.map(([cx, cy]) => <circle className="iso-socket" key={`${cx}-${cy}`} cx={cx} cy={cy} r="19" />)}
    {mounts.map(([cx, cy]) => <circle className="iso-screw" key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" />)}
  </g>;
}

function ButtonCaps({ inputs }) {
  // SVG has no depth buffer: paint far → near, independent of input IDs.
  // One continuous cylindrical side avoids a second ellipse peeking through.
  return [...inputs].sort((a, b) => a[0] + a[1] - b[0] - b[1]).map(([cx, cy]) => {
    const x = 300 + 0.866 * (cx - cy);
    const y = 210 + 0.5 * (cx + cy);
    const rx = 20.8;
    const ry = 12;
    return <g key={`${cx}-${cy}`}>
      <path className="iso-button-edge" d={`M${x - rx} ${y}a${rx} ${ry} 0 0 0 ${rx * 2} 0v6a${rx} ${ry} 0 0 1 ${-rx * 2} 0Z`} />
      <ellipse className="iso-button-face" cx={x} cy={y} rx={rx} ry={ry} />
      <path className="iso-button-glint" d={`M${x - 12} ${y - 5}q12 -8 24 0`} />
    </g>;
  });
}

export default function ControllerStudy() {
  const ref = useRef(null);
  const statusRef = useRef(null);
  const elapsedRef = useRef(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPlaying(!reduced.matches);
    reduced.addEventListener('change', onChange);
    return () => reduced.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!playing) return;
    let frame = 0;
    let previous = null;
    const update = (time) => {
      if (previous !== null && !document.hidden) {
        elapsedRef.current += Math.min(time - previous, 64);
      }
      previous = time;
      // First inspect the internals, then exchange complete input layouts.
      const cycle = elapsedRef.current % 22000;
      const p = Math.max(0, Math.min(1, (cycle - 700) / 8600));
      const expansion = ease(0.15, 0.4, p) * (1 - ease(0.6, 0.83, p));
      const rail = ease(0, 0.15, p) * (1 - ease(0.88, 1, p));
      const gap = ease(0.15, 0.3, p) * (1 - ease(0.75, 0.88, p));
      element.style.setProperty('--explode', expansion.toFixed(4));
      element.style.setProperty('--rail', rail.toFixed(4));
      element.style.setProperty('--gap', gap.toFixed(4));
      const swap = cycle - 10000;
      element.style.setProperty('--swap-lift', (ease(0, 1500, swap) * (1 - ease(9500, 11000, swap))).toFixed(4));
      element.style.setProperty('--button-out', (ease(1400, 2700, swap) * (1 - ease(8200, 9500, swap))).toFixed(4));
      element.style.setProperty('--joystick-in', (ease(2200, 3600, swap) * (1 - ease(7600, 9000, swap))).toFixed(4));
      element.style.setProperty('--joystick-lift', Math.min(1, 1 - ease(3600, 4800, swap) + ease(6500, 7600, swap)).toFixed(4));
      const status = swap >= 0
        ? swap < 2200 ? '06 / Lift the button plate' : swap < 4800 ? '07 / Fit the joystick plate' : swap < 6500 ? '08 / Joystick + four buttons' : swap < 9500 ? '09 / Swap back' : '10 / Eight buttons, same enclosure'
        : p < 0.15 ? '01 / Release the rail' : p < 0.4 ? '02 / Separate the layers' : p < 0.6 ? '03 / Inside the module' : p < 0.83 ? '04 / Reassemble' : '05 / Slide & dock';
      if (statusRef.current.textContent !== status) statusRef.current.textContent = status;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <div className="controller-stage" ref={ref}>
      <figure className="controller-study">
        <div className="controller-study-heading"><span className="label">A closer look</span><p>Built in <em>layers.</em></p></div>
        <svg viewBox="0 0 720 540" role="img" aria-label="Simplified isometric OpenArcade assembly, based on the CAD export. Eight buttons lift from the faceplate to reveal the ESP32 perfboard and battery. The connector slides along the rail and separates, revealing magnets on opposing vertical faces, then docks again. The eight-button top plate swaps for a joystick and four-button layout, then returns.">
          <g className="iso-ground" transform="translate(0 68)"><g transform={PLANE}><path d="M-40 0H290M-40 110H290M-40 220H290M0-30V250M110-30V250M220-30V250" /><rect className="iso-shadow" x="0" y="0" width="250" height="220" rx="10" /></g></g>
          <Plate depth={60} kind="iso-base" />
          <g transform={PLANE} className="iso-cavity"><rect x="9" y="9" width="202" height="202" rx="4" /><path d="M18 24h184M18 194h184M28 18v184M192 18v184" />{mounts.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}</g>
          <MagnetFace x={220} />
          <g className="iso-guides">{mounts.map(([x, y]) => <path key={`${x}-${y}`} d={`M${300 + 0.866 * (x - y)} ${210 + 0.5 * (x + y)}v-180`} pathLength="1" />)}</g>

          <g className="iso-board-layer">
            <Plate x={67} y={30} width={86} height={61} depth={3} kind="iso-board" />
            <g transform={PLANE}>
              <g className="iso-perf-holes">{Array.from({ length: 7 }, (_, row) => Array.from({ length: 11 }, (_, col) => <circle key={`${row}-${col}`} cx={71 + col * 7.6} cy={34 + row * 8.2} r="1.1" />))}</g>
              <rect className="iso-devkit" x="64" y="41" width="62" height="34" rx="2" />
              <rect className="iso-chip" x="83" y="45" width="31" height="26" rx="2" />
              <text className="iso-chip-label" x="98" y="60" textAnchor="middle">ESP32</text>
              <path className="iso-chip-pins" d="M70 40h51M70 77h51" strokeDasharray="2 3" />
              <rect className="iso-usb" x="61" y="50" width="10" height="14" rx="1" />
              <g className="iso-jst">{Array.from({ length: 8 }, (_, i) => <rect key={i} x={70 + i * 10} y="82" width="7" height="6" rx="1" />)}</g>
              <path className="iso-wires" d="M78 85v13h38v32M108 85v20h42v26M139 85v14h30v40" />
            </g>
            <Plate x={71} y={138} width={78} height={73} depth={14} kind="iso-battery" />
            <g transform={PLANE}><rect className="iso-battery-label" x="82" y="157" width="56" height="30" rx="2" /><text className="iso-chip-label" x="110" y="174" textAnchor="middle">BATTERY</text></g>
          </g>

          <g className="iso-button-layout">
            <g className="iso-top-layer"><Plate depth={7} kind="iso-lid" /><PlateDetails inputs={buttons} /></g>
            <g className="iso-buttons-layer"><ButtonCaps inputs={buttons} /></g>
          </g>
          <g className="iso-joystick-layout">
            <Plate depth={7} kind="iso-lid" />
            <PlateDetails inputs={joystickButtons} />
            <g transform="translate(0 -6)"><ButtonCaps inputs={joystickButtons} /></g>
            <g transform={PLANE}><circle className="iso-stick-boot" cx={stick[0]} cy={stick[1]} r="25" /><circle className="iso-stick-collar" cx={stick[0]} cy={stick[1]} r="13" /></g>
            <path className="iso-stick-shaft" d={`M${stickScreen[0]} ${stickScreen[1]}v-54`} />
            <circle className="iso-stick-ball" cx={stickScreen[0]} cy={stickScreen[1] - 64} r="22" />
            <path className="iso-stick-highlight" d={`M${stickScreen[0] - 13} ${stickScreen[1] - 69}a14 14 0 0 1 18 -8`} />
          </g>

          <g className="iso-module-layer">
            <Plate x={224} width={19} height={220} depth={60} kind="iso-connector" />
            {/* Cutaway facing wall: visible through the connector while detached. */}
            <MagnetFace x={224} connector />
          </g>
          <g className="iso-annotations"><g className="iso-buttons-layer"><path d="M152 290H78" /><text x="33" y="280">08 / BUTTONS</text></g><g className="iso-board-layer"><path d="M407 300h89" /><text x="462" y="290">ESP32 + PERFBOARD</text></g><path d="M190 430H90" /><text x="27" y="420">PRINTED ENCLOSURE</text></g>
        </svg>
        <figcaption><span>CAD-informed study · connector shown in cutaway</span><span className="controller-study-status" ref={statusRef}>01 / Release the rail</span></figcaption>
        <div className="controller-playback">
          <span className="controller-study-hint">{playing ? 'Explode, reconnect & swap plates · 22-second loop' : 'Animation paused'}</span>
          <button type="button" className="controller-playback-button" onClick={() => setPlaying((value) => !value)}>
            {playing ? 'Pause animation' : 'Play animation'}
          </button>
        </div>
      </figure>
    </div>
  );
}
