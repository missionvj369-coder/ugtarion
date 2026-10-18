import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import {
  INTELLIGENCES,
  SUGGESTED_TOPICS,
  synthesize,
  type IntelligenceCode,
} from '../lib/intelligence';

interface IntelligenceSynthesizerProps {
  /** Compact mode renders a tighter layout for embedding on other pages. */
  compact?: boolean;
}

const PRESETS: Array<{ label: string; codes: IntelligenceCode[] }> = [
  { label: 'Human + Machine', codes: ['HI', 'AI', 'SI'] },
  { label: 'Planetary Care', codes: ['EI', 'SyI', 'HI'] },
  { label: 'Cultural Wisdom', codes: ['CulI', 'CI', 'HIstI'] },
  { label: 'Full Spectrum', codes: ['HI', 'AI', 'SI', 'CI', 'EI', 'CulI', 'HIstI', 'CrI', 'SyI', 'TI'] },
];

/* ---------------- Orb field ---------------- */

interface OrbFieldProps {
  active: IntelligenceCode[];
  onToggle: (code: IntelligenceCode) => void;
}

const ORB_RADIUS = 42; // percentage from center

function orbPosition(index: number, total: number, radius: number): { x: number; y: number } {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
}

const OrbField: React.FC<OrbFieldProps> = ({ active, onToggle }) => {
  return (
    <div className="relative w-full aspect-square max-w-xl mx-auto">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
        {INTELLIGENCES.map((a, i) =>
          INTELLIGENCES.slice(i + 1).map((b) => {
            const bothActive = active.includes(a.code) && active.includes(b.code);
            const posA = orbPosition(i, INTELLIGENCES.length, ORB_RADIUS);
            const posB = orbPosition(INTELLIGENCES.indexOf(b), INTELLIGENCES.length, ORB_RADIUS);
            return (
              <line
                key={`${a.code}-${b.code}`}
                x1={posA.x} y1={posA.y} x2={posB.x} y2={posB.y}
                stroke={bothActive ? a.color.from : '#3f3f46'}
                strokeWidth={bothActive ? 0.5 : 0.2}
                strokeOpacity={bothActive ? 0.7 : 0.35}
                className="transition-all duration-500"
              />
            );
          })
        )}
        <circle cx="50" cy="50" r={6 + active.length * 0.8} fill="url(#coreGrad)" className="transition-all duration-500" />
        <defs>
          <radialGradient id="coreGrad">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>

      {INTELLIGENCES.map((intel, i) => {
        const pos = orbPosition(i, INTELLIGENCES.length, ORB_RADIUS);
        const isActive = active.includes(intel.code);
        return (
          <motion.button
            key={intel.code}
            onClick={() => onToggle(intel.code)}
            aria-pressed={isActive}
            title={`${intel.name} — ${intel.essence}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.94 }}
            animate={{ scale: isActive ? 1 : 0.82 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span className="relative flex flex-col items-center">
              <span
                className={`flex items-center justify-center rounded-full transition-all duration-500 ${
                  isActive ? 'w-16 h-16 sm:w-20 sm:h-20 shadow-lg' : 'w-12 h-12 sm:w-14 sm:h-14'
                }`}
                style={{
                  background: isActive
                    ? `radial-gradient(circle at 35% 30%, ${intel.color.from}, ${intel.color.to})`
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: isActive ? `0 0 28px ${intel.color.from}55` : 'none',
                  border: isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span className={`font-semibold tracking-tight ${isActive ? 'text-black/80 text-sm sm:text-base' : 'text-zinc-400 text-[11px] sm:text-xs'}`}>
                  {intel.code}
                </span>
              </span>
              <span className={`mt-2 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}>
                {intel.short}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

/* ---------------- Synthesis panel ---------------- */

const SynthesisPanel: React.FC<{ result: ReturnType<typeof synthesize> }> = ({ result }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">Synthesis</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span>Coherence</span>
          <span className="font-semibold text-white tabular-nums">{result.coherence}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-indigo-400"
            initial={{ width: 0 }}
            animate={{ width: `${result.coherence}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500 italic">{result.balance}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={result.integration}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="text-zinc-200 font-light leading-relaxed text-[15px] mb-6"
        >
          {result.integration}
        </motion.p>
      </AnimatePresence>

      {result.perspectives.length > 0 && (
        <div className="space-y-3 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Perspectives</p>
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {result.perspectives.map((p) => (
                <motion.li
                  key={p.code}
                  layout
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3"
                >
                  <span
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${p.color.from}, ${p.color.to})` }}
                  />
                  <div>
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">{p.text}</p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}

      {result.emergent.length > 0 && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-300/90 mb-2 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5" /> Emergent insight
          </p>
          <ul className="space-y-1.5">
            {result.emergent.map((line, i) => (
              <li key={i} className="text-sm text-amber-100/90 font-light leading-relaxed">{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const IntelligenceSynthesizer: React.FC<IntelligenceSynthesizerProps> = ({ compact = false }) => {


  const [active, setActive] = useState<IntelligenceCode[]>(['HI', 'AI', 'SI']);
  const [topic, setTopic] = useState<string>('conscious civilization');

  const toggle = (code: IntelligenceCode) => {
    setActive((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const result = useMemo(() => synthesize(topic, active), [topic, active]);

  return (
    <div className={`relative w-full ${compact ? '' : 'min-h-screen'} flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b0b12] via-[#0e0e18] to-[#08080f] text-white`}>
      {/* Ambient halos */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/5 h-[28rem] w-[28rem] rounded-full bg-amber-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 ${compact ? 'py-12' : 'py-24'}`}>
        {/* Header */}
        <div className={`text-center ${compact ? 'mb-8' : 'mb-14'}`}>
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-amber-300/90 mb-4">
            Integrated Intelligence · Live
          </p>
          <h2 className={`font-serif font-normal tracking-tight text-balance ${compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-6xl'}`}>
            The Synthesis Engine
          </h2>
          <p className="mt-5 text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
            UGT holds that no single intelligence is sufficient. Combine forms of knowing below and
            watch a multi-perspective synthesis emerge — entirely in your browser, no servers, no keys.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* LEFT: orb field + controls */}
          <div className="lg:col-span-3 space-y-8">
            <OrbField active={active} onToggle={toggle} />

            {/* Topic input */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <label htmlFor="synth-topic" className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                What shall we think about?
              </label>
              <input
                id="synth-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. the future of education"
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTED_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-zinc-300 hover:text-white hover:border-amber-400/50 hover:bg-white/5 transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets + reset */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mr-1">Presets</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setActive(p.codes)}
                  className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/20 transition"
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => setActive([])}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full text-zinc-400 hover:text-white transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* RIGHT: synthesis output */}
          <div className="lg:col-span-2">
            <SynthesisPanel result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceSynthesizer;
