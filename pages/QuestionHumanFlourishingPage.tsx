import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const QuestionHumanFlourishingPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'What Does Human Flourishing Mean? — UGT Human Questions',
      'Exploring the multidimensional nature of human flourishing beyond material prosperity within the UGT framework.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="What Does Human Flourishing Mean?" 
        subtitle="Beyond GDP, beyond happiness — the full dimensionality of a life well-lived."
      />

      <ContentSection 
        eyebrow="Short Answer" 
        title="Human flourishing is the realization of human potential across biological, psychological, social, creative, and spiritual dimensions — not merely the absence of suffering or the presence of pleasure." 
        lead="It is what makes a life worth living, and a civilization worth building."
      >
        <Block>
          <P>
            Flourishing is not a single metric. It is a multidimensional condition: physical health and vitality; psychological depth (meaning, autonomy, mastery, connection); social embeddedness (belonging, trust, reciprocity, love); creative expression (making, discovering, contributing); moral development (virtue, justice, care); and spiritual openness (awe, purpose, transcendence). A society that optimizes for only one dimension — wealth, safety, efficiency, happiness — produces a stunted humanity. True flourishing requires the integration of all dimensions, for all people, sustainably.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Deeper Explanation" 
        title="The Dimensions of Flourishing" 
        lead="A taxonomy drawn from philosophy, psychology, biology, and cross-cultural wisdom."
      >
        <Block>
          <P>
            <strong>1. Biological Flourishing:</strong> Health, longevity, freedom from preventable disease, nutrition, sleep, movement, environmental quality. The substrate.
          </P>
          <P className="mt-4">
            <strong>2. Psychological Flourishing:</strong> Autonomy (self-governance), competence (mastery), relatedness (connection), purpose (meaning), positive emotion (joy, gratitude, awe). The inner life.
          </P>
          <P className="mt-4">
            <strong>3. Social Flourishing:</strong> Belonging, trust, reciprocity, intimacy, community, justice, participation in governance. The relational life.
          </P>
          <P className="mt-4">
            <strong>4. Creative Flourishing:</strong> Expression, discovery, innovation, craft, art, problem-solving, legacy. The generative life.
          </P>
          <P className="mt-4">
            <strong>5. Moral Flourishing:</strong> Virtue (courage, wisdom, temperance, justice), care, responsibility, integrity, alignment with the good. The ethical life.
          </P>
          <P className="mt-4">
            <strong>6. Spiritual Flourishing:</strong> Awe, wonder, transcendence, connection to something larger, peace with mortality, reverence for life. The orienting life.
          </P>
          <P className="mt-4">
            These dimensions are not independent. They co-regulate. A society that destroys community for efficiency damages psychological and moral flourishing. A culture that suppresses awe for productivity damages spiritual and creative flourishing. Integration is the key.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Historical Perspective" 
        title="Flourishing Across Traditions" 
        lead="Eudaimonia, Shalom, Ubuntu, Buen Vivir, Gross National Happiness — the concept is universal."
      >
        <Block>
          <P>
            Aristotle's <em>eudaimonia</em> (flourishing through virtue and reason). Hebrew <em>shalom</em> (wholeness, peace, right relationship). African <em>ubuntu</em> ("I am because we are"). Andean <em>buen vivir</em> (living well in harmony with nature). Bhutan's Gross National Happiness (nine domains including psychological wellbeing, culture, ecology). Confucian <em>ren</em> (humaneness through relationship). The Perennial Philosophy: flourishing is the proper end of human life, recognized across civilizations. Modernity's error was reducing this richness to "standard of living" (material consumption) or "subjective wellbeing" (self-reported happiness). UGT restores the full dimensionality.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Modern Possibilities" 
        title="Measuring What Matters" 
        lead="We can now measure flourishing more rigorously than GDP."
      >
        <Block>
          <P>
            Advances in psychology (PERMA, self-determination theory), economics (capabilities approach — Sen, Nussbaum), public health (social determinants), and data science (planetary sensing, digital phenotyping) allow multidimensional flourishing measurement at population scale. UGT advocates replacing GDP as the primary civilizational metric with a Flourishing Index: composite, transparent, participatory, tracked at local and global levels. This changes what governments optimize for, what businesses build, what technologies prioritize, what education cultivates.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Different Viewpoints" 
        title="Contested Terrain" 
        lead="Not everyone agrees on what flourishing includes — or whether it should be a public goal."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Liberal Neutrality">
            <P>
              The state should not define "the good life." Flourishing is subjective. Public policy should provide neutral resources (rights, markets, safety) and let individuals choose. Defining flourishing collectively is paternalistic.
            </P>
          </Block>
          <Block title="Objective List / Capabilities">
            <P>
              Some things are objectively good for humans (health, knowledge, friendship, autonomy) regardless of preference. A society that fails to provide these fails its people. Measurement enables accountability. The capabilities approach operationalizes this.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="UGT Perspective" 
        title="Flourishing as Civilizational Teleology" 
        lead="UGT treats flourishing as the measurable outcome of a conscious civilization."
      >
        <Block>
          <P>
            In the UGT framework, <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a> is not a vague aspiration — it is the <strong>objective function</strong> of <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a>. Every UGT Project, every Knowledge Library entry, every Blueprint intelligence is evaluated against: does this expand the conditions for multidimensional flourishing, for all people, sustainably? <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> is the cognitive means. <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> is the governance means. <a href="/knowledge/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> is the participation means. <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a> is the aspirational horizon where flourishing is universal.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Concepts" 
        title="Connected UGT Concepts" 
        lead="Flourishing is the outcome; the other concepts are the means."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Flourishing</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/knowledge/civilization-transformation" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Civilization Transformation</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/heaven-on-earth" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Heaven on Earth</a>
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/technology-and-human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Technology & Flourishing</a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Sources" 
        title="Where Factual Claims Come From" 
        lead="Philosophy: Aristotle, Nussbaum, Sen, MacIntyre. Psychology: Seligman (PERMA), Ryan & Deci (SDT), Keyes. Economics: capabilities approach, OECD Better Life Index. Public health: social determinants. Cross-cultural: Ubuntu, Buen Vivir, GNH. UGT framework: original synthesis."
      >
        <Block>
          <P className="text-sm text-zinc-600">
            This answer synthesizes established philosophical, psychological, and economic research on human flourishing with UGT's original conceptual framework. UGT-specific integrations (flourishing as civilizational objective function, connection to Blueprint intelligences) are original proposals.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Explore the Knowledge Library" 
        subtitle="Deep dive into the theory and measurement of human flourishing."
        primaryLabel="Human Flourishing"
        primaryTo="/knowledge/human-flourishing"
        secondaryLabel="All Questions"
        secondaryTo="/questions"
      />
    </div>
  );
};

export default QuestionHumanFlourishingPage;