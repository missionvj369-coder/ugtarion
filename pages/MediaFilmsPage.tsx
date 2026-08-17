import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const MediaFilmsPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'UGT Films — Cinematic Works on the Future of Civilization',
      'Explore UGT\'s cinematic projects — feature-length films and series exploring human evolution, consciousness, and civilization transformation.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="UGT Films" 
        subtitle="Cinematic storytelling for the civilization transition — feature films, docuseries, and narrative works."
      />

      <ContentSection 
        eyebrow="About UGT Films" 
        title="Narrative as a civilization design tool." 
        lead="Stories are how civilizations remember who they are and imagine who they could become."
      >
        <Block>
          <P>
            UGT Films produces feature-length documentaries, narrative films, and docuseries that explore the deepest questions facing humanity: <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a>, <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>, <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>, <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a>, <a href="/knowledge/future-of-civilization" className="text-indigo-600 hover:underline">Future of Civilization</a>, and the <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a>.
          </P>
          <P className="mt-4">
            Film is the most immersive form of <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> — it weaves narrative, visual, auditory, emotional, and conceptual threads into a unified experience. The Blueprint identifies <strong>Creative Intelligence</strong>, <strong>Cultural Intelligence</strong>, and <strong>Historical Intelligence</strong> as essential civilizational capacities. UGT Films activates all three.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Featured Projects" 
        title="In Production & Development" 
        lead="Cinematic works mapping to the full UGT framework."
      >
        <div className="space-y-6">
          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"The Great Integration" (Feature Documentary)</h3>
                <p className="mt-1 text-zinc-600 text-sm">90 min • The convergence of human, artificial, and planetary intelligence</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Integrated Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Artificial Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Ecological Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 2 & 5</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm">In Production</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Heaven on Earth: A Civilization Series" (Docuseries)</h3>
                <p className="mt-1 text-zinc-600 text-sm">7 episodes × 45 min • One episode per Blueprint phase</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Civilization Transformation</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Heaven on Earth</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">All 7 Phases</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm">In Development</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl opacity-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Sapiens 2.0" (Narrative Feature)</h3>
                <p className="mt-1 text-zinc-600 text-sm">120 min • A speculative drama on the next stage of human evolution</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Human Evolution</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Conscious Civilization</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Cultural Intelligence</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-2 bg-zinc-200 text-zinc-500 rounded-lg text-sm">Concept Phase</span>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl opacity-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"The Keepers" (Feature Documentary)</h3>
                <p className="mt-1 text-zinc-600 text-sm">Indigenous stewardship and ecological intelligence across continents</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Ecological Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Cultural Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Historical Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 5</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-2 bg-zinc-200 text-zinc-500 rounded-lg text-sm">Research Phase</span>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Distribution" 
        title="Where to Watch" 
        lead="Official UGT film distribution channels."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="https://youtube.com/@ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">📺</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">YouTube</h4>
            <p className="mt-1 text-sm text-zinc-600">Premieres, behind-the-scenes, shorts</p>
          </a>
          <a href="https://vimeo.com/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">🎬</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Vimeo On Demand</h4>
            <p className="mt-1 text-sm text-zinc-600">Ad-free rentals & purchases</p>
          </a>
          <a href="https://filmfreeway.com/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Festival Circuit</h4>
            <p className="mt-1 text-sm text-zinc-600">Screenings, awards, industry access</p>
          </a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Content" 
        title="Explore Connected UGT Concepts" 
        lead="Films explore these ideas through narrative."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/civilization-transformation" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Civilization Transformation</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/knowledge/cultural-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Cultural Intelligence</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <CTASection 
        title="Explore More Media" 
        subtitle="Discover music, podcasts, and videos from UGT."
        primaryLabel="UGT Music"
        primaryTo="/media/music"
        secondaryLabel="All Media"
        secondaryTo="/media"
      />
    </div>
  );
};

export default MediaFilmsPage;