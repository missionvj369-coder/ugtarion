import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeHumanFlourishingPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Human Flourishing — UGT Knowledge Library',
      'Defining the conditions for the highest potential of human physical, mental, and spiritual existence within the UGT framework.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Human Flourishing" 
        subtitle="The realization of the highest potential in physical, mental, and spiritual dimensions."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What is Human Flourishing?" 
        lead="Flourishing is more than the absence of suffering; it is the presence of purpose and vitality."
      >
        <Block>
          <P>
            In the UGT framework, Human Flourishing is the state of being where an individual's innate capacities are fully realized and aligned with their purpose. It is a holistic measure of well-being that encompasses physical health, cognitive clarity, emotional resilience, and spiritual connection.
          </P>
          <P className="mt-4">
            Unlike traditional notions of success or happiness, flourishing is viewed as a dynamic process of growth—a continuous expansion of one's ability to contribute meaningfully to the world and the collective.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why Flourishing is the Primary Metric" 
        lead="A civilization that prioritizes GDP over flourishing is a civilization in decline."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Beyond Survival">
            <P>
              For too long, human systems have been designed for survival and efficiency. UGT shifts the focus to flourishing, recognizing that when individuals thrive, the entire system becomes more stable, creative, and empathetic.
            </P>
          </Block>
          <Block title="The Foundation of Peace">
            <P>
              Most systemic conflict arises from a lack of flourishing—from scarcity, alienation, or a loss of purpose. By creating the conditions for universal flourishing, we remove the root causes of civilization-scale instability.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="Individual flourishing is the building block of a transformed society."
      >
        <Block>
          <P>
            On a personal level, flourishing is achieved through the synergy of <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> and conscious growth. It allows the individual to move from a state of competition to a state of contribution.
          </P>
          <P className="mt-4">
            On a civilizational level, the pursuit of collective flourishing leads directly to <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a>. A society of flourishing individuals naturally gravitates toward transparency, cooperation, and the manifestation of <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a>.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="The Architecture of Flourishing" 
        lead="UGT creates the systemic support for the individual to thrive."
      >
        <Block>
          <P>
            The UGT vision is to replace extractive systems with generative ones. This includes the implementation of the <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> to ensure equitable access to resources and opportunities, and the creation of communities that prioritize mental and spiritual health as much as physical survival.
          </P>
          <P className="mt-4">
            We believe that flourishing is a universal right and a systemic necessity. The "Guard" protects the individual's right to their own path, while the "Trust" provides the collective support needed to reach the summit of their potential.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Deepen Your Journey" 
        subtitle="Flourishing is the result of a conscious evolution of the self and society."
        primaryLabel="Human Evolution"
        primaryTo="/knowledge/human-evolution"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeHumanFlourishingPage;