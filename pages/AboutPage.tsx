import React from 'react';
import { PageHero, ContentSection, P, Block, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

const AboutPage: React.FC = () => {
  return (
    <>
      <PageHero
        eyebrow="About UGT"
        title="Universal Guard Trust"
        subtitle="A living framework dedicated to human evolution, human flourishing and the conscious transformation of civilization."
      />

      <ContentSection
        eyebrow="Our Identity"
        title="What is Universal Guard Trust?"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            Universal Guard Trust (UGT) is a living framework dedicated to the conscious evolution of humanity and the transformation of civilization. 
            It is not a static organization, but an evolving system of inquiry and action.
          </P>
          <P>
            UGT exists to explore how humanity can bring together different forms of intelligence, accumulated knowledge, human potential, technology, community and constructive action to create better conditions for life.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Framework" title="Core Pillars of UGT" className="bg-white/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Block title="Human Evolution">
            <P>
              UGT understands human evolution as a process extending beyond technological advancement, encompassing the development of consciousness, wisdom, responsibility, and compassion.
            </P>
            <CTAButton label="Explore Evolution" to="/human-evolution" variant="outline" className="mt-4" />
          </Block>
          <Block title="Integrated Intelligence">
            <P>
              We explore the relationship between human, scientific, technological, collective, ecological, and artificial intelligences as complementary forms of knowledge.
            </P>
            <CTAButton label="Explore Intelligence" to="/integrated-intelligence" variant="outline" className="mt-4" />
          </Block>
          <Block title="Civilization Transformation">
            <P>
              Viewing civilization as an interconnected system, UGT works to understand the relationships between health, education, economy, and environment to foster human flourishing.
            </P>
            <CTAButton label="Explore Civilization" to="/civilization" variant="outline" className="mt-4" />
          </Block>
          <Block title="Heaven on Earth">
            <P>
              Heaven on Earth is our civilizational direction: the aspiration toward the perfection of creation being progressively restored through conscious human participation.
            </P>
            <CTAButton label="Explore the Aspiration" to="/heaven-on-earth" variant="outline" className="mt-4" />
          </Block>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Participation"
        title="Universal ID & The Ecosystem"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            Universal ID is UGT's identity and participation layer. It allows individuals to enter the UGT ecosystem, connect with the Trust, and contribute to the broader movement toward civilization transformation.
          </P>
          <CTAButton label="Learn about Universal ID" to="/universal-id" variant="primary" />
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Our Ecosystem"
        title="Relationship with Creator Community"
        center
        className="bg-zinc-900 text-white"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P className="text-zinc-400">
            Creator Community is the separate creation and project ecosystem associated with the broader UGT vision. While UGT provides the philosophical and evolutionary framework, Creator Community is where that vision is manifested through practical projects.
          </P>
          <CTAButton 
            label="Visit Creator Community" 
            to="https://creatorcommunity.space/" 
            variant="outline" 
          />
        </div>
      </ContentSection>
    </>
  );
};

export default AboutPage;