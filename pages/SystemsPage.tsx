import React, { useState, useEffect } from 'react';
import { PageHero, ContentSection, P, CTASection, CTAButton, FlowDisplay } from './PageKit';
import FadeIn from '../components/FadeIn';

interface SystemsPageProps {
  onOpenIdModal: () => void;
}

const systems = [
  {
    id: 1,
    title: 'Human System',
    description: 'The human being at the center. Development, relationships, learning, health, identity, capability, work, meaning and lifelong flourishing.',
    connections: ['Consciousness', 'Education', 'Health', 'Civilization', 'Creation']
  },
  {
    id: 2,
    title: 'Consciousness System',
    description: 'The inner dimension of human existence. Awareness, perception, attention, memory, identity, experience, meaning and the continuing investigation of consciousness.',
    connections: ['Human', 'Knowledge', 'Intelligence', 'Ancient Intelligence']
  },
  {
    id: 3,
    title: 'Truth Engine',
    description: 'A framework for approaching reality through investigation rather than assumption. Evidence, comparison, questioning, verification, uncertainty and continuous correction. The objective is not to manufacture certainty. It is to become better at discovering what is true.',
    connections: ['Knowledge', 'Science', 'History', 'Intelligence']
  },
  {
    id: 4,
    title: 'Knowledge Engine',
    description: "Humanity's accumulated understanding brought into relationship. Science, history, philosophy, culture, literature, mathematics, technology, traditional knowledge and emerging discoveries. Knowledge becomes more powerful when connections between fields can be discovered.",
    connections: ['Truth', 'Intelligence', 'Education', 'Ancient Intelligence']
  },
  {
    id: 5,
    title: 'Intelligence Framework',
    description: 'Different forms of intelligence working together. Human reasoning. Artificial intelligence. Scientific investigation. Collective intelligence. The purpose is not to replace one form with another. It is to combine complementary capabilities responsibly. HI × AI × SI × CI',
    connections: ['Knowledge', 'Technology', 'Human', 'Civilization']
  },
  {
    id: 6,
    title: 'Human Needs',
    description: 'The foundations required for human flourishing. Food. Water. Health. Safety. Education. Housing. Relationships. Opportunity. Meaning. Agency. Connection. Human needs provide a practical reference point for civilizational development.',
    connections: ['Every major system']
  },
  {
    id: 7,
    title: 'Planetary System',
    description: 'Human civilization exists within a living planetary system. Climate. Water. Soil. Oceans. Forests. Biodiversity. Energy. Natural resources. Ecological cycles. The question is how human development can remain compatible with the systems that sustain life.',
    connections: ['Food & Water', 'Energy', 'Health', 'Civilization']
  },
  {
    id: 8,
    title: 'Food & Water System',
    description: 'The systems that sustain life every day. Agriculture. Soil. Water. Food production. Nutrition. Distribution. Regeneration. Local resilience. A civilization capable of nourishing its people while restoring its ecological foundations becomes more resilient.',
    connections: ['Planetary', 'Health', 'Community', 'Civilization']
  },
  {
    id: 9,
    title: 'Health System',
    description: 'Human health across the entire life journey. Prevention. Knowledge. Nutrition. Environment. Medicine. Technology. Public health. Care. Healthy people create greater capacity for families, communities and civilization.',
    connections: ['Human', 'Food & Water', 'Education', 'Technology']
  },
  {
    id: 10,
    title: 'Education System',
    description: 'The continuous transmission and creation of knowledge. Childhood learning. Scientific literacy. Critical thinking. Skills. Creativity. Technology. Local knowledge. Lifelong learning. Education becomes a civilizational capability when every generation can learn from the knowledge of those before it while creating knowledge for those who follow.',
    connections: ['Human', 'Knowledge', 'Intelligence', 'Creation']
  },
  {
    id: 11,
    title: 'Intelligence & Technology System',
    description: 'The tools humanity creates to extend its capabilities. Artificial intelligence. Computing. Robotics. Biotechnology. Energy technologies. Advanced materials. Simulation. Space technologies. Human-machine collaboration. Powerful tools require equally powerful responsibility.',
    connections: ['Intelligence', 'Knowledge', 'Human', 'Civilization']
  },
  {
    id: 12,
    title: 'Ancient Intelligence System',
    description: "Humanity's accumulated wisdom across civilizations and generations. Texts. Philosophies. Mythologies. Scientific traditions. Contemplative traditions. Cultural knowledge. Historical experience. UGT approaches inherited knowledge with both reverence and investigation — preserving what can teach us, questioning what requires examination, and allowing evidence and discovery to continue.",
    connections: ['Consciousness', 'Knowledge', 'Truth', 'Human']
  },
  {
    id: 13,
    title: 'Civilization System',
    description: 'The structures through which billions of people live together. Economics. Governance. Cities. Infrastructure. Culture. Technology. Institutions. Cooperation. Trade. Law. Civilization is not finished. It is continuously designed by the choices humanity makes.',
    connections: ['Every major system']
  },
  {
    id: 14,
    title: 'Peace System',
    description: 'The conditions that allow human beings and societies to coexist and create together. Dialogue. Understanding. Justice. Cooperation. Conflict prevention. Shared interests. Cross-cultural exchange. Peace is not simply the absence of conflict. It is the capacity to build conditions in which cooperation becomes possible.',
    connections: ['Human', 'Community', 'Civilization', 'Global Cooperation']
  },
  {
    id: 15,
    title: 'Creation System',
    description: 'The movement from understanding into reality. Question. Research. Design. Build. Test. Measure. Improve. Share. Replicate. Creation is where intelligence becomes action.',
    connections: ['Every system']
  }
];

const intelligenceTypes = [
  { title: 'Human Intelligence', description: 'Experience. Empathy. Imagination. Judgment. Values. Lived knowledge.' },
  { title: 'Artificial Intelligence', description: 'Analysis. Synthesis. Pattern recognition. Simulation. Knowledge navigation. Creation.' },
  { title: 'Scientific Intelligence', description: 'Observation. Evidence. Experimentation. Measurement. Verification. Correction.' },
  { title: 'Collective Intelligence', description: 'Many people. Many perspectives. Many experiences. Many communities. Shared learning.' }
];

const loopSteps = ['Understand', 'Connect', 'Create', 'Test', 'Measure', 'Learn', 'Evolve'];

const SystemsPage: React.FC<SystemsPageProps> = ({ onOpenIdModal }) => {
  const [selectedSystem, setSelectedSystem] = useState<number | null>(null);
  const [visibleSystems, setVisibleSystems] = useState<Set<number>>(new Set());

  // Auto-expand systems as they scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number((entry.target as HTMLElement).dataset.systemId);
            if (!isNaN(id)) {
              setVisibleSystems(prev => {
                const next = new Set(prev);
                next.add(id);
                return next;
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('[data-system-id]');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Systems"
        title="The UGT Systems Field"
        subtitle="One interconnected architecture for understanding humanity, intelligence, civilization and transformation."
      />

      {/* Systems Map */}
      <ContentSection
        eyebrow="Systems Map"
        title="Interactive Visual Field"
        center
        id="systems"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-zinc-600 text-sm sm:text-base font-light leading-relaxed text-center mb-10">
            Humanity is not a collection of separate problems. Human life, consciousness, knowledge, technology, nature, economy, culture and civilization continuously influence one another. UGT brings these dimensions into one connected field so that relationships become visible, possibilities become easier to explore, and ideas can move toward creation.
          </p>
          
          {/* Interactive Systems Grid - Auto-expands on scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systems.map((system) => {
              const isExpanded = selectedSystem === system.id || visibleSystems.has(system.id);
              return (
                <button
                  key={system.id}
                  data-system-id={system.id}
                  onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                    isExpanded
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg'
                      : 'bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-md'
                  }`}
                  aria-expanded={isExpanded}
                >
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${isExpanded ? 'text-amber-300' : 'text-zinc-400'}`}>
                    {String(system.id).padStart(2, '0')}
                  </p>
                  <h4 className={`text-base font-medium mb-2 ${isExpanded ? 'text-white' : 'text-zinc-900'}`}>
                    {system.title}
                  </h4>
                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      <p className={`text-sm font-light leading-relaxed ${isExpanded ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {system.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {system.connections.map((conn) => (
                          <span key={conn} className={`px-2 py-0.5 text-[10px] rounded-full ${isExpanded ? 'bg-white/10 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                            {conn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </ContentSection>

      {/* Intelligence Layer */}
      <ContentSection eyebrow="The Intelligence Layer" title="HI × AI × SI × CI" center className="bg-white/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {intelligenceTypes.map((type) => (
            <div key={type.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h4 className="font-medium text-zinc-900 mb-2">{type.title}</h4>
              <P className="text-sm">{type.description}</P>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-3xl mx-auto text-center">
          <P>When these forms of intelligence work together responsibly, civilization gains a larger capacity to understand and create.</P>
        </div>
      </ContentSection>

      {/* Continuous Loop */}
      <ContentSection eyebrow="The Continuous Loop" title="UNDERSTAND → CONNECT → CREATE → TEST → MEASURE → LEARN → EVOLVE" center>
        <FlowDisplay steps={loopSteps} label="The Loop" />
        <div className="mt-10 max-w-3xl mx-auto space-y-4 text-center">
          <P>The loop continues.</P>
          <P>A system reveals relationships. A relationship reveals an opportunity. An opportunity becomes a question. A question becomes an idea. An idea becomes a project. A project enters reality. Reality produces evidence. Evidence produces learning. Learning improves the next project.</P>
          <P className="font-medium text-zinc-900">This is how the architecture becomes action.</P>
        </div>
      </ContentSection>

      {/* One Field */}
      <ContentSection eyebrow="One Field" title="They Are Not Isolated Worlds" center className="bg-white/40">
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {['Humanity', 'Consciousness', 'Knowledge', 'Truth', 'Intelligence', 'Needs', 'Planet', 'Food', 'Water', 'Health', 'Education', 'Technology', 'Ancient knowledge', 'Civilization', 'Peace', 'Creation'].map((item) => (
            <span key={item} className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-8 max-w-3xl mx-auto text-center">
          <P>They are parts of one living field. The deeper the connections become visible, the greater our ability to act intelligently within them.</P>
        </div>
      </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Explore the Projects" to="/projects" />
              <CTAButton label="Enter the Creator Community" to="https://creatorcommunity.space/" variant="outline" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Explore. Connect. Create."
        subtitle="The systems are here to be explored. The relationships are here to be questioned. The possibilities are here to be built."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
    </>
  );
};

export default SystemsPage;