import React from 'react';
import { PageHero, ContentSection, P, PillarGrid, CTASection, FlowDisplay, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

interface BlueprintPageProps {
  onOpenIdModal: () => void;
}

const blueprintSystems = [
  { title: 'Human System', description: 'Understand the human journey from the first breath through development, relationships, learning, identity, work, love, responsibility, aging, death and legacy.' },
  { title: 'Consciousness System', description: 'Explore the inner world. Consciousness, perception, attention, memory, self, emotion, dreams, meditation, meaning, neuroscience and philosophy.' },
  { title: 'Truth Engine', description: 'Create a disciplined way to examine what humanity believes it knows. Evidence before certainty.' },
  { title: 'Knowledge Engine', description: 'Bring humanity\'s fields of knowledge into conversation. Physics, mathematics, chemistry, history, philosophy, culture and more.' },
  { title: 'Integrated Intelligence', description: 'HI × AI × SI × CI. Human, artificial, scientific and collective intelligence working together.' },
  { title: 'Human Needs', description: 'Food, water, shelter, health, education, safety, opportunity, connection, meaning, freedom and dignity.' },
  { title: 'Planetary System', description: 'Civilization exists within Earth. Atmosphere, oceans, soil, forests, biodiversity, water, energy and climate.' },
  { title: 'Food & Water', description: 'Agriculture, soil, seeds, irrigation, distribution, purification, conservation, regeneration and access.' },
  { title: 'Health', description: 'Prevention, public health, research, nutrition, medical access, mental wellbeing and health education.' },
  { title: 'Education', description: 'Universal access to knowledge, critical thinking, scientific literacy, creative education and lifelong learning.' },
  { title: 'Intelligence & Technology', description: 'AI, robotics, biotechnology, materials, computing, quantum, energy, space and advanced manufacturing.' },
  { title: 'Civilization System', description: 'Governance, economics, education, culture, technology, cities, cooperation, justice and participation.' },
  { title: 'Peace System', description: 'Conflict prevention, dialogue, trust, humanitarian systems, reconciliation and peace education.' },
  { title: 'Creation System', description: 'Films, visual education, interactive experiences, open tools and creative projects that enter reality.' },
];

const truthTiers = [
  { title: 'Established', description: 'Supported by strong evidence and repeated verification.' },
  { title: 'Probable / Strong Evidence', description: 'Supported by substantial evidence while remaining open to further examination.' },
  { title: 'Hypothesis', description: 'A proposed explanation requiring investigation and testing.' },
  { title: 'Unknown', description: 'A question for which sufficient knowledge does not yet exist.' },
];

const civilizationLoop = ['Observe', 'Question', 'Research', 'Connect', 'Hypothesize', 'Test', 'Build', 'Deploy', 'Measure', 'Correct', 'Open', 'Learn', 'Evolve'];

const BlueprintPage: React.FC<BlueprintPageProps> = ({ onOpenIdModal }) => {
  return (
    <>
      <PageHero
        eyebrow="Blueprint"
        title="The Master Blueprint"
        subtitle="One vision. Many systems. One continuous search for truth, human flourishing and creation."
      />

      <ContentSection
        eyebrow="Introduction"
        title="Not a Finished Answer. A Living Architecture."
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <P>Humanity is not a collection of isolated problems.</P>
          <P>
            Every human life exists within a web of biological, psychological, social, technological,
            ecological and civilizational systems.
          </P>
          <P>
            The Blueprint brings those systems into one connected field of inquiry. Not as a finished answer.
            As a living architecture for investigation, creation and continuous learning.
          </P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="15 Systems"
        title="One Architecture. Many Interconnected Systems."
        center
        className="bg-white/40"
        id="systems"
      >
        <PillarGrid items={blueprintSystems} />
      </ContentSection>

      <ContentSection eyebrow="The Truth Engine" title="Evidence Before Certainty">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
          {truthTiers.map((tier) => (
            <div key={tier.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h4 className="font-medium text-zinc-900 mb-2">{tier.title}</h4>
              <P>{tier.description}</P>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection eyebrow="Integrated Intelligence" title="HI × AI × SI × CI" className="bg-white/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Human Intelligence</h4>
            <P>Experience. Empathy. Creativity. Judgment. Values. Lived knowledge.</P>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Artificial Intelligence</h4>
            <P>Analysis. Synthesis. Simulation. Pattern recognition. Discovery.</P>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Scientific Intelligence</h4>
            <P>Observation. Measurement. Experimentation. Verification. Evidence.</P>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Collective Intelligence</h4>
            <P>Distributed experience. Local knowledge. Collaboration. Community wisdom.</P>
          </div>
        </div>
        <div className="mt-8 max-w-3xl">
          <P>
            Together they create a larger intelligence field without making any single form of intelligence absolute.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Systems Are Connected" title="Nothing Exists Completely Alone" className="bg-white/40">
        <div className="flex flex-wrap gap-3 max-w-4xl">
          {[
            'Human health depends upon food',
            'Food depends upon water and soil',
            'Education shapes human capability',
            'Technology changes civilization',
            'Energy influences industry and cities',
            'Culture influences cooperation',
            'Knowledge influences every system',
            'Consciousness influences understanding'
          ].map((text) => (
            <span key={text} className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">
              {text}
            </span>
          ))}
        </div>
        <div className="mt-8 max-w-3xl space-y-3">
          <P>One system touches another.</P>
          <P>One human life touches the whole.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Civilization Loop" title="A Way of Moving" center>
        <FlowDisplay steps={civilizationLoop} label="Civilization Loop" />
        <div className="mt-12 max-w-3xl mx-auto space-y-4 text-center">
          <P>The Blueprint is therefore not a destination. It is a way of moving.</P>
          <P>A civilization that can observe itself. Question itself. Build. Measure. Admit what does not work. Learn. And begin again with greater understanding.</P>
        </div>
      </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Explore the Systems" to="/systems" />
              <CTAButton label="Enter the Creator Community" to="https://creatorcommunity.space/" variant="outline" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="The Blueprint Is Open."
        subtitle="The future remains unwritten."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
    </>
  );
};

export default BlueprintPage;