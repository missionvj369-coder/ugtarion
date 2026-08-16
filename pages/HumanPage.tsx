import React from 'react';
import { PageHero, ContentSection, P, CTASection, CTAButton, PillarGrid } from './PageKit';
import FadeIn from '../components/FadeIn';

interface HumanPageProps {
  onOpenIdModal: () => void;
}

const journeyStages = [
  'Birth',
  'Childhood',
  'Learning',
  'Friendship',
  'Family',
  'Identity',
  'Adolescence',
  'Love',
  'Work',
  'Creation',
  'Responsibility',
  'Parenthood',
  'Community',
  'Aging',
  'Reflection',
  'Death',
  'Legacy',
];

const growthAreas = [
  { title: 'The First Years', description: 'Every child begins with extraordinary possibility. The early years shape development, relationships, learning, emotional security and the foundations from which later life grows.' },
  { title: 'The Developing Human', description: 'A human being is not finished at birth. The brain develops, identity forms, relationships deepen, abilities emerge and learning continues throughout life.' },
  { title: 'Relationships', description: 'Human beings become themselves through relationship. Parents, children, friends, partners, teachers, mentors, neighbours, communities and generations.' },
  { title: 'Human Agency', description: 'A flourishing human being needs knowledge, health, education, opportunity, connection, freedom, responsibility and meaning to shape their own life.' },
  { title: 'Work and Creation', description: 'Human beings do not only consume. They create, build, teach, discover, care, repair, invent and leave something behind.' },
  { title: 'The Elder Years', description: 'Age carries experience, memory, perspective, skill, stories, relationships, lessons and wisdom. Some knowledge exists only inside lived experience.' },
  { title: 'Death and Legacy', description: 'Every human life is finite. That reality gives life meaning and urgency. We inherit. We transform. We pass forward.' },
  { title: 'Human Dignity', description: 'No human being should be reduced to a number. No person\'s worth should depend entirely upon wealth, status, productivity, nationality or power.' },
];

const HumanPage: React.FC<HumanPageProps> = ({ onOpenIdModal }) => {
  return (
    <>
      <PageHero
        eyebrow="Human"
        title="Every Civilization Begins With a Human Life"
        subtitle="Before institutions, economies, technologies and nations, there is a human being. A child. A family. A relationship. A mind discovering the world. A life searching for meaning."
      >
        <div className="mt-10">
          <CTAButton label="Explore Consciousness" to="/consciousness" />
        </div>
      </PageHero>

      <ContentSection
        eyebrow="The Human Journey"
        title="A Journey of Becoming"
        center
      >
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          {journeyStages.map((stage, i) => (
            <React.Fragment key={stage}>
              <span className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{stage}</span>
              {i < journeyStages.length - 1 && <span className="text-zinc-400 text-sm self-center">→</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-10 max-w-3xl mx-auto text-center space-y-4">
          <P>Each stage changes what becomes possible next.</P>
          <P>Understanding the journey gives humanity the opportunity to nurture it consciously.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="Human Development" title="A Lifelong Process" className="bg-white/40">
        <PillarGrid items={growthAreas} />
      </ContentSection>

      <ContentSection eyebrow="The Human Commons" title="Knowledge Should Not Live Behind Walls" center>
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <P>
            Human knowledge should not exist only behind walls that ordinary people cannot enter.
          </P>
          <P>
            UGT explores open ways of connecting people with trustworthy knowledge about development,
            learning, health, relationships, work, parenting, psychology, science, technology, culture and life.
          </P>
          <P>
            The objective is not to create dependence on UGT. It is to increase people's ability to understand
            and act for themselves.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="One Human Life" title="Millions of Lives Interacting Across Time" center className="bg-white/40">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <P>One child. One family. One community. One generation.</P>
          <P>Each appears small beside the scale of civilization.</P>
          <P>
            Yet civilization is nothing other than millions of human lives interacting across time.
          </P>
          <P>
            Improve the conditions in which human beings grow. Strengthen relationships. Expand knowledge.
            Increase agency. Protect dignity. Connect generations. Create opportunity.
          </P>
          <P>And civilization changes from within.</P>
        </div>
      </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Explore Consciousness" to="/consciousness" />
              <CTAButton label="Enter the Creator Community" to="https://creatorcommunity.space/" variant="outline" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Human Evolution Is Not Only About Becoming More Powerful."
        subtitle="It is about becoming more capable of caring, understanding, creating and choosing wisely."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
    </>
  );
};

export default HumanPage;