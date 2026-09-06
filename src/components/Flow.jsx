import { lazy, Suspense, Component, useEffect, useState } from 'react';

const GrainGradient = lazy(() => import('@paper-design/shaders-react')
  .then((module) => ({ default: module.GrainGradient })));

class ShaderFallback extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Flow({ theme = 'light' }) {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    const supported = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    const update = () => setEnabled(supported && !reduced.matches);
    const visibility = () => setVisible(!document.hidden);
    update();
    visibility();
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      reduced.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  const dark = theme === 'dark';
  return (
    <div className="paper-field" aria-hidden="true">
      {enabled && (
        <ShaderFallback>
          <Suspense fallback={null}>
            <GrainGradient
              width="100%" height="100%"
              colors={dark
                ? ['#77639d', '#b77382', '#b38b57']
                : ['#c4b1ec', '#eea398', '#e7c17e']}
              colorBack={dark ? '#131211' : '#f2f1ee'}
              shape="wave"
              softness={0.62}
              intensity={0.55}
              noise={0.32}
              speed={visible ? 0.42 : 0}
              frame={12000}
              scale={0.85}
              rotation={-25}
              offsetX={0}
              minPixelRatio={1}
              maxPixelCount={1200000}
            />
          </Suspense>
        </ShaderFallback>
      )}
    </div>
  );
}
