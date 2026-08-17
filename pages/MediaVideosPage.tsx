import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const MediaVideosPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'UGT Videos — Visual Explorations of Conscious Civilization',
      'Watch UGT\'s video series exploring human evolution, integrated intelligence, and the architecture of a flourishing future.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="UGT Videos" 
        subtitle="Visual explorations of the ideas shaping conscious civilization — documentaries, explainers, and creative films."
      />

      <ContentSection 
        eyebrow="About UGT Videos" 
        title="Seeing the invisible architecture of civilization." 
        lead="Some patterns only become visible when visualized."
      >
        <Block>
          <P>
            UGT Videos produce documentary-style explainers, animated concept visualizations, short films, and recorded conversations that make the abstract tangible. Topics span: <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a>, <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>, <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>, <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>, <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a>, <a href="/knowledge/technology-and-human-flourishing" className="text-indigo-600 hover:underline">Technology & Humanity</a>, <a href="/knowledge/ecological-intelligence" className="text-indigo-600 hover:underline">Ecological Intelligence</a>, and the <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a>.
          </P>
          <P className="mt-4">
            Video is a form of <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> — it synthesizes visual, auditory, narrative, and conceptual information into a single coherent stream. The Blueprint identifies <strong>Creative Intelligence</strong> and <strong>Systems Intelligence</strong> as essential civilizational capacities. UGT Videos exercise both.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Featured Works" 
        title="Current Releases" 
        lead="Each video maps to specific UGT concepts and Blueprint chapters."
      >
        <div className="space-y-6">
          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"The Architecture of Flourishing"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Documentary • 28 min • Visualizing the six dimensions of human flourishing</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Human Flourishing</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Conscious Civilization</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 3</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Vimeo</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Integrated Intelligence Explained"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Animated explainer • 12 min • The synthesis of human, artificial, and collective intelligence</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Integrated Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Artificial Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 2</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Vimeo</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Evolution's Next Chapter"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Short film • 18 min • From biological to cultural to conscious evolution</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Human Evolution</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Cultural Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 1</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Vimeo</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl opacity-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"The Blueprint Visualized" (Upcoming)</h3>
                <p className="mt-1 text-zinc-600 text-sm">Interactive visual journey through all 10 intelligences and 7 phases</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">All 10 Intelligences</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Systems Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Full Blueprint</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="px-4 py-2 bg-zinc-200 text-zinc-500 rounded-lg text-sm">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Platforms" 
        title="Where to Watch" 
        lead="Official UGT channels on major video platforms."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="https://youtube.com/@ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">📺</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">YouTube</h4>
            <p className="mt-1 text-sm text-zinc-600">Full library, playlists, premieres</p>
          </a>
          <a href="https://vimeo.com/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">🎬</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Vimeo</h4>
            <p className="mt-1 text-sm text-zinc-600">Ad-free, high-quality, embeddable</p>
          </a>
          <a href="https://odysee.com/@ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">🔗</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Odysee</h4>
            <p className="mt-1 text-sm text-zinc-600">Decentralized, censorship-resistant</p>
          </a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Content" 
        title="Explore Connected UGT Concepts" 
        lead="Videos explore these ideas visually."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Flourishing</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/knowledge/systems-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Systems Intelligence</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <CTASection 
        title="Explore More Media" 
        subtitle="Discover music, podcasts, and films from UGT."
        primaryLabel="UGT Films"
        primaryTo="/media/films"
        secondaryLabel="All Media"
        secondaryTo="/media"
      />
    </div>
  );
};

export default MediaVideosPage;