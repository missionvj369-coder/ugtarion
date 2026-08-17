import React, { useEffect } from 'react';
import { updatePageMetadata } from '../lib/seo';
import { PageHero, ContentSection, P, Block, CTAButton } from './PageKit';

const AboutUGTPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Universal Guard Trust (UGT) — Human Evolution, Integrated Intelligence & Civilization Transformation',
      'Universal Guard Trust (UGT) is a global framework dedicated to human evolution, human flourishing, integrated intelligence and the conscious transformation of civilization. Learn about UGT Global, UGT India, Universal ID, and how to participate.'
    );
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Universal Guard Trust"
        title="Universal Guard Trust (UGT)"
        subtitle="A global framework dedicated to human evolution, human flourishing, integrated intelligence and the conscious transformation of civilization."
      />

      <ContentSection
        eyebrow="The Definition"
        title="What Is Universal Guard Trust?"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <P>
            Universal Guard Trust (UGT) is a global framework dedicated to human evolution, human flourishing, integrated intelligence and the conscious transformation of civilization. It is not a single organization, product, or movement — it is a living architecture that connects people, knowledge, technology, and initiatives toward a shared civilizational direction.
          </P>
          <P>
            UGT exists because humanity stands at a threshold. Our technologies have outpaced our wisdom. Our systems have outgrown their purpose. Our relationship with the living world has fractured. UGT provides a coherent framework for navigating this transition — not by prescribing a single path, but by creating the conditions for integrated intelligence to emerge at every scale: individual, community, institutional, and planetary.
          </P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Core Concepts"
        title="The UGT Conceptual Framework"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Block title="Human Evolution">
            <P>
              The ongoing development of human capacity — cognitive, emotional, ethical, and spiritual — toward greater coherence, compassion, and creative participation in the unfolding of life.
            </P>
          </Block>
          <Block title="Human Flourishing">
            <P>
              The condition in which individuals and communities can realize their full potential across all dimensions of life: physical, intellectual, relational, creative, and meaning-oriented.
            </P>
          </Block>
          <Block title="Integrated Intelligence">
            <P>
              The synthesis of human, artificial, scientific, collective, ecological, cultural, historical, creative, systems, and technological intelligence into a coherent civilizational capacity.
            </P>
          </Block>
          <Block title="Conscious Civilization">
            <P>
              A civilization that knows itself — its patterns, its consequences, its trajectory — and can deliberately steer toward outcomes that expand life, dignity, and understanding.
            </P>
          </Block>
          <Block title="Civilization Transformation">
            <P>
              The deliberate, participatory restructuring of civilizational systems — governance, economy, education, technology, culture — to align with the long-term flourishing of humanity and the living world.
            </P>
          </Block>
          <Block title="Heaven on Earth">
            <P>
              UGT's practical aspiration: the progressive restoration of creation through conscious human participation — reducing unnecessary suffering, strengthening human dignity, and expanding the capacity for love and understanding.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Structure"
        title="UGT Global, UGT India, and Associated Ecosystems"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-zinc-900">UGT Global</h3>
            <P>
              The global framework and canonical identity. UGT Global holds the conceptual architecture, knowledge library, and coordination layer for the worldwide UGT ecosystem. It is the authoritative source for UGT's definitions, principles, and strategic direction.
            </P>
          </div>
          <div className="space-y-6 border-t border-zinc-200 pt-8">
            <h3 className="text-xl font-medium text-zinc-900">UGT India</h3>
            <P>
              The India-focused national expression of the UGT framework. UGT India adapts the global architecture to the specific civilizational, cultural, and institutional context of India. It operates as a distinct entity with its own governance, while remaining aligned with the global UGT framework.
              <br /><br />
              Website: <a href="https://ugtindia.space/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://ugtindia.space/</a>
            </P>
          </div>
          <div className="space-y-6 border-t border-zinc-200 pt-8">
            <h3 className="text-xl font-medium text-zinc-900">Universal ID</h3>
            <P>
              The identity and participation layer within the broader UGT ecosystem. Universal ID provides a portable, verifiable credential that enables individuals to participate in UGT initiatives, access knowledge resources, contribute to projects, and build reputation across the ecosystem. It is not a social network — it is an infrastructure layer for trusted participation.
            </P>
          </div>
          <div className="space-y-6 border-t border-zinc-200 pt-8">
            <h3 className="text-xl font-medium text-zinc-900">UGT Projects</h3>
            <P>
              Practical initiatives that instantiate UGT principles in the world. Projects range from knowledge platforms and educational programs to technology prototypes, community pilots, and ecological restoration efforts. Each project operates with autonomy while contributing to the shared civilizational direction.
            </P>
          </div>
          <div className="space-y-6 border-t border-zinc-200 pt-8">
            <h3 className="text-xl font-medium text-zinc-900">Creator Community</h3>
            <P>
              A separate associated creation ecosystem where artists, writers, musicians, technologists, and builders explore UGT themes through their craft. The Creator Community maintains its own governance and culture while resonating with UGT's conceptual framework.
            </P>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Relationships"
        title="How the Pieces Connect"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <P>
            UGT Global provides the <strong>conceptual architecture</strong> — the definitions, frameworks, and knowledge that define what UGT is and where it is going.
          </P>
          <P>
            UGT India provides a <strong>national expression</strong> — adapting the global framework to India's unique civilizational context, languages, institutions, and challenges.
          </P>
          <P>
            Universal ID provides the <strong>participation infrastructure</strong> — enabling trusted identity, contribution tracking, and reputation across all UGT initiatives.
          </P>
          <P>
            UGT Projects provide <strong>practical instantiation</strong> — real-world efforts that test, demonstrate, and scale UGT principles.
          </P>
          <P>
            The Creator Community provides <strong>cultural resonance</strong> — translating UGT concepts into forms that move people, shift narratives, and expand the imagination of what is possible.
          </P>
          <P>
            These are not hierarchical. They are <strong>mutually reinforcing layers</strong> of a single civilizational architecture. Each can exist independently, but together they form a coherent whole greater than the sum of its parts.
          </P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Participation"
        title="How People Can Participate"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <P>
            Participation in UGT is not membership in an organization. It is engagement with a living framework. People participate in several ways:
          </P>
          <div className="space-y-4">
            <Block title="Claim a Universal ID">
              <P>Establish your verifiable identity in the UGT ecosystem. This enables you to contribute to projects, access knowledge resources, and build reputation across initiatives.</P>
            </Block>
            <Block title="Explore the Knowledge Library">
              <P>Read the cornerstone pages on human evolution, integrated intelligence, human flourishing, civilization transformation, and related concepts. Share them. Discuss them. Build on them.</P>
            </Block>
            <Block title="Engage with Questions">
              <P>Explore the fundamental questions UGT is asking. Add your perspective. Propose new questions. The dialogue is the work.</P>
            </Block>
            <Block title="Contribute to Projects">
              <P>Find a UGT Project that aligns with your skills and values. Contribute code, research, design, community organizing, funding, or advocacy.</P>
            </Block>
            <Block title="Create">
              <P>If you are an artist, writer, musician, or builder, join the Creator Community. Make work that explores UGT themes. Culture shapes civilization.</P>
            </Block>
            <Block title="Start Something New">
              <P>If you see a gap — a missing project, an unexplored question, an unserved community — propose a new UGT initiative. The framework is open to those who wish to build within it.</P>
            </Block>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Technology & Humanity"
        title="Technology and Humanity"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <P>
            UGT does not treat technology as separate from humanity. Technology is an expression of human intelligence — and increasingly, of non-human intelligence. The question is not whether technology will shape our future, but whether we will shape technology with sufficient wisdom, foresight, and ethical coherence.
          </P>
          <P>
            Integrated Intelligence is UGT's answer: a framework for synthesizing human, artificial, scientific, collective, ecological, cultural, historical, creative, systems, and technological intelligence into a civilizational capacity that can navigate complexity without reducing it.
          </P>
          <P>
            This is not techno-optimism. It is not techno-pessimism. It is <strong>techno-responsibility</strong> — the recognition that we are co-creating the intelligence systems that will co-create our future, and that this loop must be made conscious.
          </P>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Nature & Community"
        title="Nature, Community, and Creativity"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Block title="Nature and the Living World">
            <P>
              UGT recognizes that human civilization is embedded in, not separate from, the living world. Ecological intelligence — the capacity to perceive, understand, and act in alignment with ecological systems — is a core pillar of Integrated Intelligence. The restoration of right relationship with nature is not optional; it is foundational to human flourishing.
            </P>
          </Block>
          <Block title="Community">
            <P>
              No individual evolves alone. Community is the substrate of human flourishing — the relational field in which trust, learning, meaning, and collective intelligence emerge. UGT initiatives are designed to strengthen community at every scale: local, regional, global, and digital.
            </P>
          </Block>
          <Block title="Creativity">
            <P>
              Creativity is not decoration. It is the capacity to imagine what does not yet exist and bring it into being. It is how civilization renews itself. The Creator Community exists because UGT takes creativity seriously as a civilizational capacity — not as entertainment, but as evolutionary infrastructure.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection
        center
        title="The Direction"
        lead="UGT is not a destination. It is a direction. A framework for the conscious transformation of civilization — one choice, one project, one conversation, one life at a time."
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <CTAButton label="Explore the Knowledge Library" to="/knowledge" variant="primary" />
          <CTAButton label="Claim Your Universal ID" to="/universal-id" variant="outline" />
        </div>
      </ContentSection>
    </>
  );
};

export default AboutUGTPage;