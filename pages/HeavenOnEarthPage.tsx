import React, { useEffect } from 'react';
import { updatePageMetadata } from '../lib/seo';
import { PageHero, ContentSection, P, Block, CTAButton } from './PageKit';

const HeavenOnEarthPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Heaven on Earth — Universal Guard Trust',
      'The civilizational direction toward the perfection of creation, reducing suffering and expanding human dignity through conscious participation.'
    );
  }, []);

  return (
    <>
      <PageHero
        eyebrow="The Civilizational Direction"
        title="Heaven on Earth"
        subtitle="Not a destination, but a direction: the progressive restoration of creation through conscious human participation."
      />

      <ContentSection
        eyebrow="The Definition"
        title="A Direction, Not a Declaration"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            UGT presents 'Heaven on Earth' not as a supernatural claim or a declaration that perfection has already been achieved, but as a civilizational direction.
          </P>
          <P>
            It is the aspiration toward the perfection of creation being progressively restored through conscious human participation: reducing unnecessary suffering, strengthening human dignity, and expanding the capacity for love and understanding.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Restoration" title="Pillars of Restoration" className="bg-white/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Block title="Reducing Suffering">
            <P>
              Addressing the foundational needs of humanity—food, water, health, and shelter—to eliminate the systemic causes of unnecessary suffering.
            </P>
          </Block>
          <Block title="Restoring Dignity">
            <P>
              Creating systems where every individual is recognized as a valuable contributor to the collective, with access to the tools for their own evolution.
            </P>
          </Block>
          <Block title="Ecological Alignment">
            <P>
              Moving from a relationship of exploitation to one of stewardship, restoring the balance between human civilization and the living world.
            </P>
          </Block>
          <Block title="Cosmic Harmony">
            <P>
              Aligning human activity with the broader laws of the universe, ensuring that our growth as a species is sustainable and harmonious.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="The Participation"
        title="How We Get There"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            This restoration is not the work of a few, but the collective effort of all who recognize their role in the unfolding of consciousness.
          </P>
          <CTAButton label="Claim Your Universal ID" to="/universal-id" variant="primary" />
        </div>
      </ContentSection>
    </>
  );
};

export default HeavenOnEarthPage;