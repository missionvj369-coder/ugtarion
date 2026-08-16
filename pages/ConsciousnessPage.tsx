import React from 'react';
import { PageHero, ContentSection, P, CTASection, CTAButton, PillarGrid } from './PageKit';
import FadeIn from '../components/FadeIn';

interface ConsciousnessPageProps {
  onOpenIdModal: () => void;
}

const consciousnessAreas = [
  { title: 'Perception', description: 'We do not encounter reality as a completely untouched recording. The brain constructs an active representation of the world.' },
  { title: 'Attention', description: 'Human attention is limited. What we notice influences what we understand. A civilization that understands attention can become more conscious.' },
  { title: 'Memory', description: 'Memory connects the present human being with the past. It allows knowledge to accumulate and cultures to transmit experience.' },
  { title: 'The Self', description: 'Who is the person saying I? A body? A brain? A stream of experience? A story constructed across time?' },
  { title: 'Dreams', description: 'Every night, human consciousness can enter radically different states. Dreams raise questions about perception, memory, emotion and imagination.' },
  { title: 'Meditation & Contemplative Practice', description: 'Practices for observing attention, thought, emotion and experience. Practices can be studied. Claims can be examined. Evidence can be gathered.' },
  { title: 'Consciousness & Science', description: 'Neuroscience provides powerful tools for studying the brain. Yet understanding neural activity is not automatically answering every philosophical question.' },
  { title: 'Consciousness & Technology', description: 'AI raises new questions. Can a machine process information without experiencing it? Could future systems possess forms of experience?' },
];

const ConsciousnessPage: React.FC<ConsciousnessPageProps> = ({ onOpenIdModal }) => {
  return (
    <>
      <PageHero
        eyebrow="Consciousness"
        title="The Inner Frontier of Humanity"
        subtitle="Humanity has explored oceans, mountains, planets and the structure of matter. One frontier remains intimately present yet deeply mysterious: the experience of being alive."
      >
        <div className="mt-10">
          <CTAButton label="Explore Intelligence" to="/intelligence" />
        </div>
      </PageHero>

      <ContentSection eyebrow="The Question of Experience" title="The Relationship Between Physical Processes and Experience" center>
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <P>We see. Hear. Touch. Remember. Imagine. Dream. Feel. Think. Choose.</P>
          <P>
            But the relationship between physical processes and subjective experience remains one of
            humanity's deepest questions.
          </P>
          <P>
            UGT does not begin by declaring an ultimate answer. It begins by investigating what can be
            observed, measured, compared and understood.
          </P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Inner World" title="What Can Be Investigated" className="bg-white/40">
        <PillarGrid items={consciousnessAreas} />
      </ContentSection>

      <ContentSection eyebrow="The Inner and Outer Worlds" title="Two Great Directions of Exploration" center>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <h4 className="text-lg font-medium text-zinc-900 mb-4">Outward</h4>
            <div className="flex flex-wrap gap-2">
              {['Matter', 'Energy', 'Life', 'Earth', 'Space', 'Technology', 'The Universe'].map((item) => (
                <span key={item} className="px-3 py-1.5 text-sm text-zinc-600 bg-zinc-100 rounded-full">{item}</span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-8">
            <h4 className="text-lg font-medium text-zinc-900 mb-4">Inward</h4>
            <div className="flex flex-wrap gap-2">
              {['Experience', 'Attention', 'Memory', 'Identity', 'Emotion', 'Meaning', 'Consciousness'].map((item) => (
                <span key={item} className="px-3 py-1.5 text-sm text-zinc-600 bg-zinc-100 rounded-full">{item}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <P>A mature civilization should be capable of investigating both.</P>
        </div>
      </ContentSection>

      <ContentSection eyebrow="The Unknown" title="A Protected Space for Uncertainty" center className="bg-white/40">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <P>There are questions humanity cannot currently answer.</P>
          <P>That does not make them meaningless. It makes them part of the frontier.</P>
          <P>No forced conclusion. No manufactured certainty. No dismissal of genuine questions. No belief required.</P>
          <P>Only the willingness to investigate.</P>
        </div>
      </ContentSection>

      {/* Centered CTA between white and black sections */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton label="Explore the Truth Engine" to="/blueprint" />
              <CTAButton label="Enter the Creator Community" to="https://creatorcommunity.space/" variant="outline" />
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        title="Know What Is Known. Question What Is Assumed."
        subtitle="Explore what remains unknown."
        primaryLabel="Claim Your Universal ID"
        onOpenIdModal={onOpenIdModal}
        secondaryLabel="Enter the Creator Community"
        secondaryTo="https://creatorcommunity.space/"
      />
    </>
  );
};

export default ConsciousnessPage;
