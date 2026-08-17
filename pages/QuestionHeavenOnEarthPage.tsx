import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionHeavenOnEarthPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Can Humanity Create Heaven on Earth? — UGT Human Questions',
      'Exploring whether humanity can systematically reduce suffering, expand flourishing, and build a civilization aligned with its highest aspirations.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Can Humanity Create Heaven on Earth?" 
        subtitle="Examining the practical possibility of a civilization where suffering is minimized, dignity is universal, and flourishing is the norm."
      />

      <ContentSection 
        eyebrow="Short Answer" 
        title="Yes — as a direction, not a destination." 
        lead="Heaven on Earth is achievable as an ever-deepening condition of civilization, not a final static state."
      >
        <Block>
          <P>
            UGT treats Heaven on Earth as a civilizational design target: a world where preventable suffering is systematically eliminated, where every human has the conditions for flourishing, where technology serves life, and where humanity lives in dynamic harmony with the living world. This is not a theological promise or a utopian fantasy — it is an engineering and governance challenge. Progress is measurable: reduction in extreme poverty, disease, violence, ecological degradation; increase in health, education, creative freedom, meaningful participation. The question is not whether perfection is possible (it is not), but whether each generation can leave the world more heaven-like than it found it. The answer, historically, is yes — when we choose to.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Deeper Explanation" 
        title="What Would It Take?" 
        lead="Heaven on Earth requires the simultaneous maturation of multiple civilizational capacities."
      >
        <Block>
          <P>
            No single breakthrough creates Heaven on Earth. It emerges from the integration of:
          </P>
          <ul className="list-disc list-inside space-y-3 mt-4 text-zinc-700">
            <li><strong>Integrated Intelligence</strong> — to solve hyper-complex problems (climate, disease, coordination) with wisdom, not just processing power.</li>
            <li><strong>Conscious Civilization</strong> — institutions that can perceive systemic health and steer deliberately toward flourishing.</li>
            <li><strong>Human Evolution</strong> — individuals capable of the empathy, foresight, and complexity required to participate in such a civilization.</li>
            <li><strong>Civilization Transformation</strong> — restructuring governance, economy, education, and culture to align incentives with life.</li>
            <li><strong>Universal ID</strong> — enabling every human to participate, contribute, and be recognized in the collective project.</li>
          </ul>
          <P className="mt-4">
            Each of these is a massive undertaking. None is sufficient alone. Together, they form the architecture of a civilization that can progressively realize the Heaven on Earth aspiration.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Historical Perspective" 
        title="What History Tells Us" 
        lead="Humanity has already created 'heavens' relative to our past."
      >
        <Block>
          <P>
            Compared to 1000 years ago, much of the modern world already resembles what our ancestors would have called Heaven on Earth: anesthesia, antibiotics, electricity, instant global communication, democratic rights, scientific understanding of the universe, life expectancy doubled, child mortality collapsed, literacy near-universal. These were not gifts of luck — they were built, choice by choice, generation by generation. The same capacity that produced these miracles is available for the next set: eliminating the remaining extreme poverty, curing the remaining diseases, restoring the damaged biosphere, aligning AI with human values, building governance that works at planetary scale. The precedent exists. The question is whether we will apply it with sufficient wisdom and speed.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Modern Possibilities" 
        title="What Makes This Moment Different" 
        lead="For the first time, we have the tools to design civilization intentionally."
      >
        <Block>
          <P>
            Previous improvements were largely emergent — the cumulative result of countless uncoordinated innovations. Today, we possess: planetary sensing (satellites, IoT, global data), planetary communication (internet, translation, collaboration platforms), synthetic intelligence (AI that can model complex systems, optimize designs, accelerate science), and a growing theoretical understanding of complex adaptive systems. This means we can — for the first time — model the consequences of civilizational choices before making them, coordinate global action at unprecedented speed, and design institutions that learn and adapt. The Heaven on Earth Blueprint (UGT's ten-intelligence framework) is an attempt to use these tools systematically.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Different Viewpoints" 
        title="Why Reasonable People Disagree" 
        lead="The concept triggers deep philosophical, theological, and political divides."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Skeptics Argue">
            <P>
              "Heaven on Earth" is a dangerous idea — it has justified totalitarianism (forcing paradise), complacency (waiting for paradise), and delusion (ignoring trade-offs). Suffering is intrinsic to the human condition; eliminating it eliminates meaning. Utopianism leads to dystopia.
            </P>
          </Block>
          <Block title="Proponents Argue">
            <P>
              The alternative — accepting preventable suffering as inevitable — is morally indefensible. We don't need perfection; we need progress. The aspiration is a compass, not a blueprint for coercion. Every reduction in suffering, every expansion of dignity, is a real heaven created on earth.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="UGT Perspective" 
        title="The UGT Position" 
        lead="Heaven on Earth is a practical aspiration, not a dogma."
      >
        <Block>
          <P>
            UGT does not claim Heaven on Earth is guaranteed, inevitable, or even probable without deliberate effort. It claims it is <strong>possible</strong> — physically, biologically, informationally, socially — and that the pursuit of it is the most worthy civilizational project. UGT's contribution is the architectural framework (Integrated Intelligence, Conscious Civilization, Universal ID, the Blueprint) that makes the pursuit coherent, measurable, and participatory. We invite disagreement on the details. We insist on the seriousness of the direction.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Concepts" 
        title="Connected UGT Concepts" 
        lead="This question touches every pillar of the UGT framework."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/heaven-on-earth" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Heaven on Earth</a>
          <a href="/knowledge/civilization-transformation" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Civilization Transformation</a>
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Flourishing</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Sources" 
        title="Where Factual Claims Come From" 
        lead="Historical progress data: Our World in Data, UN Human Development Reports, World Bank. Civilizational risk analysis: Toby Ord (The Precipice), Nick Bostrom, Centre for the Study of Existential Risk. Complex systems theory: SFI, NECSI. UGT framework: original synthesis."
      >
        <Block>
          <P className="text-sm text-zinc-600">
            This answer synthesizes established data on human progress with UGT's original conceptual framework. Historical claims are verifiable through cited sources. UGT-specific concepts (Integrated Intelligence, Conscious Civilization, Blueprint) are original proposals, not established scientific consensus.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Blueprint" 
        subtitle="The practical roadmap for manifesting Heaven on Earth through ten integrated intelligences."
        primaryLabel="Heaven on Earth Blueprint"
        primaryTo="/heaven-on-earth/blueprint"
        secondaryLabel="All Questions"
        secondaryTo="/questions"
      />
    </div>
  );
};

export default QuestionHeavenOnEarthPage;