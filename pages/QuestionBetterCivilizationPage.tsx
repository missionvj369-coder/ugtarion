import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionBetterCivilizationPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'What Would a Better Civilization Look Like? — UGT Human Questions',
      'Envisioning the structural and cultural characteristics of a civilization designed for human flourishing and planetary stewardship.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="What Would a Better Civilization Look Like?" 
        subtitle="Not a utopia. A civilization that learns, adapts, and serves life."
      />

      <ContentSection 
        eyebrow="Short Answer" 
        title="A better civilization is one that consciously aligns its structures — governance, economy, education, technology, culture — with the expansion of human flourishing and the regeneration of the living world." 
        lead="It is a civilization that knows itself and can steer."
      >
        <Block>
          <P>
            It would not be perfect. It would not be static. It would be <strong>conscious</strong> — possessing the sensory, cognitive, and governance capacity to perceive its own health, understand the consequences of its choices, and deliberately adjust course. It would measure success in flourishing, not GDP. It would treat technology as a servant of life, not a master of attention. It would integrate the wisdom of traditions with the power of science. It would enable every human to participate meaningfully in the collective project. And it would recognize its embeddedness in the planetary biosphere — not as a slogan, but as a structural constraint on every decision.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Deeper Explanation" 
        title="Structural Characteristics" 
        lead="What changes when flourishing becomes the objective function?"
      >
        <Block>
          <P>
            <strong>Governance:</strong> From reactive crisis management to anticipatory stewardship. Planetary dashboards. Simulation-informed policy. Subsidiarity (decisions at the lowest effective level). Long-term institutions (future generations representatives, century commissions). <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> enabling participatory governance at scale.
          </P>
          <P className="mt-4">
            <strong>Economy:</strong> From extraction to regeneration. Circular by design. Flourishing metrics replacing GDP. Universal basic services (health, education, housing, connectivity, ecological access). Post-labor distribution mechanisms as automation advances. Finance aligned with planetary boundaries.
          </P>
          <P className="mt-4">
            <strong>Education:</strong> From standardization to cultivation. Lifelong, not front-loaded. Focus on wisdom, discernment, systems thinking, creativity, collaboration, self-knowledge. Integrated Intelligence literacy. Ecological and cultural fluency.
          </P>
          <P className="mt-4">
            <strong>Technology:</strong> From engagement extraction to capability amplification. <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> as public infrastructure. Alignment as a design requirement. Open protocols. Human sovereignty over synthetic agency.
          </P>
          <P className="mt-4">
            <strong>Culture:</strong> From consumption to creation. <a href="/media" className="text-indigo-600 hover:underline">Creator Community</a> as cultural engine. Meaning-making as shared practice. Rituals that bind generations. Pluralism within a shared commitment to life.
          </P>
          <P className="mt-4">
            <strong>Ecology:</strong> From externality to foundation. Half-Earth protection. Regenerative agriculture. Cities as ecosystems. Rights of nature. Climate stability as a civilizational invariant.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Historical Perspective" 
        title="Civilizations Evolve" 
        lead="Every civilization in history was 'modern' to its participants. Ours is not the endpoint."
      >
        <Block>
          <P>
            Hunter-gatherer bands, river valley empires, axial age philosophies, medieval Christendom/Islamic world/Song China, industrial modernity — each was a coherent civilizational pattern with its own logic, virtues, and blind spots. Transitions between them were often violent and chaotic. The transition to a conscious, flourishing-aligned civilization is the first that could be <strong>designed</strong> — if we develop the capacity in time. The alternative is not stasis but collapse or drift into a civilization that serves no one's values (algorithmic governance, ecological ruin, meaning vacuum).
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Modern Possibilities" 
        title="Design Tools We Didn't Have Before" 
        lead="Simulation, sensing, coordination, and synthesis at planetary scale."
      >
        <Block>
          <P>
            We can now model the systemic consequences of policy choices before implementing them. We can sense planetary health in real time. We can coordinate millions of participants in deliberative processes. We can synthesize knowledge across disciplines and cultures instantly. These tools make <strong>intentional civilization design</strong> possible for the first time. The <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> (ten intelligences) is UGT's attempt to use these tools systematically.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Different Viewpoints" 
        title="Visions of the Good Civilization" 
        lead="Liberal, socialist, traditionalist, ecological, accelerationist — each sees different virtues and dangers."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Liberal/Technocratic">
            <P>
              Better civilization = more freedom, more innovation, better institutions, evidence-based policy, global cooperation. Risk: ignores meaning, community, ecological limits, spiritual dimension.
            </P>
          </Block>
          <Block title="Ecological/Communitarian">
            <P>
              Better civilization = local, regenerative, low-tech, community-centered, ritual-rich. Risk: cannot support 8 billion people, vulnerable to bad actors, may romanticize poverty.
            </P>
          </Block>
          <Block title="Accelerationist">
            <P>
              Better civilization = maximize energy capture, computation, expansion into space. Risk: treats humans as substrate, ignores alignment, may produce a civilization no human would want.
            </P>
          </Block>
          <Block title="UGT (Integrative)">
            <P>
              Better civilization = conscious, flourishing-aligned, integrated intelligence, participatory, regenerative, meaningful. Draws from all traditions. Requires new architecture. Risk: complexity, coordination difficulty, may be too slow.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="UGT Perspective" 
        title="A Civilization That Learns" 
        lead="The defining feature is not any specific policy but the capacity for continuous, wise adaptation."
      >
        <Block>
          <P>
            UGT does not prescribe the final form of a better civilization. It prescribes the <strong>architecture of learning</strong>: <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> (the sensory-cognitive-governance loop), <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> (the reasoning engine), <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a> (the agents), <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> (the participation layer), and the <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Blueprint</a> (the strategic framework). A better civilization is one that wakes up, grows up, and takes responsibility for its own becoming.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Concepts" 
        title="Connected UGT Concepts" 
        lead="Every UGT concept contributes to the vision of a better civilization."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/civilization-transformation" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Civilization Transformation</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Flourishing</a>
          <a href="/knowledge/heaven-on-earth" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Heaven on Earth</a>
          <a href="/knowledge/universal-id" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Universal ID</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Sources" 
        title="Where Factual Claims Come From" 
        lead="Civilizational studies: Toynbee, Tainter, Diamond, Morris. Governance innovation: Ostrom, Helbing, Barber. Economic alternatives: Raworth, Mazzucato, Jackson. Planetary boundaries: Rockström, Steffen. UGT framework: original synthesis."
      >
        <Block>
          <P className="text-sm text-zinc-600">
            This answer synthesizes established research on civilizational dynamics, governance, and economics with UGT's original conceptual framework. UGT-specific integrations (conscious civilization architecture, Blueprint intelligences) are original proposals.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Transformation Framework" 
        subtitle="How UGT approaches the structural redesign of civilization."
        primaryLabel="Civilization Transformation"
        primaryTo="/knowledge/civilization-transformation"
        secondaryLabel="All Questions"
        secondaryTo="/questions"
      />
    </div>
  );
};

export default QuestionBetterCivilizationPage;