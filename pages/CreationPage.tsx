import React from 'react';
import { PageHero, ContentSection, P, CTASection, FlowDisplay, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

interface CreationPageProps {
  onOpenIdModal: () => void;
}

const creationPaths = [
  { title: 'Films', description: 'Stories carry ideas across language, geography and generations.' },
  { title: 'Visual Education', description: 'Ideas become understandable the moment they become visible.' },
  { title: 'Scientific Visualization', description: 'Molecules, cells, neural activity and cosmic structures made visible.' },
  { title: 'Interactive Experiences', description: 'Touch, explore, change variables, ask questions and test possibilities.' },
  { title: 'AI-Assisted Creation', description: 'AI expands the number of people capable of creating. The human remains responsible for purpose.' },
  { title: 'Open Creation', description: 'Share knowledge, method, evidence and improvements. Allow others to build upon the work.' },
];

const creationLoop = ['Imagine', 'Investigate', 'Design', 'Build', 'Test', 'Measure', 'Improve', 'Share', 'Teach', 'Build Again'];
const creatorCommunity = ['Scientists', 'Engineers', 'Artists', 'Teachers', 'Students', 'Farmers', 'Designers', 'Developers', 'Researchers', 'Entrepreneurs', 'Builders', 'Communities'];

const CreationPage: React.FC<CreationPageProps> = ({ onOpenIdModal }) => (
  <>
    <PageHero
      eyebrow="Creation"
      title="From Understanding to Something That Exists"
      subtitle="Knowledge becomes powerful when it can become creation. An idea becomes a prototype. A discovery becomes a tool. A solution becomes a system."
    >
      <div className="mt-10">
        <CTAButton label="Explore Projects" to="/projects" />
      </div>
    </PageHero>

    <ContentSection eyebrow="The Creator" title="Every Human Being Carries the Capacity to Create" center>
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <P>A child drawing for the first time. A farmer improving a field. A scientist testing an idea. An artist transforming experience into beauty.</P>
        <P>Creation does not belong only to specialists. Civilization advances because ordinary people create extraordinary possibilities.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="From Question to Creation" title="Shortening the Distance Between Idea and Reality" className="bg-white/40" center>
      <FlowDisplay steps={['Question', 'Understanding', 'Idea', 'Creation', 'Reality']} />
    </ContentSection>

    <ContentSection eyebrow="Paths of Creation" title="Ways Knowledge Enters Reality">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {creationPaths.map((path) => (
          <div key={path.title} className="rounded-2xl border border-zinc-200 bg-white p-7">
            <h4 className="text-base sm:text-lg font-medium text-zinc-900 mb-2">{path.title}</h4>
            <p className="text-sm text-zinc-600 font-light leading-relaxed">{path.description}</p>
          </div>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="Creation for Human Flourishing" title="The Purpose Is What Creation Makes Possible" center className="bg-white/40">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <P>Create better learning. Healthier communities. Resilient food systems. Cleaner technology. Accessible knowledge. Beautiful stories.</P>
        <P>The purpose of creation is not creation itself. The purpose is what creation makes possible.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="The Creation Loop" title="Every Creation Becomes a Starting Point for Another" center>
      <FlowDisplay steps={creationLoop} />
    </ContentSection>

    <ContentSection eyebrow="The Creator Community" title="The Work Belongs to Everyone Willing to Contribute" center className="bg-white/40">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {creatorCommunity.map((role) => (
          <span key={role} className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{role}</span>
        ))}
      </div>
      <div className="mt-8 max-w-3xl mx-auto text-center space-y-4">
        <P>Creation becomes participation. A person reads an idea, asks a question, contributes knowledge, builds, and shares what was learned.</P>
        <P>This is how an idea becomes alive.</P>
      </div>
    </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Explore Projects" to="/projects" />
              <CTAButton label="Enter the Creator Community" to="https://creatorcommunity.space/" variant="outline" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="The Future Is Continuously Being Created."
        subtitle="Will we create it consciously?"
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
  </>
);

export default CreationPage;