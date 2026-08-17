import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeHeavenOnEarthPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Heaven on Earth — UGT Knowledge Library',
      'UGT\'s practical aspiration: the progressive restoration of creation through conscious human participation — reducing unnecessary suffering, strengthening human dignity, and expanding the capacity for love and understanding.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Heaven on Earth" 
        subtitle="UGT's practical aspiration: the progressive restoration of creation through conscious human participation."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What Does Heaven on Earth Mean in the UGT Context?" 
        lead="Not a supernatural promise. A civilizational design target."
      >
        <Block>
          <P>
            In the UGT framework, Heaven on Earth is not a theological claim or a utopian fantasy. It is a practical aspiration — a design target for civilization. It describes a world where unnecessary suffering has been systematically reduced, where human dignity is the default condition, where the capacity for love, understanding, and creative participation is universally accessible, and where humanity lives in dynamic harmony with the living world.
          </P>
          <P className="mt-4">
            The "Heaven" in this phrase refers to the qualities traditionally associated with that concept: peace, abundance, justice, beauty, connection, meaning — but grounded in the "Earth" of material reality, human biology, ecological limits, and the hard work of building systems that deliver these outcomes.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why This Aspiration Matters" 
        lead="Civilizations without a positive vision drift toward collapse."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="A North Star for Decision-Making">
            <P>
              Without a clear vision of what "good" looks like at civilizational scale, every decision becomes reactive — optimizing for the avoidance of harm rather than the creation of flourishing. Heaven on Earth provides a positive attractor: a direction to move toward, not just a catastrophe to move away from.
            </P>
          </Block>
          <Block title="Measurable, Not Magical">
            <P>
              UGT treats Heaven on Earth as an engineering and governance challenge. Progress can be measured: reduction in preventable suffering, increase in human development indicators, restoration of ecological health, expansion of creative and participatory freedom. It is a roadmap, not a revelation.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="Heaven on Earth is the emergent property of a transformed civilization."
      >
        <Block>
          <P>
            Heaven on Earth does not appear by decree. It emerges when <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a> produces individuals capable of <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>, when <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> guides our systems, when <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a> restructures our institutions, and when <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> maintains the feedback loops that keep it all aligned.
          </P>
          <P className="mt-4">
            It is the destination toward which the entire UGT architecture points — not as a final state to be achieved and then frozen, but as an ever-deepening condition of life that each generation inherits and extends.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="The Blueprint" 
        lead="UGT has articulated a practical roadmap: the Heaven on Earth Blueprint."
      >
        <Block>
          <P>
            The <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> translates this aspiration into ten civilizational intelligences that must be cultivated and integrated: Human, Artificial, Scientific, Collective, Ecological, Cultural, Historical, Creative, Systems, and Technological Intelligence. Each intelligence represents a domain of civilizational capacity that must mature and synchronize.
          </P>
          <P className="mt-4">
            The Blueprint is not a static document. It is a living framework that evolves as UGT Projects test its principles, as the Knowledge Library deepens its understanding, and as the Creator Community translates its vision into culture. It is the practical arm of the aspiration.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Read the Blueprint" 
        subtitle="The practical roadmap for manifesting Heaven on Earth through ten integrated intelligences."
        primaryLabel="Heaven on Earth Blueprint"
        primaryTo="/heaven-on-earth/blueprint"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeHeavenOnEarthPage;