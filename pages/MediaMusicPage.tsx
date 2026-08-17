import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const MediaMusicPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'UGT Music — Original Compositions for Human Evolution',
      'Explore UGT\'s original music exploring themes of human evolution, integrated intelligence, human flourishing, and conscious civilization.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="UGT Music" 
        subtitle="Original compositions expressing the themes of human evolution, integrated intelligence, and conscious civilization."
      />

      <ContentSection 
        eyebrow="About UGT Music" 
        title="Music as a mode of understanding." 
        lead="Some truths are felt before they are understood."
      >
        <Block>
          <P>
            UGT Music creates original compositions that explore the emotional and imaginative dimensions of the UGT framework: <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a>, <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>, <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>, <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>, and <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a>.
          </P>
          <P className="mt-4">
            Music bypasses the analytical mind and speaks directly to the pattern-recognition systems that underlie human meaning-making. It is a form of <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> — synthesizing knowledge, emotion, and cultural memory into resonant form. The <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> recognizes <strong>Creative Intelligence</strong> as one of ten essential civilizational intelligences. UGT Music is a living expression of that intelligence.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Featured Works" 
        title="Current Releases" 
        lead="Each piece maps to specific UGT concepts and Blueprint chapters."
      >
        <div className="space-y-6">
          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Evolution's Edge"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Ambient electronic • 8:42 • Explores the threshold between biological and cultural evolution</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Human Evolution</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Integrated Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 1</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">SoundCloud</a>
                <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Bandcamp</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Flourishing"</h3>
                <p className="mt-1 text-zinc-600 text-sm">Modern classical • 12:18 • Six movements for the six dimensions of human flourishing</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Human Flourishing</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Conscious Civilization</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 3</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors text-sm">YouTube</a>
                <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">SoundCloud</a>
                <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition-colors text-sm">Bandcamp</a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-zinc-200 rounded-xl opacity-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">"Synthetic Symbiosis" (Upcoming)</h3>
                <p className="mt-1 text-zinc-600 text-sm">AI-human collaborative composition • Explores Integrated Intelligence in practice</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Integrated Intelligence</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Technology & Humanity</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Blueprint Ch. 2</span>
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
        lead="Official UGT channels on major platforms."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="https://youtube.com/@ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">📺</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">YouTube Music</h4>
            <p className="mt-1 text-sm text-zinc-600">Full albums, visualizers, playlists</p>
          </a>
          <a href="https://soundcloud.com/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">☁️</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">SoundCloud</h4>
            <p className="mt-1 text-sm text-zinc-600">Stems, works-in-progress, community</p>
          </a>
          <a href="https://bandcamp.com/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">💿</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Bandcamp</h4>
            <p className="mt-1 text-sm text-zinc-600">Direct support, high-quality downloads</p>
          </a>
          <a href="https://audius.co/ugtglobal" target="_blank" rel="noopener noreferrer" className="group p-4 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-3xl mb-2">🔗</div>
            <h4 className="font-semibold text-zinc-900 group-hover:text-indigo-700">Audius</h4>
            <p className="mt-1 text-sm text-zinc-600">Decentralized, artist-owned</p>
          </a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Related Content" 
        title="Explore Connected UGT Concepts" 
        lead="Music explores these ideas in felt form."
      >
        <div className="flex flex-wrap gap-4">
          <a href="/knowledge/heaven-on-earth" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Heaven on Earth</a>
          <a href="/knowledge/integrated-intelligence" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Integrated Intelligence</a>
          <a href="/knowledge/human-evolution" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Evolution</a>
          <a href="/knowledge/human-flourishing" className="px-4 py-2 rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-colors">Human Flourishing</a>
          <a href="/heaven-on-earth/blueprint" className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-colors">Heaven on Earth Blueprint</a>
        </div>
      </ContentSection>

      <CTASection 
        title="Explore More Media" 
        subtitle="Discover podcasts, videos, and films from UGT."
        primaryLabel="UGT Podcasts"
        primaryTo="/media/podcasts"
        secondaryLabel="All Media"
        secondaryTo="/media"
      />
    </div>
  );
};

export default MediaMusicPage;