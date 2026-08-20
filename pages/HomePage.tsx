import React, { useEffect } from 'react';
import { updatePageMetadata } from '../lib/seo';
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
  { title: 'Ecological Intelligence', description: 'Understanding the living systems and biological networks of the planet.' },
  { title: 'Cultural Intelligence', description: 'The wisdom embedded in diverse human traditions and social expressions.' },
  { title: 'Historical Intelligence', description: 'Learning from the patterns of the past to navigate the future.' },
  { title: 'Creative Intelligence', description: 'The ability to imagine and manifest new possibilities and forms.' },
  { title: 'Systems Intelligence', description: 'Recognizing the interconnectedness and feedback loops of complex wholes.' },
  { title: 'Technological Intelligence', description: 'The application of tools and methods to extend human capability.' },
];

const creationLoop = ['Understand', 'Question', 'Connect', 'Create', 'Test', 'Measure', 'Learn', 'Evolve'];

const HomePage: React.FC<HomePageProps> = ({ onOpenIdModal }) => {
  useEffect(() => {
    updatePageMetadata(
      'Universal Guard Trust — Human Evolution, Integrated Intelligence & Civilization',
      'Universal Guard Trust (UGT) is a living framework dedicated to human evolution, human flourishing, and the conscious transformation of civilization through integrated intelligence and cosmic alignment.'
    );
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Universal Guard Trust"
        title="What Would Humanity Build If It Finally Worked Together?"
        subtitle="Universal Guard Trust (UGT) is a living framework dedicated to human evolution, human flourishing and the conscious transformation of civilization."
      />

      <FadeIn><GratitudeSection /></FadeIn>

      <ContentSection
        eyebrow="Our Core Purpose"
        title="Contributing to the Conscious Evolution of Humanity"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            UGT exists to contribute to the conscious evolution of humanity and the transformation of civilization.
          </P>
          <P>
            Its work explores how humanity can bring together different forms of intelligence, accumulated knowledge, human potential, technology, community and constructive action to create better conditions for life.
          </P>
          <P>
            The objective is not to prescribe a perfect society, but to create a continuously evolving framework through which people can understand, participate, create, learn and contribute to the advancement of humanity.
          </P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Integrated Intelligence"
        title="Bringing Forms of Intelligence into Relationship"
        className="bg-white/60"
      >
        <div className="max-w-3xl mx-auto text-center mb-12">
          <P>
            UGT recognizes that no single form of intelligence is sufficient. We explore the synergy between complementary forms of knowledge and intelligence to address the complex challenges of our time.
          </P>
        </div>
        <PillarGrid items={intelligences} />
        <div className="mt-12 text-center">
          <P className="font-medium text-zinc-900">Together: HI × AI × SI × CI and beyond</P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Human Evolution"
        title="Beyond Technological Advancement"
        center
        className="bg-white/40"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            Human evolution is an ongoing process that extends far beyond the tools we build. It is the expansion of our capacity to exist and relate.
          </P>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
            {['Consciousness', 'Knowledge', 'Capability', 'Creativity', 'Cooperation', 'Wisdom', 'Responsibility', 'Compassion', 'Community', 'Civilization'].map((trait) => (
              <div key={trait} className="p-3 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-lg bg-white">
                {trait}
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Civilization Transformation"
        title="Civilization as an Interconnected System"
        className="bg-white/80"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <P>
            We view civilization not as a collection of isolated institutions or sectors, but as an interconnected system. Improving the human condition requires understanding how these systems interact.
          </P>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="space-y-2">
              <h4 className="font-medium text-zinc-900">Foundational Systems</h4>
              <P className="text-sm">Human life, health, food, water, housing, and environment.</P>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-zinc-900">Structural Systems</h4>
              <P className="text-sm">Education, economy, technology, governance, and culture.</P>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-zinc-900">Relational Systems</h4>
              <P className="text-sm">Community, knowledge, and the legacy left for future generations.</P>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="The Aspiration"
        title="Heaven on Earth"
        center
        className="bg-gradient-to-b from-white/40 to-white/80"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            UGT presents Heaven on Earth not as a supernatural claim or a declaration that perfection has already been achieved, but as a civilizational direction.
          </P>
          <P>
            It is the aspiration toward the perfection of creation being progressively restored through conscious human participation: reducing unnecessary suffering, strengthening human dignity and capability, restoring relationships with the living world, and expanding access to knowledge and opportunity.
          </P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="The Master Blueprint"
        title="One Architecture. Many Interconnected Systems."
        center
        className="bg-white/40"
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

      <ContentSection eyebrow="Core Philosophy" title="From Knowledge to Creation" className="bg-white/60">
        <FlowDisplay steps={creationLoop} label="Creation Loop" />
        <div className="mt-12 max-w-3xl mx-auto text-center space-y-4">
          <P>The purpose is not to declare a final answer for humanity.</P>
          <P>The purpose is to build a civilization capable of continuously discovering better answers.</P>
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

      <ContentSection
        eyebrow="Framework Glossary"
        title="Key Terms & Acronyms"
        center
        className="bg-white/40"
      >
        <div className="max-w-4xl mx-auto">
          <P className="text-center mb-10 max-w-2xl mx-auto">
            UGT uses a specific vocabulary to describe its framework. Understanding these terms helps navigate the platform and participate in the work.
          </P>
          <dl className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="font-semibold text-zinc-900">UGT</dt>
                <dd className="text-zinc-600 mt-1">Universal Guard Trust — The living framework for human evolution, integrated intelligence, and civilization transformation.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Universal ID</dt>
                <dd className="text-zinc-600 mt-1">A sovereign, non-transferable identity credential (format: UGT-XXXXXX) that grants access to the UGT ecosystem and trust network.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">HI</dt>
                <dd className="text-zinc-600 mt-1">Human Intelligence — Experience, empathy, creativity, judgment, values, and lived knowledge.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">AI</dt>
                <dd className="text-zinc-600 mt-1">Artificial Intelligence — Analysis, synthesis, simulation, and discovery at scale.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">SI</dt>
                <dd className="text-zinc-600 mt-1">Scientific Intelligence — Evidence, measurement, experimentation, and verification.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">CI</dt>
                <dd className="text-zinc-600 mt-1">Collective Intelligence — Distributed experience, local knowledge, and collaboration.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">EI</dt>
                <dd className="text-zinc-600 mt-1">Ecological Intelligence — Understanding living systems and biological networks of the planet.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">CulI</dt>
                <dd className="text-zinc-600 mt-1">Cultural Intelligence — Wisdom embedded in diverse human traditions and social expressions.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">HIstI</dt>
                <dd className="text-zinc-600 mt-1">Historical Intelligence — Learning from patterns of the past to navigate the future.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">CrI</dt>
                <dd className="text-zinc-600 mt-1">Creative Intelligence — The ability to imagine and manifest new possibilities and forms.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">SyI</dt>
                <dd className="text-zinc-600 mt-1">Systems Intelligence — Recognizing interconnectedness and feedback loops of complex wholes.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">TI</dt>
                <dd className="text-zinc-600 mt-1">Technological Intelligence — Application of tools and methods to extend human capability.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Integrated Intelligence</dt>
                <dd className="text-zinc-600 mt-1">The synthesis of HI × AI × SI × CI × EI × CulI × HIstI × CrI × SyI × TI as complementary forms of knowledge.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Heaven on Earth</dt>
                <dd className="text-zinc-600 mt-1">A civilizational direction: the aspiration toward the perfection of creation being progressively restored through conscious human participation.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Conscious Civilization</dt>
                <dd className="text-zinc-600 mt-1">A civilization that operates with awareness of its interconnected systems and consciously evolves toward human flourishing.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Creation Loop</dt>
                <dd className="text-zinc-600 mt-1">The iterative process: Understand → Question → Connect → Create → Test → Measure → Learn → Evolve.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Blueprint</dt>
                <dd className="text-zinc-600 mt-1">The master architecture of interconnected systems: Humanity, Consciousness, Truth, Knowledge, Intelligence, Human Needs, Planetary Systems, Food & Water, Health, Education, Technology, Ancient Intelligence, Civilization, Peace, Creation.</dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-900">Guardian</dt>
                <dd className="text-zinc-600 mt-1">An individual who has claimed their Universal ID and participates in the UGT trust network.</dd>
              </div>
            </div>
          </dl>
        </div>
      </ContentSection>

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