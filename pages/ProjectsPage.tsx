import React from 'react';
import { PageHero, ContentSection, P, CTASection, CTAButton } from './PageKit';

interface ProjectsPageProps {
  onOpenIdModal: () => void;
}

const projectAreas = [
  { title: 'Human Development', description: 'Projects that strengthen the human journey. Child development, parent knowledge, education, relationships, mental resilience, lifelong learning and intergenerational knowledge.' },
  { title: 'Consciousness & Understanding', description: 'Projects that explore the inner world. Consciousness, attention, perception, memory, identity, dreams, meditation, meaning, neuroscience and philosophy.' },
  { title: 'Knowledge', description: 'Projects that connect what humanity has learned. Scientific knowledge, mathematics, biology, physics, medicine, engineering, philosophy, cultural knowledge and ancient knowledge.' },
  { title: 'Food & Water', description: 'Regenerative agriculture, soil restoration, water purification, rainwater systems, efficient irrigation, food preservation, local food networks and community gardens.' },
  { title: 'Planetary Restoration', description: 'Forest restoration, biodiversity, soil regeneration, water ecosystems, urban nature, clean energy, circular systems and ecological monitoring.' },
  { title: 'Health', description: 'Prevention, public health, health education, medical knowledge access, diagnostics research, healthcare logistics, nutrition and environmental health.' },
  { title: 'Education', description: 'Open learning, AI-assisted education, scientific literacy, critical thinking, local-language education, practical skills, creative learning and lifelong learning.' },
  { title: 'Intelligence & Technology', description: 'AI, robotics, biotechnology, computing, materials, energy, quantum technologies, space, simulation and human-machine collaboration.' },
  { title: 'Community', description: 'Community knowledge, shared resources, local enterprise, cooperative creation, intergenerational collaboration, skill exchange and shared learning.' },
  { title: 'Civilization', description: 'Governance, economics, cities, culture, peace, technology, cooperation, global knowledge, local resilience and planetary responsibility.' },
  { title: 'Creative Projects', description: 'Films, documentaries, scientific visualizations, interactive experiences, educational media, stories, art, experiments and digital worlds.' },
];

const projectJourney = ['Question', 'Discover', 'Design', 'Build', 'Test', 'Measure', 'Improve', 'Share', 'Replicate', 'Evolve'];

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenIdModal }) => (
  <>
      <PageHero
        eyebrow="Projects"
        title="Ideas Are Only the Beginning"
        subtitle="A better civilization is not created by describing it. It is created by building. UGT turns questions into practical projects that can be explored, tested, improved and shared."
      >
        <div className="mt-10">
          <a
            href="https://creatorcommunity.space"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-medium px-8 py-3.5 text-sm tracking-wider uppercase rounded-full transition-all duration-300 active:scale-95 bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10"
          >
            Enter the Work
          </a>
        </div>
      </PageHero>

    <ContentSection eyebrow="The Project Field" title="UNDERSTAND → BUILD → TEST → LEARN → SHARE" center>
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <P>
          Across human life, countless opportunities exist to make something better. A stronger beginning
          for a child. A new way to learn. A restored ecosystem. A new form of cooperation.
        </P>
        <P>The projects are different. The underlying principle is the same.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Living Experiments" title="A Project Is Not Declared Successful Because It Sounds Beautiful" className="bg-white/40">
      <div className="max-w-3xl space-y-5">
        <P>It enters reality. People use it. Evidence appears. Unexpected consequences emerge.</P>
        <P>The design changes. The next version becomes better.</P>
        <P>UGT treats every serious project as an opportunity to learn.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Project Fields" title="Where the Work Happens">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectAreas.map((area) => (
          <div key={area.title} className="rounded-2xl border border-zinc-200 bg-white p-7">
            <h4 className="text-base sm:text-lg font-medium text-zinc-900 mb-2">{area.title}</h4>
            <p className="text-sm text-zinc-600 font-light leading-relaxed">{area.description}</p>
          </div>
        ))}
      </div>
    </ContentSection>

    <ContentSection eyebrow="From One Project to a Network" title="The Relationships Create the Larger System" className="bg-white/40">
      <div className="flex flex-wrap gap-3 items-center max-w-4xl">
        {['Food', 'Water', 'Agriculture', 'Health', 'Education', 'Technology', 'Energy', 'Planet'].map((item, i) => (
          <React.Fragment key={item}>
            <span className="px-4 py-2 text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{item}</span>
            {i < 7 && <span className="text-zinc-400">→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-8 max-w-3xl">
        <P>UGT seeks to make those connections visible.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="Open Projects" title="Knowledge Becomes More Powerful When Others Can Examine It" center>
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <P>What was attempted? Why? What happened? What worked? What failed? What changed? What evidence exists? What can others improve?</P>
        <P>Open work allows civilization to learn from both success and failure.</P>
      </div>
    </ContentSection>

    <ContentSection eyebrow="The Project Journey" title="The Journey Never Truly Ends" center className="bg-white/40">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {projectJourney.map((step, i) => (
          <React.Fragment key={step}>
            <span className="px-3 py-2 text-xs sm:text-sm font-medium text-zinc-800 bg-white border border-zinc-200 rounded-full">{step}</span>
            {i < projectJourney.length - 1 && <span className="text-zinc-400 text-xs">→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-8 max-w-3xl mx-auto text-center">
        <P>Each completed project becomes knowledge for the next one.</P>
      </div>
    </ContentSection>

    <CTASection
      title="The Future Will Not Only Be Discovered."
      subtitle="It will be built. Together."
      primaryLabel="Enter the Work"
      primaryTo="https://creatorcommunity.space"
      secondaryLabel="Claim Your Universal ID"
      onOpenIdModal={onOpenIdModal}
    />
  </>
);

export default ProjectsPage;