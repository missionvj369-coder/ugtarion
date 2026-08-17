import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeConsciousCivilizationPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Conscious Civilization — UGT Knowledge Library',
      'A civilization that knows itself — its patterns, its consequences, its trajectory — and can deliberately steer toward outcomes that expand life, dignity, and understanding.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Conscious Civilization" 
        subtitle="A civilization that knows itself and can deliberately steer toward life-expanding outcomes."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What is a Conscious Civilization?" 
        lead="Consciousness is not just for individuals. It is a property of systems."
      >
        <Block>
          <P>
            A Conscious Civilization is one that possesses systemic self-awareness: it monitors its own vital signs (ecological health, social cohesion, meaning indices, technological alignment), understands the causal relationships between its choices and their consequences, and possesses the governance capacity to adjust course deliberately rather than reactively.
          </P>
          <P className="mt-4">
            This is not a metaphor. Just as an individual consciousness integrates sensory input, memory, values, and intention to navigate the world, a civilizational consciousness integrates data, knowledge, ethics, and collective will to navigate the future. The difference is substrate: neurons vs. institutions, sensors, and shared protocols.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why Civilizational Consciousness Is Essential" 
        lead="An unconscious civilization is a civilization on autopilot — and autopilot flies into mountains."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="The Feedback Gap">
            <P>
              Current civilization has powerful sensors (satellites, markets, social media) but weak integration. Signals of distress — biodiversity loss, mental health crises, algorithmic polarization — arrive but do not reliably trigger corrective action. Conscious Civilization closes the loop between signal and response.
            </P>
          </Block>
          <Block title="Agency at Scale">
            <P>
              Without systemic consciousness, humanity is a passenger on a vehicle no one is driving. With it, we become the driver. This is the only way to navigate the narrow passages ahead: AI alignment, climate stability, nuclear risk, synthetic biology. These require deliberate, coordinated, wise action — not market forces alone.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="Conscious Civilization is the container that makes the other concepts possible."
      >
        <Block>
          <P>
            <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a> produces the individuals capable of participating in a conscious civilization. <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> provides the cognitive architecture. <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a> builds the institutions. <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a> is the measured outcome. <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a> is the aspirational horizon.
          </P>
          <P className="mt-4">
            Conscious Civilization is the operating system that runs these applications. Without it, they remain isolated experiments. With it, they become a coherent civilizational trajectory.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="Building the Nervous System" 
        lead="UGT works on the infrastructure of civilizational consciousness."
      >
        <Block>
          <P>
            This includes: planetary dashboards that make civilizational health visible to all; governance protocols that translate evidence into action; education systems that cultivate systemic thinking; economic metrics that replace GDP with flourishing indices; and <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> as the participation layer that lets every human contribute to the collective sensorium.
          </P>
          <P className="mt-4">
            A Conscious Civilization is not a finished state. It is a capacity that deepens over time — like individual consciousness, it develops, learns, and matures. UGT's role is to seed the structures that make this development possible.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Architecture" 
        subtitle="Conscious Civilization emerges from the integration of multiple intelligences."
        primaryLabel="Integrated Intelligence"
        primaryTo="/knowledge/integrated-intelligence"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeConsciousCivilizationPage;