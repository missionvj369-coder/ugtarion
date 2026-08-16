import React, { useEffect } from 'react';
import { updatePageMetadata } from '../lib/seo';
import { PageHero, ContentSection, P, PillarGrid, Block, CTAButton } from './PageKit';

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

const IntegratedIntelligencePage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Integrated Intelligence — Universal Guard Trust',
      'Exploring the synergy between human, artificial, scientific, collective, and ecological intelligences to solve complex global challenges.'
    );
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Intelligence Framework"
        title="Integrated Intelligence"
        subtitle="Moving beyond the silos of knowledge to a synergistic relationship between all forms of intelligence."
      />

      <ContentSection
        eyebrow="The Synergy"
        title="The Relationship of Intelligences"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            UGT recognizes that no single form of intelligence is sufficient to address the complexity of the human condition or the challenges of planetary survival.
          </P>
          <P>
            Integrated Intelligence is the practice of bringing complementary forms of knowledge into a constructive relationship, where the strengths of one compensate for the limitations of another.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Spectrum" title="Forms of Intelligence" className="bg-white/40">
        <PillarGrid items={intelligences} />
      </ContentSection>

      <ContentSection
        eyebrow="The Synthesis"
        title="From Competition to Collaboration"
        center
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Block title="HI × AI (Human & Artificial)">
              <P>
                Combining human empathy, ethics, and judgment with AI's capacity for scale, pattern recognition, and rapid synthesis.
              </P>
            </Block>
            <Block title="SI × CI (Scientific & Collective)">
              <P>
                Merging rigorous evidence-based verification with the distributed, lived experience of global communities.
              </P>
            </Block>
          </div>
          <div className="text-center mt-12">
            <P className="font-medium text-zinc-900 text-xl">The Goal: A Unified Field of Knowledge</P>
            <P className="mt-4">
              Where technology serves consciousness, and science honors the mystery of existence.
            </P>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Next Step"
        title="Applying Intelligence to Civilization"
        center
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <P>
            When these intelligences are integrated, they become the tools for transforming our civilization.
          </P>
          <CTAButton label="Explore Civilization Transformation" to="/civilization" variant="primary" />
        </div>
      </ContentSection>
    </>
  );
};

export default IntegratedIntelligencePage;