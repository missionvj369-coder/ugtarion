import React from 'react';
import { PageHero, ContentSection, P, CTASection, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

interface CivilizationPageProps {
  onOpenIdModal: () => void;
}

const civilizationSystems = [
  { title: 'Governance', description: 'Transparency, accountability, evidence, participation and institutional responsibility.' },
  { title: 'Economics', description: 'Systems designed around contribution and shared value, not only extraction.' },
  { title: 'Education', description: 'Learning that prepares people not merely to enter civilization, but to improve it.' },
  { title: 'Culture', description: 'A living web of meaning, creativity, language, history and belonging.' },
  { title: 'Cities', description: 'Cities as living systems of people, water, food, energy, nature and knowledge.' },
  { title: 'Peace', description: 'The capacity to resolve differences without turning human beings into enemies.' },
  { title: 'Cooperation', description: 'Knowledge, science, education and friendship crossing borders.' },
  { title: 'Knowledge Infrastructure', description: 'Open knowledge that lets one generation begin where another finished.' },
  { title: 'Planetary Responsibility', description: 'The future of civilization is inseparable from the living planet.' },
  { title: 'Continuous Learning', description: 'Recognize mistakes fastest. Measure honestly. Change course.' },
];

const CivilizationPage: React.FC<CivilizationPageProps> = ({ onOpenIdModal }) => (
  <>
    <PageHero
      eyebrow="Civilization"
      title="What Happens When Humanity Begins to Build as One Species?"
      subtitle="Civilization is more than governments, borders, economies and cities. It is the living system created by human beings together."
    >
      <div className="mt-10">
        <CTAButton label="Explore Creation" to="/creation" />
      </div>
    </PageHero>

    <ContentSection eyebrow="One Humanity" title="Many Cultures. Many Languages. One Humanity." center>
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <P>Every person is born into a particular place. A language. A culture. A family. A history. A nation.</P>
        <P>But beneath these layers is something shared: human life.</P>
        <P>The same fundamental needs. The same capacity to learn. The same capacity to love. The same vulnerability. The same potential to create.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Beyond Borders" title="Cooperation Beyond Political Boundaries" center className="bg-white/40">
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {['Knowledge can cross borders', 'Science can cross borders', 'Humanitarian action can cross borders', 'Education can cross borders', 'Commerce can cross borders', 'Friendship can cross borders'].map((item) => (
          <span key={item} className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{item}</span>
        ))}
      </div>
      <div className="mt-8 max-w-3xl mx-auto text-center">
        <P>The planet itself already crosses every border.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Community Economy & Shared Creation" title="Contribution and Shared Value" center>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h4 className="font-medium text-zinc-900 mb-2">Community Economy</h4>
          <P>People create businesses. Communities participate. Value circulates. Local enterprise strengthens local life.</P>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h4 className="font-medium text-zinc-900 mb-2">Shared Creation</h4>
          <P>Shared businesses, open technology, cooperative research, community education and local production.</P>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h4 className="font-medium text-zinc-900 mb-2">The Global Community</h4>
          <P>A village can share a solution with a city. A local experiment can become global knowledge.</P>
        </div>
      </div>
      <div className="mt-8 text-center">
        <P>Participation transforms people from observers into builders.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="The City as a Living System" title="A Better City Understands Relationships" className="bg-white/40">
      <div className="flex flex-wrap gap-3 max-w-4xl">
        {['People', 'Water', 'Food', 'Energy', 'Housing', 'Education', 'Healthcare', 'Transportation', 'Nature', 'Work', 'Culture', 'Waste', 'Knowledge', 'Technology'].map((item) => (
          <span key={item} className="px-4 py-2 text-sm text-zinc-600 bg-white border border-zinc-200 rounded-full">{item}</span>
        ))}
      </div>
      <div className="mt-8 max-w-3xl">
        <P>A better city understands these relationships rather than optimizing each part separately.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Governance" title="Systems That Listen, Learn and Correct Themselves">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {['Transparency', 'Accountability', 'Evidence', 'Participation', 'Human rights', 'Open information'].map((item) => (
          <div key={item} className="rounded-xl border border-zinc-200 bg-white p-5">
            <P>{item}</P>
          </div>
        ))}
      </div>
      <div className="mt-8 max-w-3xl">
        <P className="font-medium text-zinc-900">No system should become so powerful that it becomes impossible to question.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="The Planetary Civilization" title="Earth Is the System That Makes Civilization Possible" center className="bg-white/40">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <P>Civilization cannot permanently separate itself from the planet.</P>
        <P>The future of human civilization is therefore inseparable from the future of the living planet.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="A Civilization That Learns" title="Humanity's Shared Systems" center>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {civilizationSystems.map((item) => (
          <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h4 className="font-medium text-zinc-900 mb-2">{item.title}</h4>
            <p className="text-sm text-zinc-600 font-light leading-relaxed">{item.description}</p>
          </div>
        ))}
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
        title="One Planet. One Human Family."
        subtitle="One shared future."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
  </>
);

export default CivilizationPage;