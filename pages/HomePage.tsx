import React from 'react';
import { PageHero, ContentSection, P, PillarGrid, CTASection, FlowDisplay, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';
import GratitudeSection from '../components/GratitudeSection';

interface HomePageProps {
  onOpenIdModal: () => void;
}

const blueprintSystems = [
  'Humanity',
  'Consciousness',
  'Truth',
  'Knowledge',
  'Intelligence',
  'Human Needs',
  'Planetary Systems',
  'Food & Water',
  'Health',
  'Education',
  'Technology',
  'Ancient Intelligence',
  'Civilization',
  'Peace',
  'Creation',
];

const intelligences = [
  { title: 'Human Intelligence', description: 'Experience, empathy, creativity, judgment, values and lived knowledge.' },
  { title: 'Artificial Intelligence', description: 'Analysis, synthesis, simulation and discovery at scale.' },
  { title: 'Scientific Intelligence', description: 'Evidence, measurement, experimentation and verification.' },
  { title: 'Collective Intelligence', description: 'Distributed experience, local knowledge and collaboration.' },
];

const creationLoop = ['Understand', 'Question', 'Connect', 'Create', 'Test', 'Measure', 'Learn', 'Evolve'];

const HomePage: React.FC<HomePageProps> = ({ onOpenIdModal }) => {
  return (
    <>
      <PageHero
        eyebrow="Universal Guard Trust"
        title="What Would Humanity Build If It Finally Worked Together?"
        subtitle="Humanity already possesses an extraordinary inheritance of knowledge, intelligence, experience and imagination. What is missing is the connection."
      />

      <FadeIn><GratitudeSection /></FadeIn>

      <ContentSection
        eyebrow="One Humanity. Many Systems."
        title="A Living Framework for a Connected Civilization"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>Human life does not exist in separate systems.</P>
          <P>
            Health touches education.
            Education touches opportunity.
            Opportunity touches community.
            Community touches culture.
            Culture touches civilization.
            Civilization touches the planet.
          </P>
          <P>UGT brings these relationships into one field of inquiry and creation.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="Core Philosophy" title="From Knowledge to Creation" className="bg-white/40">
        <FlowDisplay steps={creationLoop} label="Creation Loop" />
        <div className="mt-12 max-w-3xl mx-auto text-center space-y-4">
          <P>The purpose is not to declare a final answer for humanity.</P>
          <P>The purpose is to build a civilization capable of continuously discovering better answers.</P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="The Master Blueprint"
        title="One Architecture. Many Interconnected Systems."
        center
        className="bg-gradient-to-b from-white/40 to-white/80"
      >
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {blueprintSystems.map((system) => (
            <span
              key={system}
              className="px-5 py-2.5 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full hover:border-zinc-400 transition-colors"
            >
              {system}
            </span>
          ))}
        </div>
        <div className="mt-10 text-center">
          <CTAButton label="Explore the Blueprint" to="/blueprint" variant="outline" />
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="The Work"
        title="From Ideas to Reality"
        lead="Ideas become meaningful when they enter reality. UGT explores practical ways to transform knowledge into education, technology, ecological restoration, community intelligence, scientific exploration and new forms of creation."
      >
        <div className="mt-6 text-center">
          <CTAButton label="Explore the Work" to="/projects" variant="outline" />
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Intelligence of the Whole" title="HI × AI × SI × CI" className="bg-white/60">
        <PillarGrid items={intelligences} />
        <div className="mt-12 text-center">
          <P>Together: HI × AI × SI × CI</P>
        </div>
      </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Claim Your Universal ID" onClick={onOpenIdModal} />
              <CTAButton label="Enter the Work" to="https://creatorcommunity.space/" variant="outline" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="The Future Is Not Something Waiting to Arrive."
        subtitle="It is something humanity is continuously creating."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Explore the Blueprint"
        secondaryTo="/blueprint"
      />
    </>
  );
};

export default HomePage;