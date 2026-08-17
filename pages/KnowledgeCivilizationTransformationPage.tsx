import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeCivilizationTransformationPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Civilization Transformation — UGT Knowledge Library',
      'The systemic shift toward a conscious, transparent, and empathetic global society within the UGT framework.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Civilization Transformation" 
        subtitle="The deliberate restructuring of civilizational systems to align with long-term human and planetary flourishing."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What is Civilization Transformation?" 
        lead="Transformation is not reform. It is the fundamental re-architecture of how civilization operates."
      >
        <Block>
          <P>
            In the UGT framework, Civilization Transformation refers to the participatory, systemic restructuring of the foundational systems that govern human life: governance, economy, education, technology, culture, and our relationship with the living world. It is the shift from extractive, short-term, fragmented systems to generative, long-term, integrated systems.
          </P>
          <P className="mt-4">
            This is not a utopian project. It is a pragmatic recognition that current civilizational trajectories — ecological collapse, systemic inequality, meaning crises, technological misalignment — are not sustainable. Transformation is the only path that preserves the possibility of a flourishing future.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why Transformation Is Necessary" 
        lead="The systems we inherited were not designed for the world we have created."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Misaligned Incentives">
            <P>
              Modern institutions optimize for metrics — GDP, quarterly returns, engagement, votes — that are increasingly decoupled from human and planetary well-being. Transformation means realigning incentives with what actually matters.
            </P>
          </Block>
          <Block title="Complexity Gap">
            <P>
              The complexity of our challenges (climate, AI, bioengineering, global coordination) has outpaced the complexity of our governance. Transformation requires upgrading our collective intelligence capacity — <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> — to match the problems we face.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="Transformation is the bridge between individual evolution and planetary thriving."
      >
        <Block>
          <P>
            Civilization Transformation is the collective expression of <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a>. As individuals expand their consciousness and capacity, the systems they create must evolve to reflect that expansion. A civilization of evolved humans cannot function on unevolved systems.
          </P>
          <P className="mt-4">
            The destination of this transformation is a <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> — one that knows itself, monitors its own health, and can deliberately steer toward <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a> and the practical realization of <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a>.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="The Architecture of Transformation" 
        lead="UGT provides the conceptual scaffolding, not the detailed blueprint."
      >
        <Block>
          <P>
            UGT does not prescribe a single model for transformed civilization. Instead, it provides the architectural principles: subsidiarity (decisions at the lowest effective level), transparency (information flows freely), participation (affected parties have voice), regeneration (systems restore what they use), and alignment (technology serves life).
          </P>
          <P className="mt-4">
            These principles are instantiated through <a href="/projects" className="text-indigo-600 hover:underline">UGT Projects</a> — practical pilots in governance innovation, economic redesign, educational reform, technological alignment, and ecological restoration. Each project tests a piece of the transformation puzzle. Together, they form an emerging picture of what is possible.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Vision" 
        subtitle="Civilization transformation is the collective work of our time."
        primaryLabel="Heaven on Earth"
        primaryTo="/knowledge/heaven-on-earth"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeCivilizationTransformationPage;