import React from 'react';
import SectionWrapper from './SectionWrapper';

const TermsOfService: React.FC = () => {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last updated: July 22, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              Welcome to Universal Guard Trust ("UGT", "we", "our", or "us"). By accessing or using our website, 
              mobile application, and services (collectively, the "Platform"), you agree to be bound by these Terms 
              of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Description of Services</h2>
            <p className="text-slate-600 leading-relaxed">
              Universal Guard Trust provides a universal identity verification and trust system. Our Platform enables 
              users to create and manage a Universal ID, verify their identity, and participate in a global trust network. 
              The specific features and functionality may change from time to time at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Eligibility</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To use our Platform, you must:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into these Terms</li>
              <li>Not be prohibited from using our services under applicable law</li>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Account Registration</h2>
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Create a strong, unique password</li>
                <li>Keep your login credentials confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Take responsibility for all activities under your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. User Responsibilities</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Use the Platform in accordance with these Terms and applicable laws</li>
              <li>Not use the Platform for any illegal or unauthorized purpose</li>
              <li>Not attempt to gain unauthorized access to any systems or networks</li>
              <li>Not interfere with or disrupt the Platform or servers connected to it</li>
              <li>Not transmit any viruses, malware, or other malicious code</li>
              <li>Not collect or harvest any information from the Platform without consent</li>
              <li>Not impersonate any person or entity</li>
              <li>Not use the Platform to spam, harass, or harm others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Universal ID</h2>
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Upon successful registration, you will receive a unique Universal ID. This ID:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Is assigned by our system and cannot be changed</li>
                <li>Remains the property of Universal Guard Trust</li>
                <li>May be revoked if you violate these Terms</li>
                <li>Is non-transferable</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Privacy & Data</h2>
            <p className="text-slate-600 leading-relaxed">
              Your privacy is important to us. Please review our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> to understand how we collect, use, and protect your personal information. 
              By using our Platform, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">8. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              All content, features, and functionality of the Platform, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Text, graphics, logos, and images</li>
              <li>Software, code, and technology</li>
              <li>Database designs and structures</li>
              <li>Trade names, trademarks, and service marks</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              are owned by Universal Guard Trust and are protected by intellectual property laws. 
              You may not copy, modify, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">9. Service Availability</h2>
            <p className="text-slate-600 leading-relaxed">
              We strive to provide uninterrupted access to our Platform, but we do not guarantee continuous 
              availability. We may:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
              <li>Modify, suspend, or discontinue services at any time</li>
              <li>Perform scheduled or emergency maintenance</li>
              <li>Limit access to certain features</li>
              <li>Set usage limits or throttling</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-slate-600 leading-relaxed">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
              <li>The Platform will be error-free or uninterrupted</li>
              <li>Defects will be corrected</li>
              <li>The Platform is free of viruses or harmful components</li>
              <li>Results from using the Platform will be accurate or reliable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">11. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, UNIVERSAL GUARD TRUST SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Damages resulting from unauthorized access to your account</li>
              <li>Damages resulting from third-party actions or content</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS 
              PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">12. Indemnification</h2>
            <p className="text-slate-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Universal Guard Trust and its officers, 
              directors, employees, and agents from any claims, damages, losses, or expenses (including 
              legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your unlawful or improper conduct</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">13. Termination</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may terminate or suspend your account immediately, without prior notice, for:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Non-payment of fees (if applicable)</li>
              <li>At our sole discretion for any other reason</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Upon termination, your right to use the Platform ceases immediately. 
              We may retain certain information as required by law or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">14. Modifications to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of material changes 
              by posting the updated Terms on this page with a new "Last updated" date. Your continued use 
              of the Platform after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">15. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India, 
              without regard to its conflict of law provisions. Any disputes shall be subject to the 
              exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">16. Dispute Resolution</h2>
            <p className="text-slate-600 leading-relaxed">
              Any dispute arising from or relating to these Terms or your use of the Platform shall first 
              be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, 
              the dispute shall be submitted to binding arbitration in accordance with the Arbitration 
              and Conciliation Act, 1996 of India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">17. Severability</h2>
            <p className="text-slate-600 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision 
              shall be limited or eliminated to the minimum extent necessary, and the remaining provisions 
              shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">18. Entire Agreement</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms, together with our Privacy Policy and any other legal notices published by 
              us, constitute the entire agreement between you and Universal Guard Trust regarding your 
              use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">19. Contact Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-700 font-medium">Universal Guard Trust</p>
              <p className="text-slate-600">Email: oneness@ugtglobal.space</p>
              <p className="text-slate-600">Website: ugtglobal.space</p>
            </div>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TermsOfService;