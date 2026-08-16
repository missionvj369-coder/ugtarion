import React from 'react';
import { PageHero, ContentSection, P, CTASection, FlowDisplay, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

interface VisionPageProps {
  onOpenIdModal: () => void;
}

const VisionPage: React.FC<VisionPageProps> = ({ onOpenIdModal }) => {
  const loop = ['Understand', 'Connect', 'Create', 'Test', 'Measure', 'Learn', 'Evolve'];

  return (
    <>
      <PageHero
        eyebrow="Vision"
        title="What Could Humanity Become If Its Intelligence Worked Together?"
        subtitle="Humanity has spent thousands of years asking the deepest questions. UGT enters that continuing human search."
      />

      <ContentSection eyebrow="The Question" title="Deep Questions, Continuing Search">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="space-y-4">
            <P>Who are we?</P>
            <P>Where did we come from?</P>
            <P>What is consciousness?</P>
            <P>What is true?</P>
          </div>
          <div className="space-y-4">
            <P>How should we live?</P>
            <P>What can we create?</P>
            <P>What kind of civilization do we want to become?</P>
          </div>
        </div>
        <div className="mt-10 max-w-3xl space-y-4">
          <P>
            Across every generation, people have searched, discovered, created, questioned, suffered, learned
            and passed knowledge forward.
          </P>
          <P>
            Not to erase what came before. Not to replace one belief with another. But to bring knowledge into
            conversation.
          </P>
          <div className="flex flex-wrap gap-3 mt-6">
            {['Science with philosophy', 'Technology with humanity', 'Ancient knowledge with modern investigation', 'Individual experience with collective intelligence', 'Human intelligence with artificial intelligence'].map((pair) => (
              <span key={pair} className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">
                {pair}
              </span>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Work of Connection" title="Connecting the Fragments" className="bg-white/40">
        <div className="flex flex-wrap gap-3 max-w-4xl">
          {['Laboratories', 'Libraries', 'Universities', 'Ancient texts', 'Engineering systems', 'Communities', 'Families', 'Cultures', 'Archives', 'Human experience'].map((place) => (
            <span key={place} className="px-4 py-2 text-sm text-zinc-600 bg-white border border-zinc-200 rounded-full">
              {place}
            </span>
          ))}
        </div>
        <div className="mt-10 max-w-3xl space-y-4">
          <P>
            UGT seeks to connect these fragments while preserving the differences between them.
          </P>
          <P>
            A connection does not mean that every claim is true. It means that every meaningful claim can be examined.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Search for Truth" title="Truth Before Belief. Evidence Before Certainty.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Established</h4>
            <P>Some things are established.</P>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Strong Evidence</h4>
            <P>Some have strong evidence.</P>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Hypothesis</h4>
            <P>Some remain hypotheses.</P>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">Unknown</h4>
            <P>Some remain unknown. The unknown is not a failure. It is an invitation to investigate.</P>
          </div>
        </div>
      </ContentSection>

      <ContentSection eyebrow="Humanity as a Living System" title="Every Layer Influences the Others" className="bg-white/40">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl">
          {['A child becomes an adult', 'A family becomes a community', 'Communities form societies', 'Societies create institutions', 'Institutions shape civilization', 'Civilization transforms the planet'].map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{step}</span>
              {i < 5 && <span className="text-zinc-400">→</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-10 max-w-3xl mx-auto text-center">
          <P>Understanding this interconnectedness is essential to creating wisely.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="From Understanding to Creation" title="A Civilization That Can Learn From Itself" center>
        <FlowDisplay steps={loop} />
        <div className="mt-10 max-w-3xl mx-auto space-y-4 text-center">
          <P>Knowledge alone does not transform reality.</P>
          <P>Understanding must become action. Action must meet reality. Reality must provide evidence. Evidence must produce learning. Learning must change what we build next.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Possibility" title="A System Capable of Bringing Many Forms of Intelligence Together" className="bg-white/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
          {[
            'A question can travel across disciplines.',
            'Knowledge can meet knowledge.',
            'People can contribute what they know.',
            'Technology can amplify human capability.',
            'Evidence can correct assumptions.',
            'Successful ideas can be shared.',
            'Failure can become knowledge rather than something hidden.',
            'Every generation can begin from what the previous generation discovered.'
          ].map((item) => (
            <div key={item} className="rounded-xl border border-zinc-200 bg-white p-5">
              <P>{item}</P>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <CTAButton label="Explore the Blueprint" to="/blueprint" />
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="The Future Is Not a Place We Arrive."
        subtitle="It is a civilization we continuously create."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Explore the Blueprint"
        secondaryTo="/blueprint"
      />
    </>
  );
};

export default VisionPage;