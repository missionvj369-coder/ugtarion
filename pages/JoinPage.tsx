import React from 'react';
import { PageHero, ContentSection, P, CTASection, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

interface JoinPageProps {
  onOpenIdModal: () => void;
}

const paths = [
  { title: 'Research', description: 'Investigate questions that matter. Connect evidence. Compare knowledge. Examine claims. Explore the unknown.' },
  { title: 'Engineering', description: 'Turn ideas into working systems. Build software, develop tools, prototype technologies, design infrastructure and measure what happens.' },
  { title: 'Education', description: 'Help knowledge move. Teach, mentor, translate, explain and create learning systems that make complex ideas understandable.' },
  { title: 'Creation', description: 'Tell stories, make films, create visualizations, design experiences and transform knowledge into something people can see and feel.' },
  { title: 'Community', description: 'Bring people together. Share skills, organize local experiments, build relationships and turn local knowledge into collective knowledge.' },
  { title: 'Questions', description: 'Why? Could it work differently? What does the evidence show? What have we missed? A good question can become a research project.' },
];

const questions = [
  'Why?',
  'Why does this happen?',
  'Could it work differently?',
  'What does the evidence show?',
  'What have we missed?',
  'Who has already explored this?',
  'What would happen if we tried?'
];

const roles = ['A scientist can contribute research', 'A developer can build technology', 'A teacher can share knowledge', 'An artist can create meaning', 'A farmer can share practical experience', 'A student can ask a question nobody has asked', 'A business can provide resources', 'An elder can preserve knowledge', 'A child can remind us to remain curious'];

const JoinPage: React.FC<JoinPageProps> = ({ onOpenIdModal }) => (
  <>
    <PageHero
      eyebrow="Join"
      title="The Work Begins When You Enter"
      subtitle="UGT is not something to watch from a distance. Bring your curiosity, your knowledge, your skills and your willingness to learn and contribute."
    >
      <div className="mt-10">
        <CTAButton label="Claim Your Universal ID" onClick={onOpenIdModal} />
      </div>
    </PageHero>

    <ContentSection eyebrow="Everyone Has Something to Give" title="Participation Begins Wherever You Are" className="bg-white/40" center>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {roles.map((role) => (
          <div key={role} className="rounded-xl border border-zinc-200 bg-white p-5 text-center">
            <P>{role}</P>
          </div>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="Enter Through Your Strength" title="Ways to Contribute">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paths.map((path) => (
          <div key={path.title} className="rounded-2xl border border-zinc-200 bg-white p-7">
            <h4 className="text-base sm:text-lg font-medium text-zinc-900 mb-2">{path.title}</h4>
            <p className="text-sm text-zinc-600 font-light leading-relaxed">{path.description}</p>
          </div>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="Bring a Question" title="Some Contributions Begin With Why" center className="bg-white/40">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {questions.map((q) => (
          <span key={q} className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{q}</span>
        ))}
      </div>
      <div className="mt-8 max-w-3xl mx-auto text-center space-y-4">
        <P>A good question can become a research project.</P>
        <P>A research project can become a creation.</P>
        <P>A creation can become a system.</P>
        <P>A system can change lives.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Build With Others. Work in the Open." title="No Individual Sees the Whole Picture" center>
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <P>One person may see the problem. Another may understand the science. Another may know how to build. Another may know how to communicate.</P>
        <P>Intelligence becomes greater when perspectives can meet without losing their differences.</P>
        <P>Share what you learn. Share what you build. Invite examination. Accept correction. Improve continuously.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="A Place for Every Kind of Intelligence" title="HI × AI × SI × CI" className="bg-white/40" center>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {[
          'Human Intelligence — Experience, empathy, imagination, judgment and values.',
          'Artificial Intelligence — Analysis, synthesis, simulation and discovery.',
          'Scientific Intelligence — Observation, evidence, experimentation and verification.',
          'Collective Intelligence — Distributed experience, local knowledge and shared learning.'
        ].map((item) => (
          <div key={item} className="rounded-xl border border-zinc-200 bg-white p-5">
            <P className="text-sm">{item}</P>
          </div>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="What We Ask" title="Question Before Accepting. Investigate Before Claiming." center>
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <P>Build before boasting. Measure before declaring success. Correct mistakes openly. Respect human dignity. Keep knowledge open. Remain willing to change your mind when evidence demands it.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Begin Where You Are" title="There Is No Single Doorway Into the Work" center className="bg-white/40">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {['Read', 'Question', 'Research', 'Create', 'Teach', 'Build', 'Connect', 'Test', 'Share', 'Bring one idea'].map((item) => (
          <span key={item} className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{item}</span>
        ))}
      </div>
      <div className="mt-8 max-w-3xl mx-auto text-center">
        <P>You can begin today.</P>
      </div>
    </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Enter the Creator Community" to="https://creatorcommunity.space/" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Enter the Work."
        subtitle="Bring your intelligence. Bring your curiosity. Bring your hands. Build with humanity."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
  </>
);

export default JoinPage;