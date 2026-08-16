import React from 'react';
import { PageHero, ContentSection, P, CTASection, FlowDisplay, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

interface IntelligencePageProps {
  onOpenIdModal: () => void;
}

const intelligenceTypes = [
  {
    title: 'Human Intelligence',
    description: 'The intelligence of lived experience. Empathy, creativity, judgment, imagination, values, intuition and responsibility. Human beings provide something no system should casually discard: the experience of being human.',
  },
  {
    title: 'Artificial Intelligence',
    description: 'The intelligence of computation. Analysis, synthesis, pattern recognition, simulation, translation, search and generation. AI can examine enormous bodies of information and reveal relationships. But capability does not automatically create wisdom.',
  },
  {
    title: 'Scientific Intelligence',
    description: 'The intelligence of disciplined investigation. Observation, measurement, experimentation, prediction, verification and replication. Scientific intelligence provides a method for distinguishing what appears true from what survives serious testing.',
  },
  {
    title: 'Collective Intelligence',
    description: 'The intelligence that emerges when people contribute what they know. Local knowledge, professional knowledge, cultural knowledge, lived experience and diverse perspectives. No individual sees the whole system. Together, humanity can see more.',
  },
];

const intelligenceLoopSteps = ['Question', 'Connect', 'Analyze', 'Test', 'Create', 'Measure', 'Learn'];

const IntelligencePage: React.FC<IntelligencePageProps> = ({ onOpenIdModal }) => {
  return (
    <>
      <PageHero
        eyebrow="Intelligence"
        title="Humanity Enters an Age of Integrated Intelligence"
        subtitle="Human intelligence can meet artificial intelligence. Scientific intelligence can meet lived experience. Collective intelligence can meet computation. The opportunity is to connect intelligence without surrendering judgment."
      >
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton label="Explore Civilization" to="/civilization" />
          <CTAButton label="Enter the Work" onClick={onOpenIdModal} variant="outline" />
        </div>
      </PageHero>

      <ContentSection eyebrow="The Four Intelligences" title="HI × AI × SI × CI" className="bg-white/40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intelligenceTypes.map((type) => (
            <div key={type.title} className="rounded-2xl border border-zinc-200 bg-white p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-600 bg-zinc-100 rounded-full">
                  {type.title}
                </span>
              </div>
              <P>{type.description}</P>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-3xl space-y-4">
          <P className="font-medium text-zinc-900">The multiplication symbol matters.</P>
          <P>The objective is not four separate departments. It is interaction.</P>
          <P>
            Human questions can guide AI. AI can reveal patterns. Science can test them. Communities can
            determine whether an idea survives contact with real life. Experience can expose what measurements
            miss. Evidence can correct experience. The system becomes stronger through interaction.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="Intelligence Without Wisdom" title="Greater Intelligence Does Not Automatically Produce a Better Civilization">
        <div className="max-w-3xl space-y-5">
          <P>A civilization can become technologically powerful while remaining socially fragmented.</P>
          <P>It can generate enormous amounts of information while struggling to distinguish truth from noise.</P>
          <P>It can build powerful technologies without understanding their consequences.</P>
          <div className="mt-8 rounded-2xl bg-zinc-900 text-white p-8">
            <p className="text-xl sm:text-2xl font-light leading-relaxed">
              Therefore the question is not simply: How intelligent can humanity become?
            </p>
            <p className="mt-4 text-lg text-zinc-400 font-light">It is: What will humanity do with its intelligence?</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Intelligence Loop" title="A Question Begins With a Human Being" center className="bg-white/40">
        <FlowDisplay steps={intelligenceLoopSteps} label="Intelligence Loop" />
        <div className="mt-12 max-w-3xl mx-auto space-y-4 text-center">
          <P>A question begins with a human being.</P>
          <P>Knowledge is gathered. AI connects and analyzes information. Scientific methods examine the claims. People contribute lived experience. Ideas are designed. Experiments are created. Results are measured. Failures become information. Successful knowledge is shared.</P>
          <P>The next question begins from a higher level of understanding.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="AI as a Civilizational Tool" title="AI Can Help Humanity Navigate Knowledge">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {[
            'Compare ideas across disciplines',
            'Translate knowledge across languages',
            'Summarize complex research',
            'Model possible outcomes',
            'Assist scientific discovery',
            'Support education',
            'Help communities organize information',
            'Accelerate creative work',
            'Reveal relationships between systems'
          ].map((item) => (
            <div key={item} className="rounded-xl border border-zinc-200 bg-white p-5">
              <P>{item}</P>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-3xl">
          <P className="font-medium text-zinc-900">
            But AI must remain subject to evidence, transparency, human dignity and accountability.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Human Remains in the Loop" title="Augmentation, Not Replacement" center className="bg-white/40">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <P>A person asks a better question.</P>
          <P>AI expands the search.</P>
          <P>Science tests the answer.</P>
          <P>Communities experience the result.</P>
          <P>Human judgment decides what should happen next.</P>
          <P>
            This relationship can create something neither human beings nor machines could create alone.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="Intelligence for Human Flourishing" title="What Does Intelligence Enable?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
          {[
            'Can children learn better?',
            'Can people become healthier?',
            'Can communities become more resilient?',
            'Can knowledge become more accessible?',
            'Can ecosystems recover?',
            'Can cooperation increase?',
            'Can human beings create more meaningful lives?',
            'Can civilization learn faster without losing its humanity?'
          ].map((q) => (
            <div key={q} className="rounded-xl border border-zinc-200 bg-white p-5">
              <P>{q}</P>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <P>These are the outcomes that matter.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Next Era" title="The Choice Remains Human" center className="bg-white/40">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <P>Intelligence can be used to divide. Or connect.</P>
          <P>To manipulate. Or empower.</P>
          <P>To concentrate power. Or distribute capability.</P>
          <P>To accelerate destruction. Or accelerate understanding.</P>
          <P className="font-medium text-zinc-900">The choice remains human.</P>
        </div>
      </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Explore Civilization" to="/civilization" />
              <CTAButton label="Enter the Creator Community" to="https://creatorcommunity.space/" variant="outline" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="The Future Belongs Not to One Intelligence."
        subtitle="It belongs to intelligences that can learn to work together."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
    </>
  );
};

export default IntelligencePage;