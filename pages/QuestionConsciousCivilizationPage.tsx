import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionConsciousCivilizationPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'What is Conscious Civilization? — UGT Human Questions',
      'Understanding a civilization that perceives, understands, and deliberately steers its own trajectory.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="What is Conscious Civilization?" 
        subtitle="A civilization that wakes up, grows up, and takes responsibility for its own becoming."
      />

      <ContentSection 
        eyebrow="Short Answer" 
        title="Conscious Civilization is a civilization that possesses the sensory, cognitive, and governance capacity to perceive its own state, understand the consequences of its choices, and deliberately steer toward flourishing." 
        lead="Not a metaphor. A systems architecture."
      >
        <Block>
          <P>
            Today's civilization is largely unconscious: it reacts to crises after they erupt, optimizes for proxy metrics (GDP, engagement, votes) that diverge from actual wellbeing, lacks planetary-scale perception, and cannot coordinate at the speed and scale of its own impacts. A Conscious Civilization would have: <strong>planetary sensing</strong> (real-time health of biosphere, society, technology), <strong>integrated reasoning</strong> (<a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> synthesizing across domains), <strong>anticipatory governance</strong> (simulating consequences before acting), <strong>participatory agency</strong> (<a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> enabling every human to contribute), and <strong>flourishing alignment</strong> (objective function = <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>). It is a civilization that knows what it is doing.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Deeper Explanation" 
        title="The Architecture of Consciousness" 
        lead="Four functional layers, each necessary, none sufficient alone."
      >
        <Block>
          <P>
            <strong>1. Sensory Layer (Perception):</strong> Planetary nervous system. Satellites, IoT, genomic surveillance, economic flows, cultural signals, AI pattern detection — feeding a real-time, multi-resolution model of civilizational health. No blind spots. No lag.
          </P>
          <P className="mt-4">
            <strong>2. Cognitive Layer (Understanding):</strong> <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>. Human + synthetic synthesis. Causal modeling, not just correlation. Counterfactual simulation. Value-aware reasoning. Wisdom traditions integrated with data science. This layer answers: "What is happening? Why? What might happen if we do X?"
          </P>
          <P className="mt-4">
            <strong>3. Governance Layer (Agency):</strong> Institutions that can act on understanding. Subsidiarity (local where possible, global where necessary). Long-term mandates (century commissions, future generations trustees). Algorithmic accountability. Participatory deliberation at scale. Emergency protocols for existential risks. This layer answers: "What will we do? Who decides? How do we learn?"
          </P>
          <P className="mt-4">
            <strong>4. Cultural Layer (Identity):</strong> A civilization that *sees itself* as a conscious entity. Shared narrative of stewardship. Rituals of planetary awareness. Education for systems citizenship. Art that makes the invisible visible. This layer answers: "Who are we? What is our purpose?"
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Historical Perspective" 
        title="Civilizations Have Never Been Fully Conscious" 
        lead="They stumbled, adapted, collapsed, or endured. Consciousness is a new possibility."
      >
        <Block>
          <P>
            No past civilization had planetary sensing, synthetic intelligence, or global coordination. They operated on local feedback (harvest, plague, invasion) with local reasoning (tradition, religion, decree) and local governance (tribe, city-state, empire). Some developed remarkable wisdom (axial age philosophies, indigenous stewardship, early science) but lacked the *infrastructure* to apply it at civilizational scale. We are the first species with the *technical capacity* for Conscious Civilization. Whether we develop the *wisdom* to use it is the question of our time.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Modern Possibilities" 
        title="The Infrastructure Is Being Built — Fragmentedly" 
        lead="Pieces exist. Integration does not."
      >
        <Block>
          <P>
            <strong>Sensing:</strong> Earth observation (Copernicus, Landsat, commercial), Global Biodiversity Information Facility, financial transaction monitoring, disease surveillance (GISAID), internet topology mapping.
          </P>
          <P className="mt-4">
            <strong>Reasoning:</strong> Climate models (CMIP), economic models (DSGE, agent-based), epidemiological models, AI foundation models, collective intelligence platforms (Metaculus, Pol.is).
          </P>
          <P className="mt-4">
            <strong>Governance:</strong> UN SDGs (flawed but universal), Paris Agreement (voluntary but global), future generations commissioners (Wales, Hungary), participatory budgeting (Porto Alegre, Paris), algorithmic auditing (EU AI Act).
          </P>
          <P className="mt-4">
            <strong>Culture:</strong> Overview effect (astronauts), Earthrise photo, climate movement, effective altruism, solarpunk, UGT.
          </P>
          <P className="mt-4">
            The gap: these are siloed, underfunded, politically contested, and not integrated into a coherent civilizational nervous system. The <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> is an attempt at that integration.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Different Viewpoints" 
        title="Is Conscious Civilization Desirable? Possible? Dangerous?" 
        lead="The concept challenges deep assumptions about freedom, complexity, and human nature."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Technocratic Risk">
            <P>
              "Conscious Civilization" sounds like centralized control. Who defines "flourishing"? Who controls the sensors? Who programs the AI? This is a recipe for algorithmic tyranny. Consciousness requires a single center — dangerous.
            </P>
          </Block>
          <Block title="Complexity Skepticism">
            <P>
              Civilization is too complex to model, predict, or steer. Unintended consequences dominate. The "consciousness" is an illusion of control. Better: resilient decentralization, not central perception.
            </P>
          </Block>
          <Block title="Human Nature Objection">
            <P>
              Humans are tribal, short-term, self-deceiving. We cannot sustain the discipline, rationality, and altruism required. Conscious Civilization assumes better humans than exist.
            </P>
          </Block>
          <Block title="UGT Response">
            <P>
              Conscious Civilization is not central control — it is *distributed perception* and *subsidiarity*. It does not assume perfect humans — it builds institutions that compensate for human limits (bias, short-termism, tribalism). It is not a final state — it is a learning architecture. The alternative is unconscious drift toward collapse.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="UGT Perspective" 
        title="Conscious Civilization as the Governance Layer of the Blueprint" 
        lead="It is the 'how' that makes the 'what' possible."
      >
        <Block>
          <P>
            In the UGT framework, <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> is the governance intelligence of the <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> — specifically <strong>Systems Intelligence</strong> (integration logic) and <strong>Collective Intelligence</strong> (participatory governance). It is the structure that translates <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> insights into coordinated action, ensures <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> holders have real agency, and holds the <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a> objective function accountable. Without Conscious Civilization, the Blueprint is a document. With it, the Blueprint is a living operating system for civilization.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Concepts" 
        title="Connected UGT Concepts" 
        lead="Conscious Civilization integrates all other concepts into a steering system."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/civilization-transformation" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Civilization Transformation</a>
          <a href="/knowledge/universal-id" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Universal ID</a>
          <a href="/knowledge/human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Flourishing</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Sources" 
        title="Where Factual Claims Come From" 
        lead="Systems theory: von Bertalanffy, Meadows, Bar-Yam. Governance: Ostrom, Helbing, Barber, Bostrom. Planetary sensing: NASA, ESA, GEO. Collective intelligence: Malone, Woolley, Surowiecki. UGT framework: original synthesis."
      >
        <Block>
          <P className="text-sm text-zinc-600">
            This answer synthesizes established research in systems theory, governance innovation, and collective intelligence with UGT's original conceptual framework. UGT-specific integrations (four-layer architecture, Blueprint governance intelligence) are original proposals.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Knowledge Library" 
        subtitle="Deep dive into the architecture of Conscious Civilization."
        primaryLabel="Conscious Civilization"
        primaryTo="/knowledge/conscious-civilization"
        secondaryLabel="All Questions"
        secondaryTo="/questions"
      />
    </div>
  );
};

export default QuestionConsciousCivilizationPage;