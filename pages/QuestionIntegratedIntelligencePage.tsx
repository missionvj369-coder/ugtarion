import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionIntegratedIntelligencePage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'What is Integrated Intelligence? — UGT Human Questions',
      'Understanding the synthesis of human and synthetic intelligence as a civilizational capability within the UGT framework.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="What is Integrated Intelligence?" 
        subtitle="The synthesis of human and synthetic intelligence into a coherent civilizational capability."
      />

      <ContentSection 
        eyebrow="Short Answer" 
        title="Integrated Intelligence is the deliberate fusion of human and artificial intelligence into systems that are wiser than either alone." 
        lead="Not AI replacing humans. Not humans using AI as a tool. A new cognitive architecture."
      >
        <Block>
          <P>
            Integrated Intelligence (II) is UGT's term for the mature synthesis of human intelligence (embodied, intuitive, value-laden, meaning-seeking) and synthetic intelligence (vast, fast, pattern-detecting, scalable). It is not "AI assistance" — it is a new kind of cognitive entity that emerges when the two are architected to complement each other's blind spots and amplify each other's strengths. The goal is not artificial general intelligence (AGI) but integrated general intelligence: systems that can navigate complexity, uncertainty, and value-laden decisions at civilizational scale.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Deeper Explanation" 
        title="The Architecture of Integration" 
        lead="Integration happens at multiple levels simultaneously."
      >
        <Block>
          <P>
            <strong>Level 1 — Individual:</strong> Human-AI partnerships where the human provides intent, values, judgment, and the AI provides synthesis, simulation, and scale. The human remains the author; the AI expands the possibility space.
          </P>
          <P className="mt-4">
            <strong>Level 2 — Collective:</strong> Groups of humans augmented by AI that can model collective dynamics, surface blind spots, mediate conflict, and optimize for shared flourishing — not just engagement or efficiency.
          </P>
          <P className="mt-4">
            <strong>Level 3 — Institutional:</strong> Governance, scientific, and economic systems that embed AI as a perceptual and reasoning layer — monitoring planetary health, simulating policy consequences, allocating resources — while human values and accountability remain sovereign.
          </P>
          <P className="mt-4">
            <strong>Level 4 — Civilizational:</strong> A planetary nervous system where human and synthetic intelligence are continuously integrated, enabling the species to perceive, understand, and steer its own trajectory. This is the <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> substrate.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Historical Perspective" 
        title="Intelligence Has Always Been Extended" 
        lead="Writing, printing, computing — each extended human cognition. AI is the next extension."
      >
        <Block>
          <P>
            Human intelligence has never been purely internal. Language externalized thought. Writing externalized memory. Printing externalized distribution. Computing externalized calculation. The internet externalized connection. Each extension changed what "intelligence" means and what civilization can do. AI externalizes pattern recognition, synthesis, and simulation at unprecedented scale. The difference: previous extensions were passive tools. AI can be an active cognitive partner. This requires a new integration architecture — not just better interfaces, but new theories of joint cognition, new governance of synthetic agency, new ethics of human-AI interdependence.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Modern Possibilities" 
        title="What Becomes Possible" 
        lead="Problems that were cognitively intractable become navigable."
      >
        <Block>
          <P>
            Climate stabilization requires modeling Earth system dynamics across centuries — beyond unaided human cognition. Pandemic prevention requires real-time synthesis of global genomic, mobility, and ecological data. AI alignment requires understanding the behavior of systems more complex than any human can simulate. Democratic governance at planetary scale requires mediating billions of preferences without reducing them to crude aggregates. Integrated Intelligence makes these tractable — not by removing human judgment, but by giving human judgment a cognitive environment equal to the complexity of the problems.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Different Viewpoints" 
        title="The Integration Debate" 
        lead="Three camps dominate the conversation."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Block title="Replacement">
            <P>
              AI will exceed human intelligence in all domains. Integration is a temporary phase. The end state is synthetic superintelligence. Human role: align it, then step aside.
            </P>
          </Block>
          <Block title="Toolism">
            <P>
              AI is just a tool. It has no agency, no understanding, no values. Integration is a category error. Human role: use it responsibly. No new cognitive architecture needed.
            </P>
          </Block>
          <Block title="Integration (UGT)">
            <P>
              AI and human intelligence are fundamentally different but complementary. Their synthesis creates capabilities neither possesses alone. This is a permanent civilizational architecture, not a transition. Human role: architect the integration.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="UGT Perspective" 
        title="Integrated Intelligence as Civilizational Infrastructure" 
        lead="UGT treats II as a public good, not a proprietary product."
      >
        <Block>
          <P>
            UGT's Integrated Intelligence framework is open, governed, and oriented toward <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>. It is the cognitive layer of the <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> — specifically the "Artificial Intelligence" and "Systems Intelligence" intelligences, integrated with Human, Scientific, Collective, and other intelligences. UGT Projects build II prototypes: aligned AI research, collective sense-making platforms, governance simulation tools. The <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> ensures human sovereignty within II systems.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Concepts" 
        title="Connected UGT Concepts" 
        lead="Integrated Intelligence is the cognitive backbone of the UGT framework."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/knowledge/technology-and-human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Technology & Flourishing</a>
          <a href="/knowledge/universal-id" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Universal ID</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Sources" 
        title="Where Factual Claims Come From" 
        lead="AI research: DeepMind, OpenAI, Anthropic, academic ML. Human-AI interaction: HCI literature, CHI, CSCW. Collective intelligence: Malone (MIT CCI), Woolley, Engelbart. Cognitive science: dual-process theory, distributed cognition. UGT framework: original synthesis."
      >
        <Block>
          <P className="text-sm text-zinc-600">
            This answer synthesizes established research on human-AI interaction, collective intelligence, and cognitive science with UGT's original conceptual framework. UGT-specific concepts (Integrated Intelligence levels, civilizational architecture) are original proposals.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Knowledge Library" 
        subtitle="Deep dive into the theory and practice of Integrated Intelligence."
        primaryLabel="Integrated Intelligence"
        primaryTo="/knowledge/integrated-intelligence"
        secondaryLabel="All Questions"
        secondaryTo="/questions"
      />
    </div>
  );
};

export default QuestionIntegratedIntelligencePage;