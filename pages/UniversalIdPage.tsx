import React from 'react';
import { PageHero, ContentSection, P, Block, CTAButton } from './PageKit';

const UniversalIdPage: React.FC<{ onOpenIdModal: () => void }> = ({ onOpenIdModal }) => {
  return (
    <>
      <PageHero
        eyebrow="Participation Layer"
        title="Universal ID"
        subtitle="Your unique identifier within the Universal Guard Trust ecosystem—a bridge between individual identity and collective contribution."
      />

      <ContentSection
        eyebrow="The Purpose"
        title="More Than an Identity"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            The Universal ID is not merely a registration record; it is a participation key. It signifies an individual's commitment to the conscious evolution of humanity and their alignment with the UGT framework.
          </P>
          <P>
            By claiming a Universal ID, you enter a global network of conscious leaders, creators, and thinkers dedicated to the transformation of civilization.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Function" title="How Universal ID Works" className="bg-white/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Block title="Verification of Intent">
            <P>
              The ID serves as a verification that the holder understands and aligns with the core purpose of UGT: the restoration of creation and the advancement of human flourishing.
            </P>
          </Block>
          <Block title="Ecosystem Access">
            <P>
              The ID provides a seamless way to interact with UGT's various systems, from the Master Blueprint to the practical projects within the Creator Community.
            </P>
          </Block>
          <Block title="Contribution Tracking">
            <P>
              As the framework evolves, the Universal ID will allow for the recognition of contributions to the collective knowledge and the practical implementation of civilizational fixes.
            </P>
          </Block>
          <Block title="Secure Sovereignty">
            <P>
              Built on principles of trust and security, the Universal ID ensures that your participation is sovereign and your identity is protected.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Join the Trust"
        title="Claim Your Place in the Evolution"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            The transition to a conscious civilization begins with the individual. Claiming your Universal ID is the first step in moving from a passive observer to an active participant.
          </P>
          <CTAButton label="Claim Your Universal ID Now" onClick={onOpenIdModal} />
        </div>
      </ContentSection>
    </>
  );
};

export default UniversalIdPage;