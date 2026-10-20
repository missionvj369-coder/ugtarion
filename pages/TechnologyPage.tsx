import React, { useEffect } from 'react';
import { updatePageMetadata } from '../lib/seo';
import IntelligenceSynthesizer from '../components/IntelligenceSynthesizer';
import BlueprintConstellation from '../components/BlueprintConstellation';
import { CTAButton } from './PageKit';
import { Cpu, Layers, ShieldCheck, GitBranch, Terminal, Boxes, Eye } from 'lucide-react';

const STACK: Array<{ icon: React.ReactNode; title: string; detail: string }> = [
  { icon: <Cpu className="w-5 h-5" />, title: 'React 19 + Vite 6', detail: 'A modern, concurrent UI runtime compiled and code-split for speed.' },
  { icon: <Boxes className="w-5 h-5" />, title: 'Edge-native backend', detail: 'One Cloudflare Worker serves the React site and the D1-backed registry API from a single origin.' },
  { icon: <ShieldCheck className="w-5 h-5" />, title: 'JWT RS256 + OAuth/OIDC', detail: 'Asymmetric token signing with PKCE authorization-code flow and QR login.' },
  { icon: <Layers className="w-5 h-5" />, title: 'Cloudflare D1 + Worker API', detail: 'SQLite at the edge with all reads and writes proxied through a single Worker.' },
  { icon: <GitBranch className="w-5 h-5" />, title: 'Open & inspectable', detail: 'The intelligence and graph engines on this page are committed source — no secrets.' },
  { icon: <Terminal className="w-5 h-5" />, title: 'Observability', detail: 'Sentry error tracking plus live API / database / auth health checks.' },
];

const TechnologyPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'The Living Intelligence Environment — UGT Technology',
      'Universal Guard Trust turns its own framework into a living, interactive proof. Explore the Integrated Intelligence Synthesizer and the Blueprint Constellation — built entirely client-side, open and inspectable.'
    );
  }, []);

  return (
    <div className="bg-[#07070c] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-40 right-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 pt-32 pb-16 text-center">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-amber-300/90 mb-5">
            Technology · Living Proof
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.05] text-balance">
            This website is the argument.
          </h1>
          <p className="mt-7 text-lg sm:text-xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed text-pretty">
            UGT teaches that no single intelligence is sufficient. So instead of describing that idea,
            we built it. Everything below runs entirely in your browser — no accounts, no API keys, no
            servers to trust. The framework is not a claim. It is an experience you can operate.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#synthesizer" className="inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full bg-white text-zinc-900 hover:bg-amber-50 transition-all">
              Try the Synthesizer
            </a>
            <a href="#constellation" className="inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full border border-white/30 text-white hover:border-amber-400/70 hover:bg-white/5 transition-all">
              Explore the Blueprint
            </a>
          </div>
        </div>
      </section>

      {/* Concept A — Synthesizer */}
      <section id="synthesizer" className="scroll-mt-24">
        <IntelligenceSynthesizer />
      </section>

      {/* Explainer between the two */}
      <section className="py-20 sm:py-24 bg-[#0b0b12] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <Eye className="w-6 h-6 text-amber-300 mx-auto mb-5" />
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-balance">
            From synthesis to systems
          </h2>
          <p className="mt-5 text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto">
            The Synthesizer combines ways of <em>knowing</em>. The Blueprint combines ways of{' '}
            <em>living</em>. Together they are one architecture: intelligences that inform the systems
            that shape civilization. Below, the fifteen Blueprint systems are rendered as a live,
            draggable network — because none of them exists alone.
          </p>
        </div>
      </section>
      {/* Concept B — Constellation */}
      <section id="constellation" className="scroll-mt-24 py-20 sm:py-28 bg-gradient-to-b from-[#0a0a12] to-[#07070c]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-amber-300/90 mb-4">
              The Living Blueprint
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-balance">
              Fifteen systems, one field
            </h2>
            <p className="mt-5 text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Drag the nodes. Watch the relationships hold. This is the UGT Blueprint as a force-directed
              graph — a real physics simulation running on your device.
            </p>
          </div>
          <BlueprintConstellation height={600} />
        </div>
      </section>

      {/* How it's engineered */}
      <section className="py-20 sm:py-28 bg-[#07070c] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-amber-300/90 mb-4">
              Under the hood
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-balance">
              How it's engineered
            </h2>
            <p className="mt-5 text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              The same rigor behind the experiences above powers the Universal ID identity system and
              the whole UGT platform.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STACK.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-amber-400/30 transition-colors">
                <div className="text-amber-300 mb-4">{item.icon}</div>
                <h3 className="font-medium text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-[#0b0b12] to-[#07070c] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-balance">
            Don't take the vision on faith.
          </h2>
          <p className="mt-5 text-zinc-400 font-light leading-relaxed">
            Operate it. Then join the network building it in reality.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton label="Claim Your Universal ID" to="/universal-id" variant="primary" />
            <CTAButton label="Explore the Blueprint" to="/blueprint" variant="outlineLight" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnologyPage;

