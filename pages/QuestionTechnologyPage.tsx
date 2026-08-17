import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionTechnologyPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'How Can Technology Improve Human Life? — UGT Human Questions',
      'Examining the conditions under which technology amplifies human flourishing rather than undermining it.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="How Can Technology Improve Human Life?" 
        subtitle="Technology is not neutral. Its impact depends on the values and architecture that shape it."
      />

      <ContentSection 
        eyebrow="Short Answer" 
        title="Technology improves human life when it is designed, governed, and integrated to expand human capabilities, deepen human connections, and regenerate the living world — not when it extracts attention, replaces agency, or externalizes harm." 
        lead="The question is not what technology *can* do, but what we *choose* to build and why."
      >
        <Block>
          <P>
            History shows technology's impact is not predetermined. The same nuclear physics produced energy and weapons. The same internet produced Wikipedia and surveillance capitalism. The same AI can diagnose disease or optimize addiction. The difference is not in the technology — it is in the <strong>intent, architecture, and governance</strong> that surround it. UGT's framework for beneficial technology: <strong>Integrated Intelligence</strong> (human + synthetic, not replacement), <strong>Alignment</strong> (technology serves flourishing metrics, not proxy metrics), <strong>Sovereignty</strong> (humans remain authors), <strong>Regeneration</strong> (technology heals ecological damage), <strong>Participation</strong> (Universal ID ensures inclusive benefit).
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Deeper Explanation" 
        title="Five Conditions for Beneficial Technology" 
        lead="A checklist for every technological choice."
      >
        <Block>
          <P>
            <strong>1. Capability Amplification, Not Replacement:</strong> Does it expand what humans can do, understand, create, decide? Or does it atrophy human skill, judgment, connection?
          </P>
          <P className="mt-4">
            <strong>2. Flourishing Alignment:</strong> Is its objective function correlated with multidimensional <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>? Or does it optimize for engagement, extraction, efficiency, control?
          </P>
          <P className="mt-4">
            <strong>3. Ecological Regeneration:</strong> Does it reduce material/energy throughput, restore ecosystems, enable circularity? Or does it accelerate depletion?
          </P>
          <P className="mt-4">
            <strong>4. Distributed Agency:</strong> Does it concentrate power in few hands (platforms, states, labs)? Or does it distribute capability widely (open source, local fabrication, <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> participation)?
          </P>
          <P className="mt-4">
            <strong>5. Wisdom Integration:</strong> Does it embed ethical, cultural, long-term reasoning? Or does it operate in a values vacuum, externalizing consequences?
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Historical Perspective" 
        title="Technology Has Always Been Double-Edged" 
        lead="Fire cooked food and burned villages. Writing preserved wisdom and enabled bureaucracy. The pattern is ancient."
      >
        <Block>
          <P>
            The Neolithic Revolution (agriculture) enabled civilization but introduced hierarchy, disease, and ecological overshoot. The Industrial Revolution lifted billions from poverty but destabilized the climate. The Digital Revolution connected humanity but fractured attention and truth. Each wave brought real gains and real harms. The difference now: the speed, scale, and irreversibility of consequences (AI alignment, synthetic biology, climate tipping points) leave no margin for the traditional "invent first, regulate later" cycle. We must design for wisdom *before* deployment.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Modern Possibilities" 
        title="What Beneficial Technology Looks Like Now" 
        lead="Examples exist. They are just not the dominant business model."
      >
        <Block>
          <P>
            <strong>Health:</strong> AI protein folding (AlphaFold) accelerating drug discovery. Open-source medical hardware. Telemedicine reaching remote communities.
          </P>
          <P className="mt-4">
            <strong>Ecology:</strong> Satellite monitoring stopping illegal deforestation in real time. Precision regenerative agriculture. Distributed renewable microgrids.
          </P>
          <P className="mt-4">
            <strong>Governance:</strong> Participatory budgeting platforms. Digital twins for urban planning. Algorithmic auditing for fairness.
          </P>
          <P className="mt-4">
            <strong>Cognition:</strong> Tools for thought (Roam, Obsidian, Logseq) extending memory and synthesis. AI research assistants (Elicit, Semantic Scholar) accelerating science.
          </P>
          <P className="mt-4">
            <strong>Connection:</strong> Translation breaking language barriers. Platforms for deliberative democracy (Pol.is, Loomio). Creator economies (UGT <a href="/media" className="text-indigo-600 hover:underline">Media</a>).
          </P>
          <P className="mt-4">
            These exist because someone chose flourishing over extraction. The challenge is making this the *default*, not the exception.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Different Viewpoints" 
        title="The Technology Debate" 
        lead="Techno-optimism, techno-pessimism, and the integration path."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Block title="Techno-Optimism">
            <P>
              Technology solves the problems technology creates. More innovation, faster, fewer regulations. Abundance is coming. Risk: ignores alignment, power concentration, ecological limits, meaning.
            </P>
          </Block>
          <Block title="Techno-Pessimism">
            <P>
              Technology is inherently alienating, controlling, ecocidal. Slow down, low-tech, localize, resist. Risk: abandons billions to preventable suffering, ignores real gains, no path for 8 billion.
            </P>
          </Block>
          <Block title="Integration (UGT)">
            <P>
              Technology is a lever. Its direction depends on who holds it and toward what end. Build <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>. Align to flourishing. Distribute via <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a>. Govern via <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="UGT Perspective" 
        title="Technology as Civilizational Infrastructure" 
        lead="UGT treats technology not as a sector but as the nervous system of civilization."
      >
        <Block>
          <P>
            In the UGT framework, technology is the material expression of <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>. The <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> dedicates three of its ten intelligences to technology: <strong>Artificial Intelligence</strong> (synthetic cognition), <strong>Technological Intelligence</strong> (material systems), and <strong>Systems Intelligence</strong> (integration logic). UGT Projects prototype aligned technology: open AI research, flourishing-aligned platforms, regenerative systems. The <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> ensures every human can participate in shaping the technological future.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Concepts" 
        title="Connected UGT Concepts" 
        lead="Technology is the lever; the other concepts determine its direction."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/technology-and-human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Technology & Flourishing</a>
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/universal-id" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Universal ID</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Sources" 
        title="Where Factual Claims Come From" 
        lead="Technology studies: Winner, Ellul, Feenberg, Jasanoff. AI alignment: Russell, Christiano, Amodei. Digital ethics: Zuboff, Lanier, Harris. Appropriate technology: Schumacher, Illich. UGT framework: original synthesis."
      >
        <Block>
          <P className="text-sm text-zinc-600">
            This answer synthesizes established research in philosophy of technology, AI alignment, and digital ethics with UGT's original conceptual framework. UGT-specific integrations (five conditions, Blueprint intelligences) are original proposals.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore Technology & Flourishing" 
        subtitle="Deep dive into the UGT framework for aligned technology."
        primaryLabel="Technology & Human Flourishing"
        primaryTo="/knowledge/technology-and-human-flourishing"
        secondaryLabel="All Questions"
        secondaryTo="/questions"
      />
    </div>
  );
};

export default QuestionTechnologyPage;