import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeHumanEvolutionPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Human Evolution — UGT Knowledge Library',
      'Exploring the conscious advancement of human capacity, awareness, and the transition to new stages of existence within the UGT framework.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Human Evolution" 
        subtitle="The conscious advancement of human capacity, awareness, and biological-cognitive integration."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What is Human Evolution in the UGT Context?" 
        lead="Beyond biological mutation and natural selection, UGT views evolution as a conscious, directed process."
      >
        <Block>
          <P>
            In the Universal Guard Trust framework, Human Evolution is defined as the intentional expansion of human consciousness and capability. It is the transition from passive evolution—driven by environmental pressures—to active evolution, where humanity consciously designs its own cognitive, emotional, and spiritual trajectory.
          </P>
          <P className="mt-4">
            This process involves the integration of biological intelligence with advanced technological systems, not to replace the human essence, but to amplify it, allowing us to perceive and interact with reality at higher levels of complexity.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why Conscious Evolution Matters" 
        lead="The survival of humanity depends on our ability to evolve faster than the challenges we create."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Overcoming Biological Limits">
            <P>
              Our current biological hardware is optimized for survival in a prehistoric environment. Conscious evolution allows us to transcend these limitations, reducing systemic suffering and expanding our capacity for empathy and understanding.
            </P>
          </Block>
          <Block title="Alignment with Intelligence">
            <P>
              As we create Artificial Intelligence, we must evolve our own consciousness to remain aligned. Without a corresponding evolution in human wisdom, the gap between our power and our maturity becomes a systemic risk.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="Evolution is not an individual journey, but a collective transition."
      >
        <Block>
          <P>
            On an individual level, this evolution manifests as <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>—the realization of one's highest potential. On a civilizational level, it leads to a <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>, where the collective intelligence of the species is used to maintain planetary balance and foster universal peace.
          </P>
          <P className="mt-4">
            This trajectory is the essential precursor to manifesting <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a>, as such a state requires a species capable of sustaining it through integrated intelligence and unconditional empathy.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="The Path Forward" 
        lead="UGT provides the architectural guardrails for this transition."
      >
        <Block>
          <P>
            The UGT vision of evolution is one of "Integrated Intelligence." We envision a future where the boundary between human intuition and systemic data becomes a seamless interface, enabling a level of creativity and problem-solving previously unimaginable.
          </P>
          <P className="mt-4">
            This is achieved through the synergy of biological growth, technological augmentation, and spiritual awakening, ensuring that the "Guard" (protection of essence) and the "Trust" (faith in potential) remain in perfect balance.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Continue Your Exploration" 
        subtitle="Human evolution is deeply linked to the way we organize our intelligence and our society."
        primaryLabel="Integrated Intelligence"
        primaryTo="/knowledge/integrated-intelligence"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeHumanEvolutionPage;