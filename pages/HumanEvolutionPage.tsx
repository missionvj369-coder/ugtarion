import React from 'react';
import { PageHero, ContentSection, P, Block, CTAButton } from './PageKit';

const HumanEvolutionPage: React.FC = () => {
  return (
    <>
      <PageHero
        eyebrow="Evolutionary Framework"
        title="Human Evolution"
        subtitle="Beyond technological advancement: the expansion of consciousness, wisdom, and the capacity to relate."
      />

      <ContentSection
        eyebrow="The Core Thesis"
        title="Evolution as Conscious Expansion"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            UGT views human evolution not as a biological accident or a purely technological trajectory, but as a conscious process of expansion.
          </P>
          <P>
            True evolution occurs when our internal capacity for consciousness, empathy, and wisdom grows in tandem with our external capabilities.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="Dimensions of Growth" title="The Evolutionary Pillars" className="bg-white/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Block title="Consciousness & Awareness">
            <P>
              Developing the ability to observe the self and the system, moving from reactive existence to conscious participation in the unfolding of the universe.
            </P>
          </Block>
          <Block title="Wisdom & Judgment">
            <P>
              The synthesis of knowledge and experience into a capacity for right action—knowing not just how to do something, but why and when it should be done.
            </P>
          </Block>
          <Block title="Responsibility & Stewardship">
            <P>
              Recognizing the interconnectedness of all life and accepting the responsibility to safeguard the planetary future for all sentient beings.
            </P>
          </Block>
          <Block title="Compassion & Oneness">
            <P>
              The transition from fragmented identity to a realization of shared humanity and cosmic alignment, reducing suffering through collective empathy.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="The Path Forward"
        title="From Fragmented to Integrated"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            The goal of human evolution within the UGT framework is the integration of the individual with the collective, and the collective with the cosmic order.
          </P>
          <CTAButton label="Explore Integrated Intelligence" to="/integrated-intelligence" variant="primary" />
        </div>
      </ContentSection>
    </>
  );
};

export default HumanEvolutionPage;