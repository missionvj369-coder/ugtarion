import React, { useEffect } from 'react';
import { PageHero, ContentSection, Block, P, CTASection } from './PageKit';
import { updatePageMetadata } from '../lib/seo';

const KnowledgeUniversalIdPage: React.FC = () => {
  useEffect(() => {
    updatePageMetadata(
      'Universal ID — UGT Knowledge Library',
      'The sovereign identity layer enabling equitable participation in the UGT ecosystem. A portable, verifiable credential for trusted contribution across initiatives.'
    );
  }, []);

  return (
    <div className="bg-white">
      <PageHero 
        title="Universal ID" 
        subtitle="The identity and participation layer within the broader UGT ecosystem."
      />

      <ContentSection 
        eyebrow="Definition" 
        title="What is Universal ID?" 
        lead="Not a social profile. An infrastructure layer for trusted participation."
      >
        <Block>
          <P>
            Universal ID is a portable, verifiable credential that enables individuals to participate in UGT initiatives, access knowledge resources, contribute to projects, and build reputation across the ecosystem. It is designed as a public utility — not a platform, not a product, not a walled garden.
          </P>
          <P className="mt-4">
            Unlike conventional digital identities that are owned by corporations or governments, Universal ID is built on principles of self-sovereignty, interoperability, and minimal disclosure. The individual holds the credential; UGT provides the verification infrastructure; relying parties (projects, communities, services) choose to trust it.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="Significance" 
        title="Why a New Identity Layer?" 
        lead="Current identity systems were not built for civilizational-scale collaboration."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Block title="Fragmentation">
            <P>
              Today, a contributor to a UGT project in Kenya, a researcher in India, and a builder in Brazil each need separate accounts, separate reputation systems, separate verification processes. Universal ID creates a single, portable layer that works across all UGT-aligned initiatives.
            </P>
          </Block>
          <Block title="Trust Without Centralization">
            <P>
              Universal ID enables trust between strangers at scale without requiring a central authority to mediate every interaction. Verifiable credentials, zero-knowledge proofs, and decentralized identifiers make this possible — technically and socially.
            </P>
          </Block>
        </div>
      </ContentSection>

      <ContentSection 
        eyebrow="Impact" 
        title="Relationship to Life and Civilization" 
        lead="Identity is the substrate of participation."
      >
        <Block>
          <P>
            Without a trusted way to identify who is contributing, what they have contributed, and what reputation they have earned, large-scale collaboration defaults to either closed platforms or chaotic anonymity. Universal ID provides the middle path: open participation with accountable identity.
          </P>
          <P className="mt-4">
            This connects directly to <a href="/knowledge/human-flourishing" className="text-indigo-600 hover:underline">Human Flourishing</a> (agency, recognition, belonging), <a href="/knowledge/integrated-intelligence" className="text-indigo-600 hover:underline">Integrated Intelligence</a> (reputation-weighted collective cognition), and <a href="/knowledge/civilization-transformation" className="text-indigo-600 hover:underline">Civilization Transformation</a> (new governance primitives). It is the plumbing of a participatory civilization.
          </P>
        </Block>
      </ContentSection>

      <ContentSection 
        eyebrow="The UGT Vision" 
        title="The Architecture of Universal ID" 
        lead="Minimal, portable, verifiable, and human-centered."
      >
        <Block>
          <P>
            Universal ID is built on open standards (DIDs, VCs, SBTs) and governed by the UGT framework — not by a single company. It supports selective disclosure (prove you're a verified contributor without revealing your legal name), progressive trust (reputation accumulates across contexts), and exit rights (you can take your credentials and leave).
          </P>
          <P className="mt-4">
            The <a href="/universal-id" className="text-indigo-600 hover:underline">Universal ID page</a> is the canonical entry point for claiming and managing your ID. It is not a destination — it is a key that unlocks participation across the UGT ecosystem and beyond.
          </P>
        </Block>
      </ContentSection>

      <CTASection 
        title="Claim Your Universal ID" 
        subtitle="Establish your verifiable identity in the UGT ecosystem."
        primaryLabel="Get Universal ID"
        primaryTo="/universal-id"
        secondaryLabel="About UGT"
        secondaryTo="/about-universal-guard-trust"
      />
    </div>
  );
};

export default KnowledgeUniversalIdPage;