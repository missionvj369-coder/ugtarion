import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const MediaPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'UGT Media — Music, Podcasts, Videos, Films',
      'The official media gateway for Universal Guard Trust. Explore original music, podcasts, videos, and films exploring human evolution, integrated intelligence, and conscious civilization.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="UGT Media" 
        subtitle="Original creative work exploring the frontiers of human evolution, integrated intelligence, and conscious civilization."
      />

      <ContentSection 
        eyebrow="What Is UGT Media?" 
        title="A curated gateway to creative expressions of the UGT framework." 
        lead="UGT Media is not a content platform. It is a discovery layer."
      >
        <Block>
          <P>
            Universal Guard Trust produces original music, podcasts, videos, and films that explore the concepts at the heart of the UGT framework: <a href="/knowledge/human-evolution" className="text-indigo-600 hover:underline">Human Evolution</a>, <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a>, <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a>, <a href="/knowledge/conscious-civilization" className="text-indigo-600 hover:underline">Conscious Civilization</a>, <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a>, and <a href="/knowledge/heaven-on-earth" className="text-indigo-600 hover:underline">Heaven on Earth</a>.
          </P>
          <P className="mt-4">
            We do not host media files on this website. UGT Global is the canonical identity. The actual media lives on external platforms where it can reach audiences natively. This page and its sub-pages exist to:
          </P>
          <ul className="mt-4 list-disc list-inside space-y-2 text-zinc-700">
            <li>Explain what each media category represents and why it exists</li>
            <li>Connect each work to the UGT concepts it explores</li>
            <li>Provide direct links to official UGT channels on external platforms</li>
            <li>Serve as the authoritative index for UGT's creative output</li>
          </ul>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Media Categories" 
        title="Explore by Format" 
        lead="Each category is a curated directory of external links."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="/media/music" className="group block p-6 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-indigo-700 transition-colors">Music</h3>
            <p className="mt-2 text-zinc-600 text-sm">Original compositions exploring evolution, intelligence, flourishing</p>
          </a>
          <a href="/media/podcasts" className="group block p-6 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-indigo-700 transition-colors">Podcasts</h3>
            <p className="mt-2 text-zinc-600 text-sm">Conversations on consciousness, civilization, technology</p>
          </a>
          <a href="/media/videos" className="group block p-6 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-4xl mb-4">📹</div>
            <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-indigo-700 transition-colors">Videos</h3>
            <p className="mt-2 text-zinc-600 text-sm">Visual explorations of UGT concepts and projects</p>
          </a>
          <a href="/media/films" className="group block p-6 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-indigo-700 transition-colors">Films</h3>
            <p className="mt-2 text-zinc-600 text-sm">Cinematic work on human evolution and conscious civilization</p>
          </a>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Relationship to UGT" 
        title="Media as Meaning-Making" 
        lead="Creative work is not decoration. It is how a civilization understands itself."
      >
        <Block>
          <P>
            In the UGT framework, creative expression is a form of <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> — synthesizing knowledge, emotion, and imagination into forms that can be felt, not just understood. The <a href="/heaven-on-earth/blueprint" className="text-indigo-600 hover:underline">Heaven on Earth Blueprint</a> includes <strong>Creative Intelligence</strong> as one of its ten civilizational intelligences. UGT Media is the practical expression of that intelligence.
          </P>
          <P className="mt-4">
            UGT Media connects to:
          </P>
          <ul className="mt-4 list-disc list-inside space-y-2 text-zinc-700">
            <li><a href="/knowledge" className="text-indigo-600 hover:underline">Knowledge Library</a> — concepts explored in media</li>
            <li><a href="/questions" className="text-indigo-600 hover:underline">Human Questions</a> — questions that drive creative inquiry</li>
            <li><a href="/projects" className="text-indigo-600 hover:underline">UGT Projects</a> — practical initiatives that media documents</li>
            <li><a href="/universal-id" className="text-indigo-600 hover:underline">Universal ID</a> — creators and participants in the ecosystem</li>
          </ul>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Platform Philosophy" 
        title="External Platforms, Canonical Identity" 
        lead="We meet people where they are. UGT Global remains the source of truth."
      >
        <Block>
          <P>
            UGT Media will distribute through legitimate platforms where audiences already exist:
          </P>
          <ul className="mt-4 list-disc list-inside space-y-2 text-zinc-700">
            <li><strong>Music:</strong> YouTube/YouTube Music, SoundCloud, Bandcamp, Audius, Spotify, Apple Music</li>
            <li><strong>Podcasts:</strong> YouTube, Spotify, Apple Podcasts, RSS</li>
            <li><strong>Videos:</strong> YouTube, Vimeo, peer-to-peer where appropriate</li>
            <li><strong>Films:</strong> Festival circuits, streaming platforms, direct distribution</li>
          </ul>
          <P className="mt-4">
            Each media page on UGT Global provides direct links to official UGT channels on these platforms. We do not embed full media players by default — we link out. This keeps UGT Global fast, lightweight, and focused on its role as the canonical identity and discovery gateway.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Start Exploring" 
        subtitle="Choose a media category to discover UGT's creative work."
        primaryLabel="UGT Music"
        primaryTo="/media/music"
        secondaryLabel="All Media"
        secondaryTo="/media"
      />
    </div>
  );
};

export default MediaPage;