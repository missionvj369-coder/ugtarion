import React, { useEffect } from 'react';
import { updatePageMetadata } from '../lib/seo';
import { PageHero, ContentSection, P, Block, CTAButton } from './PageKit';
import FadeIn from '../components/FadeIn';

const AboutPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'About Universal Guard Trust — Human Evolution & Civilization',
      'Learn about the vision, purpose, and framework of Universal Guard Trust (UGT) and its commitment to the conscious evolution of humanity.'
    );
  }, []);

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
    </>
  );
};

export default AboutPage;