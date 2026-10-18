/**
 * Universal Guard Trust — Blueprint knowledge graph.
 *
 * The 15 systems of the UGT Blueprint and the real relationships between
 * them (mirrored from pages/SystemsPage.tsx). Pure data — no network, no keys.
 * Consumed by the BlueprintConstellation force-directed visualization.
 */

export interface GraphNode {
  id: string;
  label: string;
  category: NodeCategory;
  description: string;
}

export type NodeCategory = 'core' | 'life' | 'knowledge' | 'world' | 'society' | 'creation';

export interface GraphLink {
  source: string;
  target: string;
}

export const CATEGORY_COLORS: Record<NodeCategory, { from: string; to: string }> = {
  core: { from: '#fde68a', to: '#f59e0b' },
  life: { from: '#fda4af', to: '#f43f5e' },
  knowledge: { from: '#a5b4fc', to: '#6366f1' },
  world: { from: '#6ee7b7', to: '#10b981' },
  society: { from: '#7dd3fc', to: '#0ea5e9' },
  creation: { from: '#f0abfc', to: '#c026d3' },
};

export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  core: 'Core',
  life: 'Life & Human',
  knowledge: 'Knowledge',
  world: 'Planetary',
  society: 'Society',
  creation: 'Creation',
};

export const GRAPH_NODES: GraphNode[] = [
  { id: 'human', label: 'Human System', category: 'core', description: 'The human being at the center. Development, relationships, learning, health, identity, capability, work, meaning and lifelong flourishing.' },
  { id: 'consciousness', label: 'Consciousness', category: 'core', description: 'The inner dimension. Awareness, perception, attention, memory, identity, experience, meaning and the continuing investigation of consciousness.' },
  { id: 'truth', label: 'Truth Engine', category: 'knowledge', description: 'Approaching reality through investigation rather than assumption. Evidence, comparison, questioning, verification and continuous correction.' },
  { id: 'knowledge', label: 'Knowledge Engine', category: 'knowledge', description: "Humanity's accumulated understanding brought into relationship. Science, history, philosophy, culture, mathematics and emerging discovery." },
  { id: 'intelligence', label: 'Intelligence Framework', category: 'knowledge', description: 'Different forms of intelligence working together — human, artificial, scientific, collective and beyond, combined responsibly.' },
  { id: 'needs', label: 'Human Needs', category: 'life', description: 'The foundations of flourishing. Food, water, health, safety, education, housing, relationships, opportunity, meaning, agency and connection.' },
  { id: 'planet', label: 'Planetary System', category: 'world', description: 'Civilization within a living planet. Climate, water, soil, oceans, forests, biodiversity, energy and ecological cycles.' },
  { id: 'food', label: 'Food & Water', category: 'life', description: 'The systems that sustain life daily. Agriculture, soil, water, food production, nutrition, distribution, regeneration and local resilience.' },
  { id: 'health', label: 'Health System', category: 'life', description: 'Human health across the life journey. Prevention, knowledge, nutrition, environment, medicine, technology, public health and care.' },
  { id: 'education', label: 'Education System', category: 'knowledge', description: 'The continuous transmission and creation of knowledge. Literacy, critical thinking, skills, creativity and lifelong learning.' },
  { id: 'technology', label: 'Intelligence & Technology', category: 'knowledge', description: 'Tools that extend human capability. AI, computing, robotics, biotechnology, energy, materials, simulation and space. Power demands responsibility.' },
  { id: 'ancient', label: 'Ancient Intelligence', category: 'knowledge', description: "Humanity's accumulated wisdom across civilizations. Texts, philosophies, contemplative and cultural traditions — held with reverence and investigation." },
  { id: 'civilization', label: 'Civilization System', category: 'society', description: 'The structures through which billions live together. Economics, governance, cities, infrastructure, culture, institutions, law and cooperation.' },
  { id: 'peace', label: 'Peace System', category: 'society', description: 'Conditions for coexistence and co-creation. Dialogue, understanding, justice, cooperation, conflict prevention and reconciliation.' },
  { id: 'creation', label: 'Creation System', category: 'creation', description: 'The movement from understanding into reality. Question, design, build, test, measure, improve, share, replicate. Intelligence becomes action.' },
];

export const GRAPH_LINKS: GraphLink[] = [
  { source: 'human', target: 'consciousness' },
  { source: 'human', target: 'food' },
  { source: 'human', target: 'health' },
  { source: 'human', target: 'education' },
  { source: 'human', target: 'needs' },
  { source: 'consciousness', target: 'knowledge' },
  { source: 'consciousness', target: 'intelligence' },
  { source: 'consciousness', target: 'ancient' },
  { source: 'truth', target: 'knowledge' },
  { source: 'truth', target: 'ancient' },
  { source: 'truth', target: 'intelligence' },
  { source: 'knowledge', target: 'intelligence' },
  { source: 'knowledge', target: 'education' },
  { source: 'knowledge', target: 'ancient' },
  { source: 'intelligence', target: 'technology' },
  { source: 'intelligence', target: 'human' },
  { source: 'needs', target: 'civilization' },
  { source: 'planet', target: 'food' },
  { source: 'planet', target: 'health' },
  { source: 'planet', target: 'civilization' },
  { source: 'food', target: 'health' },
  { source: 'health', target: 'education' },
  { source: 'health', target: 'technology' },
  { source: 'education', target: 'creation' },
  { source: 'technology', target: 'civilization' },
  { source: 'civilization', target: 'peace' },
  { source: 'civilization', target: 'creation' },
  { source: 'peace', target: 'human' },
  { source: 'peace', target: 'civilization' },
  { source: 'creation', target: 'human' },
  { source: 'creation', target: 'knowledge' },
  { source: 'ancient', target: 'human' },
  { source: 'intelligence', target: 'civilization' },
];

