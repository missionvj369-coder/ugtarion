/**
 * Universal Guard Trust — Integrated Intelligence knowledge base & synthesis engine.
 *
 * Fully client-side, deterministic, no-API "intelligence" engine. It contains
 * no secrets and makes no network calls. Everything here is inspectable and
 * reusable — an embodiment of UGT's Openness principle. The same inputs always
 * produce the same synthesis, so the reasoning can be examined.
 */

export type IntelligenceCode =
  | 'HI' | 'AI' | 'SI' | 'CI' | 'EI' | 'CulI' | 'HIstI' | 'CrI' | 'SyI' | 'TI';

export interface IntelligenceColor {
  from: string;
  to: string;
  ring: string;
  text: string;
  glow: string;
}

export interface Intelligence {
  code: IntelligenceCode;
  name: string;
  short: string;
  essence: string;
  contribution: string;
  color: IntelligenceColor;
  perspective: (topic: string, others: IntelligenceCode[]) => string;
}

export const INTELLIGENCES: Intelligence[] = [
  {
    code: 'HI',
    name: 'Human Intelligence',
    short: 'Human',
    essence: 'Experience, empathy, judgment, values and lived knowledge.',
    contribution: 'Centers dignity, meaning and lived human experience.',
    color: { from: '#fbbf24', to: '#f59e0b', ring: 'ring-amber-400/60', text: 'text-amber-300', glow: 'shadow-amber-500/40' },
    perspective: (topic) =>
      `${cap(topic)} must be judged by whether it expands human dignity, agency and the capacity to flourish — not merely by whether it is efficient.`,
  },
  {
    code: 'AI',
    name: 'Artificial Intelligence',
    short: 'Artificial',
    essence: 'Analysis, synthesis, simulation and discovery at scale.',
    contribution: 'Surfaces patterns and models possibilities across scale.',
    color: { from: '#818cf8', to: '#6366f1', ring: 'ring-indigo-400/60', text: 'text-indigo-300', glow: 'shadow-indigo-500/40' },
    perspective: (topic) =>
      `Within ${topic}, machine analysis can model countless scenarios and reveal structures invisible to unaided intuition — provided its outputs remain answerable to human intent.`,
  },
  {
    code: 'SI',
    name: 'Scientific Intelligence',
    short: 'Scientific',
    essence: 'Evidence, measurement, experimentation and verification.',
    contribution: 'Demands evidence before certainty.',
    color: { from: '#38bdf8', to: '#0ea5e9', ring: 'ring-sky-400/60', text: 'text-sky-300', glow: 'shadow-sky-500/40' },
    perspective: (topic) =>
      `Claims about ${topic} should be treated as hypotheses until tested — measured, compared against reality, and corrected when the evidence disagrees.`,
  },
  {
    code: 'CI',
    name: 'Collective Intelligence',
    short: 'Collective',
    essence: 'Distributed experience, local knowledge and collaboration.',
    contribution: 'Gathers many perspectives into shared understanding.',
    color: { from: '#34d399', to: '#10b981', ring: 'ring-emerald-400/60', text: 'text-emerald-300', glow: 'shadow-emerald-500/40' },
    perspective: (topic) =>
      `Wisdom about ${topic} is distributed across many people and communities; the task is to convene those perspectives without flattening their differences.`,
  },
  {
    code: 'EI',
    name: 'Ecological Intelligence',
    short: 'Ecological',
    essence: 'Understanding the living systems of the planet.',
    contribution: 'Reads human choices within living ecological limits.',
    color: { from: '#4ade80', to: '#22c55e', ring: 'ring-green-400/60', text: 'text-green-300', glow: 'shadow-green-500/40' },
    perspective: (topic) =>
      `Any approach to ${topic} must remain compatible with the living systems that sustain life — soil, water, climate and biodiversity are not externalities but foundations.`,
  },
  {
    code: 'CulI',
    name: 'Cultural Intelligence',
    short: 'Cultural',
    essence: 'Wisdom embedded in diverse human traditions.',
    contribution: 'Honors many ways of knowing without forcing one.',
    color: { from: '#f472b6', to: '#ec4899', ring: 'ring-pink-400/60', text: 'text-pink-300', glow: 'shadow-pink-500/40' },
    perspective: (topic) =>
      `${cap(topic)} is understood differently across cultures; a durable answer draws on that plurality rather than imposing a single tradition as universal.`,
  },
  {
    code: 'HIstI',
    name: 'Historical Intelligence',
    short: 'Historical',
    essence: 'Learning from the patterns of the past.',
    contribution: 'Reads the present against long patterns of change.',
    color: { from: '#a78bfa', to: '#8b5cf6', ring: 'ring-violet-400/60', text: 'text-violet-300', glow: 'shadow-violet-500/40' },
    perspective: (topic) =>
      `History offers ${topic} a mirror: civilizations have faced analogous turning points, and their successes and failures are data we would be foolish to ignore.`,
  },
  {
    code: 'CrI',
    name: 'Creative Intelligence',
    short: 'Creative',
    essence: 'Imagining and manifesting new possibilities.',
    contribution: 'Opens possibilities that analysis alone cannot reach.',
    color: { from: '#fb7185', to: '#f43f5e', ring: 'ring-rose-400/60', text: 'text-rose-300', glow: 'shadow-rose-500/40' },
    perspective: (topic) =>
      `Beyond what is, creativity asks what could be — ${topic} is an invitation to imagine forms that do not yet exist and bring them into being.`,
  },
  {
    code: 'SyI',
    name: 'Systems Intelligence',
    short: 'Systems',
    essence: 'Interconnectedness and feedback loops of complex wholes.',
    contribution: 'Sees relationships, feedback and second-order effects.',
    color: { from: '#22d3ee', to: '#06b6d4', ring: 'ring-cyan-400/60', text: 'text-cyan-300', glow: 'shadow-cyan-500/40' },
    perspective: (topic) =>
      `${cap(topic)} is not a single problem but a web of feedback loops; changing one part ripples through the whole, so interventions must be chosen with the system in view.`,
  },
  {
    code: 'TI',
    name: 'Technological Intelligence',
    short: 'Technological',
    essence: 'Applying tools to extend human capability.',
    contribution: 'Turns understanding into working capability.',
    color: { from: '#94a3b8', to: '#64748b', ring: 'ring-slate-400/60', text: 'text-slate-300', glow: 'shadow-slate-500/40' },
    perspective: (topic) =>
      `Technology gives ${topic} leverage — but a tool is only as wise as the intention behind it, so capability must be paired with responsibility.`,
  },
];

export const INTELLIGENCE_BY_CODE: Record<IntelligenceCode, Intelligence> =
  INTELLIGENCES.reduce((acc, i) => {
    acc[i.code] = i;
    return acc;
  }, {} as Record<IntelligenceCode, Intelligence>);


/* ------------------------------------------------------------------ *
 * Synthesis engine
 * ------------------------------------------------------------------ */

export interface SynthesisPerspective {
  code: IntelligenceCode;
  name: string;
  text: string;
  color: IntelligenceColor;
}

export interface Synthesis {
  topic: string;
  active: IntelligenceCode[];
  perspectives: SynthesisPerspective[];
  emergent: string[];
  integration: string;
  coherence: number; // 0–100
  balance: string;
}

const DEFAULT_TOPIC = 'conscious civilization';

function cap(s: string): string {
  const t = s.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Curated emergent insights for specific combinations. */
const EMERGENT_PAIRINGS: Array<{ key: string; line: string }> = [
  { key: 'HI+AI', line: 'Human judgment guides machine analysis — augmentation, never replacement.' },
  { key: 'HI+SI', line: 'Lived experience is held against evidence, so neither anecdote nor abstraction wins alone.' },
  { key: 'AI+SI', line: 'Machine-generated hypotheses meet experimental verification — discovery with a checkpoint.' },
  { key: 'CI+CulI', line: 'Many cultures converge in conversation without collapsing into a single voice.' },
  { key: 'EI+SyI', line: 'Living systems and feedback loops are read together, revealing limits before they are crossed.' },
  { key: 'HI+CrI', line: 'Empathy fuels imagination: what is felt deeply becomes what is newly possible.' },
  { key: 'SI+HIstI', line: 'Evidence is deepened by time — the past becomes a laboratory for the present.' },
  { key: 'TI+SyI', line: 'Tools are evaluated by their systemic consequences, not only their immediate function.' },
  { key: 'AI+SyI', line: 'Computation reveals the structure of complex wholes that resist linear reasoning.' },
  { key: 'CI+SyI', line: 'Distributed knowledge maps onto distributed systems — the crowd sees the web.' },
  { key: 'EI+CulI', line: 'Ancestral land-wisdom and ecology meet: reciprocity as both ethic and strategy.' },
  { key: 'CrI+TI', line: 'Imagination is given hands — creative vision becomes working capability.' },
  { key: 'HI+EI', line: 'Human flourishing is nested within planetary flourishing; the two rise or fall together.' },
  { key: 'SI+EI', line: 'Evidence-grounded stewardship: measure the living world before presuming to manage it.' },
];

/** Especially complementary pairings feed the coherence score. */
const COMPLEMENTARY_PAIRS: Array<[IntelligenceCode, IntelligenceCode]> = [
  ['HI', 'AI'],
  ['HI', 'SI'],
  ['AI', 'SI'],
  ['CI', 'CulI'],
  ['EI', 'SyI'],
  ['SI', 'HIstI'],
  ['CrI', 'TI'],
  ['HI', 'EI'],
];

function emergentLines(codes: IntelligenceCode[]): string[] {
  const set = new Set(codes);
  const lines: string[] = [];
  for (const { key, line } of EMERGENT_PAIRINGS) {
    const [a, b] = key.split('+') as [IntelligenceCode, IntelligenceCode];
    if (set.has(a) && set.has(b)) lines.push(line);
  }
  return lines;
}

function coherenceScore(codes: IntelligenceCode[]): number {
  if (codes.length === 0) return 0;
  const set = new Set(codes);
  let complementarity = 0;
  for (const [a, b] of COMPLEMENTARY_PAIRS) {
    if (set.has(a) && set.has(b)) complementarity++;
  }
  const diversity = Math.min(codes.length, 6) / 6; // 0..1
  const compFactor = Math.min(complementarity, 5) / 5; // 0..1
  const countFactor = codes.length >= 3 && codes.length <= 6 ? 1 : 0.55;
  const raw = (diversity * 0.4 + compFactor * 0.45 + countFactor * 0.15) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function balanceLabel(codes: IntelligenceCode[]): string {
  const n = codes.length;
  if (n === 0) return 'Dormant — no intelligence is engaged.';
  if (n === 1) return 'Single-lens — clear, but easily blind to its own limits.';
  if (n === 2) return 'Dialogic — two views in tension begin to correct each other.';
  if (n <= 4) return 'Integrated — multiple forms of knowing now reinforce one another.';
  if (n <= 6) return 'Synthetic — a rich field where intelligence compounds.';
  return 'Saturated — more voices than a single mind can weigh; risk of noise.';
}

function integrationStatement(topic: string, codes: IntelligenceCode[], emergent: string[]): string {
  if (codes.length === 0) {
    return `Select two or more forms of intelligence to synthesize a perspective on ${topic}.`;
  }
  const names = codes.map((c) => INTELLIGENCE_BY_CODE[c].name.toLowerCase());
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  const emergentClause = emergent.length
    ? ` Together they produce something none holds alone: ${emergent[0].charAt(0).toLowerCase()}${emergent[0].slice(1)}`
    : '';
  return `Read through ${list}, ${topic} reveals itself as a problem no single form of knowing can solve.${emergentClause} The task is not to crown one intelligence, but to let each correct and strengthen the others.`;
}

/**
 * The synthesis engine. Deterministic and transparent: identical inputs always
 * yield identical output, so the reasoning is fully inspectable.
 */
export function synthesize(topicInput: string, activeCodes: IntelligenceCode[]): Synthesis {
  const topic = (topicInput.trim() || DEFAULT_TOPIC).toLowerCase();
  const active = INTELLIGENCES.filter((i) => activeCodes.includes(i.code)).map((i) => i.code);
  const perspectives: SynthesisPerspective[] = active.map((code) => {
    const intel = INTELLIGENCE_BY_CODE[code];
    return { code, name: intel.name, text: intel.perspective(topic, active), color: intel.color };
  });
  const emergent = emergentLines(active);
  return {
    topic,
    active,
    perspectives,
    emergent,
    integration: integrationStatement(topic, active, emergent),
    coherence: coherenceScore(active),
    balance: balanceLabel(active),
  };
}

/** A few curated starting points so the field is never empty on first load. */
export const SUGGESTED_TOPICS = [
  'conscious civilization',
  'the future of education',
  'healing the planet',
  'trust between strangers',
  'raising a generation',
];



