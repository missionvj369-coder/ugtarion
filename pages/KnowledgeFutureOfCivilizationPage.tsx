import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeFutureOfCivilizationPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Future of Civilization — UGT Knowledge Library',
      'Mapping the trajectory of human development in the age of integrated intelligence within the UGT framework.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Future of Civilization" 
        subtitle="Mapping the trajectory of human development in the age of integrated intelligence."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What Do We Mean by the Future of Civilization?" 
        lead="Not prediction. Navigation."
      >
        <Block>
          <P>
            The Future of Civilization, in the UGT framework, is not a forecast. It is a design space — the set of possible civilizational trajectories that lie ahead, given current trends, emerging technologies, and human choices. It is the map we draw to navigate territory we have not yet entered.
          </P>
          <P className="mt-4">
            This map has coordinates: technological maturity (AI, bio, energy, space), ecological stability, governance capacity, cultural coherence, meaning saturation, and the degree of integration among our intelligences. Each civilization occupies a position in this space. The question is not where we are, but where we are heading — and whether we have the agency to change course.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why Mapping the Future Matters" 
        lead="Civilizations that do not think in centuries think only in quarters — and perish."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="The Time Horizon Mismatch">
            <P>
              Markets think in quarters. Democracies think in election cycles. Technologies think in sprints. But civilizational consequences — climate, AI alignment, nuclear legacy, genetic modification — unfold over decades and centuries. The Future of Civilization framework forces the time horizon to match the consequence horizon.
            </P>
          </Block>
          <Block title="Agency Requires Alternatives">
            <P>
              You cannot choose a future you cannot imagine. By mapping the space of possible futures — collapse, stagnation, managed decline, conscious transformation, flourishing expansion — UGT restores agency. The future is not something that happens to us. It is something we build, or fail to build.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="The future is the child of the present."
      >
        <Block>
          <P>
            The Future of Civilization is shaped by every other concept in the UGT framework. <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a> determines who we become. <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> determines how we think. <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a> determines what we value. <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a> determines how we organize. <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a> determines whether we can steer. <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a> determines what we aim for.
          </P>
          <P className="mt-4">
            The future is not a separate domain. It is the time-extended expression of the choices we make today in each of these domains.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="Three Horizons" 
        lead="UGT works across three temporal horizons simultaneously."
      >
        <Block>
          <P>
            <strong>Horizon 1 (Now–5 years):</strong> Seed the infrastructure. Universal ID deployment. Knowledge Library completion. First UGT Projects launched. Creator Community activated. Blueprint v1 published.
          </P>
          <P className="mt-4">
            <strong>Horizon 2 (5–25 years):</strong> Demonstrate at scale. Integrated Intelligence pilots in governance, education, ecology. Conscious Civilization dashboards operational. UGT India and other national expressions mature. Network of flourishing communities measurable.
          </P>
          <P className="mt-4">
            <strong>Horizon 3 (25–100+ years):</strong> Civilizational phase transition. A humanity that is consciously evolving, intelligently integrated, flourishing by design, and capable of stewarding its own future — and the future of the living world — across deep time.
          </P>
          <P className="mt-4">
            This is not a prediction. It is a commitment. The Future of Civilization is what we make it. UGT exists to make the flourishing branch more probable, more accessible, and more irreversible.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Begin at the Beginning" 
        subtitle="The future of civilization starts with the evolution of the human."
        primaryLabel="Human Evolution"
        primaryTo="/knowledge/human-evolution"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeFutureOfCivilizationPage;