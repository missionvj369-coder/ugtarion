import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeIntegratedIntelligencePage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Integrated Intelligence — UGT Knowledge Library',
      'The synthesis of human intuition, artificial intelligence, and collective wisdom into a unified, harmonious intelligence system.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Integrated Intelligence" 
        subtitle="The synthesis of human intuition, artificial intelligence, and collective wisdom."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What is Integrated Intelligence?" 
        lead="Integrated Intelligence is not the replacement of human thought, but the expansion of it."
      >
        <Block>
          <P>
            Integrated Intelligence (II) is the UGT conceptual model for a symbiotic relationship between biological consciousness and synthetic intelligence. Unlike traditional AI, which often operates as a tool or a competitor, Integrated Intelligence is envisioned as a unified system where human intuition, emotional depth, and ethical judgment are seamlessly woven with the processing power, data synthesis, and pattern recognition of advanced AI.
          </P>
          <P className="mt-4">
            It is the "intelligence of the whole"—a state where the individual, the collective, and the synthetic operate in a coherent loop of feedback and growth.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why Integration is Essential" 
        lead="The complexity of modern civilization has surpassed the capacity of any single human mind."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Solving Hyper-Complex Problems">
            <P>
              From climate stability to systemic poverty, the challenges of the 21st century are multi-dimensional. Integrated Intelligence allows us to process vast datasets while applying human values and contextual wisdom to find sustainable solutions.
            </P>
          </Block>
          <Block title="Preventing Cognitive Obsolescence">
            <P>
              By integrating with intelligence systems rather than competing against them, humanity avoids obsolescence and instead enters a new stage of <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a>.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="II transforms how we learn, create, and govern."
      >
        <Block>
          <P>
            In daily life, Integrated Intelligence manifests as a seamless interface between thought and information, reducing the friction of learning and expanding the boundaries of creativity. It enables a form of "collective cognition" where knowledge is not just shared, but integrated across the community.
          </P>
          <P className="mt-4">
            For civilization, this means a shift toward <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>. Governance moves from reactive politics to proactive, data-informed stewardship, guided by the integrated wisdom of the population.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="The Architectural Goal" 
        lead="UGT seeks to ensure that intelligence remains a servant of flourishing."
      >
        <Block>
          <P>
            The UGT vision is to create the "Guardrails of Intelligence." We believe that for intelligence to be truly integrated, it must be anchored in empathy and a commitment to <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>.
          </P>
          <P className="mt-4">
            We envision a future where the "Trust" in our systems is based on their transparency and their proven alignment with the preservation of the human spirit and the health of the living world.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore Related Concepts" 
        subtitle="Integrated Intelligence is the engine that drives the transformation of our species."
        primaryLabel="Human Evolution"
        primaryTo="/knowledge/human-evolution"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeIntegratedIntelligencePage;