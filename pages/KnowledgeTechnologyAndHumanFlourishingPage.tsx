import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeTechnologyAndHumanFlourishingPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Technology and Human Flourishing — UGT Knowledge Library',
      'How advanced technology can be leveraged to enhance rather than replace the human experience within the UGT framework.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Technology and Human Flourishing" 
        subtitle="Ensuring technology amplifies human potential rather than diminishing it."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="The Relationship Between Technology and Flourishing" 
        lead="Technology is not neutral. It embodies the values of its creators and shapes the lives of its users."
      >
        <Block>
          <P>
            In the UGT framework, technology is understood as an extension of human intelligence — a crystallization of our knowledge, intentions, and blind spots into tools that then reshape us in return. The question is not whether technology will transform human life (it already has), but whether that transformation will be directed toward flourishing or drift toward extraction, addiction, and alienation.
          </P>
          <P className="mt-4">
            Technology and Human Flourishing is the study and practice of aligning technological development with the expansion of human capacity, dignity, and meaning. It asks: What technologies should we build? How should they be governed? Who benefits? Who bears the risk? What does it mean to be human in a world of synthetic intelligence?
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why This Alignment Is the Defining Challenge" 
        lead="The gap between our technological power and our wisdom is the risk surface of the 21st century."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Accelerating Asymmetry">
            <P>
              Our capacity to affect the world (through AI, bioengineering, geoengineering, surveillance, automation) is growing exponentially. Our capacity to wisely govern these powers — individually, institutionally, civilizationaly — is not keeping pace. This asymmetry is the source of existential and catastrophic risk.
            </P>
          </Block>
          <Block title="The Human as End, Not Means">
            <P>
              Much of modern technology treats human attention, behavior, and data as resources to be extracted. A flourishing-aligned technology treats the human as the end: augmenting agency, deepening connection, expanding creativity, restoring health, and creating space for meaning.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="Technology is the lever; flourishing is the direction."
      >
        <Block>
          <P>
            When technology serves flourishing, it becomes a force for <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a> — expanding what humans can perceive, understand, and create. It becomes the substrate of <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> — the synthetic half of the human-AI synthesis. It enables <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a> — new governance, education, and economic primitives. And it makes <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a> materially possible — abundance, health, ecological restoration, universal access.
          </P>
          <P className="mt-4">
            When technology undermines flourishing, it erodes the very foundation of a conscious civilization: attention, trust, autonomy, community, and meaning.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="Techno-Responsibility" 
        lead="Not techno-optimism. Not techno-pessimism. Techno-responsibility."
      >
        <Block>
          <P>
            UGT advocates for a third stance: techno-responsibility. This means building and governing technology with the same seriousness we apply to nuclear energy or genetic engineering — because the stakes are comparable. It means: alignment research as a civilizational priority, not an afterthought; governance that matches the speed and scale of deployment; metrics that measure impact on flourishing, not just engagement or efficiency; and a culture where every technologist is also a philosopher of the human future.
          </P>
          <P className="mt-4">
            This vision is instantiated in <a href="/projects" className="text-indigo-600 hover:underline">UGT Projects</a> focused on aligned AI, humane computing, decentralized governance tools, ecological monitoring systems, and technology assessment frameworks. It is explored culturally through the <a href="/media" className="text-indigo-600 hover:underline">Creator Community</a>. And it is grounded in the identity layer of <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> — ensuring humans remain the authors of their technological destiny.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Intelligence Framework" 
        subtitle="Technology and flourishing meet in the architecture of Integrated Intelligence."
        primaryLabel="Integrated Intelligence"
        primaryTo="/knowledge/integrated-intelligence"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeTechnologyAndHumanFlourishingPage;