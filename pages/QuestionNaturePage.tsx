import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionNaturePage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'How Can Humanity Live in Harmony with Nature? — UGT Human Questions',
      'Exploring the shift from extraction to regeneration as a civilizational imperative.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="How Can Humanity Live in Harmony with Nature?" 
        subtitle="Not domination. Not separation. Reciprocity."
      />

      <ContentSection 
        eyebrow="Short Answer" 
        title="Harmony with nature means shifting from an extractive to a regenerative relationship — where human civilization contributes to the health, diversity, and resilience of the biosphere rather than degrading it." 
        lead="We are not separate from nature. We are nature becoming conscious of itself."
      >
        <Block>
          <P>
            "Harmony" does not mean stasis or romantic return to a pre-industrial past. It means <strong>dynamic reciprocity</strong>: human systems (agriculture, cities, energy, materials, waste) designed as functional extensions of ecological systems — cycling nutrients, building soil, purifying water, stabilizing climate, expanding habitat. This is technically possible now: regenerative agriculture, circular industry, renewable energy, nature-based cities, half-earth conservation. The barrier is not knowledge but civilizational architecture — incentives, governance, metrics, and the <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> to manage complexity at planetary scale.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Deeper Explanation" 
        title="From Extraction to Regeneration" 
        lead="A civilizational phase transition."
      >
        <Block>
          <P>
            <strong>Extractive Civilization (Current):</strong> Nature as resource stock and waste sink. Linear throughput. Externalized costs. Metrics: GDP, quarterly profit, production volume. Result: 6 of 9 planetary boundaries transgressed, 69% wildlife decline since 1970, climate emergency.
          </P>
          <P className="mt-4">
            <strong>Regenerative Civilization (Possible):</strong> Nature as living partner and foundation. Circular flows. Internalized value. Metrics: ecological health, flourishing, resilience, circularity. Result: soil building, biodiversity expanding, climate stabilizing, human thriving within planetary boundaries.
          </P>
          <P className="mt-4">
            The transition requires simultaneous shifts in: <strong>agriculture</strong> (industrial → regenerative), <strong>cities</strong> (concrete heat islands → urban ecosystems), <strong>energy</strong> (fossil → distributed renewable), <strong>materials</strong> (single-use → circular bio-materials), <strong>governance</strong> (short-term → intergenerational), <strong>economy</strong> (extraction → stewardship), <strong>culture</strong> (domination → kinship).
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Historical Perspective" 
        title="Harmony Is Not New — Scale Is" 
        lead="Indigenous cultures have maintained reciprocal relationships for millennia. The challenge is planetary scale."
      >
        <Block>
          <P>
            The "Ecological Indian" stereotype is both romanticized and dismissed, but the empirical record is clear: many pre-colonial societies managed landscapes for biodiversity and abundance through fire, polyculture, rotational harvesting, and spiritual protocols that enforced restraint. These were not "primitive" — they were sophisticated socio-ecological systems. What is new: 8 billion humans, globalized supply chains, synthetic chemistry, nuclear waste, climate change, AI. We cannot simply "return." We must <strong>integrate</strong> indigenous ecological wisdom with modern science, technology, and governance to create a regenerative civilization at unprecedented scale. This is what the <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> calls <strong>Ecological Intelligence</strong>.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Modern Possibilities" 
        title="Regeneration at Scale" 
        lead="Proofs of concept exist. The challenge is systemic integration."
      >
        <Block>
          <P>
            <strong>Regenerative Agriculture:</strong> 500M+ hectares transitioning globally. Builds soil carbon, increases yield resilience, restores water cycles, supports biodiversity. (Rodale, Savory, Regeneration International)
          </P>
          <P className="mt-4">
            <strong>Nature-Based Cities:</strong> Singapore (city in a garden), Milan (vertical forests), Copenhagen (cloudburst management), Melbourne (urban forest strategy). Cities that cool, filter, habitat, and inspire.
          </P>
          <P className="mt-4">
            <strong>Circular Industry:</strong> Industrial symbiosis (Kalundborg), chemical recycling, bio-based materials (mycelium, algae, agricultural waste), product-as-service models.
          </P>
          <P className="mt-4">
            <strong>Half-Earth / 30x30:</strong> Global biodiversity framework targeting 30% protection by 2030. Indigenous-led conservation proving most effective.
          </P>
          <P className="mt-4">
            <strong>Planetary Sensing:</strong> Satellites, eDNA, acoustic monitoring, AI species ID — real-time biosphere health dashboards enabling <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Different Viewpoints" 
        title="The Nature Relationship Debate" 
        lead="Anthropocentrism, biocentrism, ecocentrism, and the integration path."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Anthropocentric Stewardship">
            <P>
              Nature serves humans. Manage it wisely for our long-term benefit. Conservation for ecosystem services. Risk: instrumentalizes nature, misses intrinsic value, fails when services are "replaceable" by tech.
            </P>
          </Block>
          <Block title="Deep Ecology / Biocentrism">
            <P>
              Nature has intrinsic rights. Humans are one species among many. Radical population/reduction. Risk: politically impossible, ignores human suffering, no transition path for 8 billion.
            </P>
          </Block>
          <Block title="Ecomodernism">
            <P>
              Decouple human welfare from nature via technology (nuclear, vertical farming, synthetic biology). Concentrate humans in cities, rewild the rest. Risk: energy/material intensity, hubris, cultural alienation.
            </P>
          </Block>
          <Block title="Regenerative Integration (UGT)">
            <P>
              Humans as keystone species. Our role: tend, regenerate, participate. Not separate, not dominant. <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> managing complexity. <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> for participatory stewardship. Culture of reciprocity.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="UGT Perspective" 
        title="Ecological Intelligence as Civilizational Capacity" 
        lead="Harmony with nature is not optional — it is the boundary condition for all other flourishing."
      >
        <Block>
          <P>
            In the UGT framework, <strong>Ecological Intelligence</strong> is one of the ten intelligences in the <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a>. It is the capacity of civilization to perceive, understand, and steward its ecological embeddedness. It requires: <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> (modeling Earth systems), <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> (governance that responds to planetary signals), <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a> (humans who experience kinship with life), <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> (every human as steward). Without Ecological Intelligence, no other intelligence matters — the substrate collapses.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Concepts" 
        title="Connected UGT Concepts" 
        lead="Nature is the foundation; the other concepts are how we honor it."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/heaven-on-earth" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Heaven on Earth</a>
          <a href="/knowledge/civilization-transformation" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Civilization Transformation</a>
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Sources" 
        title="Where Factual Claims Come From" 
        lead="Planetary boundaries: Rockström et al. (2009, 2015, 2023). Biodiversity: IPBES, WWF Living Planet Report. Regenerative agriculture: Rodale, LaCanne & Lundgren, Project Drawdown. Indigenous stewardship: Garnett et al., IPBES. Circular economy: Ellen MacArthur Foundation. UGT framework: original synthesis."
      >
        <Block>
          <P className="text-sm text-zinc-600">
            This answer synthesizes established ecological, agricultural, and indigenous knowledge research with UGT's original conceptual framework. UGT-specific integrations (Ecological Intelligence, regenerative civilization architecture) are original proposals.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Blueprint" 
        subtitle="Ecological Intelligence is one of ten intelligences for a regenerative civilization."
        primaryLabel="Heaven on Earth Blueprint"
        primaryTo="/heaven-on-earth/blueprint"
        secondaryLabel="All Questions"
        secondaryTo="/questions"
      />
    </div>
  );
};

export default QuestionNaturePage;