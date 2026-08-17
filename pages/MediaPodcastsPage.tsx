import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const MediaPodcastsPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'UGT Podcasts — Conversations on Consciousness, Civilization & Technology',
      'Explore UGT\'s podcast series featuring deep conversations on human evolution, integrated intelligence, and the future of civilization.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="UGT Podcasts" 
        subtitle="Deep conversations exploring the frontiers of human evolution, integrated intelligence, and conscious civilization."
      />

      <ContentSection 
        eyebrow="About UGT Podcasts" 
        title="Long-form dialogue as a tool for integrated understanding." 
        lead="Complex ideas require time to unfold."
      >
        <Block>
          <P>
            UGT Podcasts feature extended conversations with scientists, philosophers, builders, indigenous elders, artists, and systems thinkers — anyone whose work illuminates the path toward a flourishing civilization. Topics span: <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a>, <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>, <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>, <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>, <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a>, <a href="/knowledge/technology-and-human-flourishing" className="text-indigo-600 hover:underline">Technology & Humanity</a>, and the <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a>.
          </P>
          <P className="mt-4">
            The podcast format embodies <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> in practice: human-to-human synthesis across disciplines, cultures, and ways of knowing. It is <strong>Collective Intelligence</strong> (another Blueprint intelligence) made audible.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Featured Series" 
        title="Current Shows" 
        lead="Each series maps to specific UGT concepts and Blueprint chapters."
      >
        <div className="space-y-6">
          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"The Architect's Log"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Weekly • 60-90 min • UGT founder conversations on building conscious civilization</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Civilization Transformation</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Integrated Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Overview</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Spotify</a>
                <a href="https://apple.com/podcasts" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Apple Podcasts</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Intelligence Integrated"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Bi-weekly • 45-60 min • Technical deep-dives on AI, cognition, and synthetic intelligence</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Integrated Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Artificial Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 2</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Spotify</a>
                <a href="https://apple.com/podcasts" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Apple Podcasts</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Flourishing Frontier"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Monthly • 60-75 min • Exploring the science and practice of multidimensional flourishing</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Human Flourishing</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Conscious Civilization</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 3</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Spotify</a>
                <a href="https://apple.com/podcasts" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Apple Podcasts</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl opacity-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Earthkeepers" (Upcoming)</h3>
                <p className="mt-1 text-zinc-600 text-sm">Indigenous wisdom keepers on ecological intelligence and planetary stewardship</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Ecological Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Human Evolution</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 5</span>
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
        title="Where to Listen" 
        lead="Official UGT channels on major podcast platforms."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="https://youtube.com/@ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">📺</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">YouTube</h4>
            <p className="mt-1 text-sm text-zinc-600">Video episodes, clips, playlists</p>
          </a>
          <a href="https://spotify.com/show/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">🎧</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Spotify</h4>
            <p className="mt-1 text-sm text-zinc-600">Audio-first, background play</p>
          </a>
          <a href="https://podcasts.apple.com/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">🍎</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Apple Podcasts</h4>
            <p className="mt-1 text-sm text-zinc-600">Native iOS, subscriptions</p>
          </a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Content" 
        title="Explore Connected UGT Concepts" 
        lead="Podcasts explore these ideas through dialogue."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/collective-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Collective Intelligence</a>
          <a href="/knowledge/civilization-transformation" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Civilization Transformation</a>
          <a href="/knowledge/conscious-civilization" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Conscious Civilization</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <CTASection 
        title="Explore More Media" 
        subtitle="Discover music, videos, and films from UGT."
        primaryLabel="UGT Videos"
        primaryTo="/media/videos"
        secondaryLabel="All Media"
        secondaryTo="/media"
      />
    </div>
  );
};

export default MediaPodcastsPage;