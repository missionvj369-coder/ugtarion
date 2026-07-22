import React from 'react';
import SectionWrapper from './SectionWrapper';

const PrivacyPolicy: React.FC = () => {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: July 22, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              Universal Guard Trust ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our services, including our website, mobile application, and related services 
              (collectively, the "Platform").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-slate-700">2.1 Personal Information</h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Name and date of birth</li>
                <li>Email address and phone number</li>
                <li>Postal address (city, district, state, country, pincode)</li>
                <li>Profile information and preferences</li>
                <li>Universal ID assigned to you</li>
              </ul>

              <h3 className="text-xl font-medium text-slate-700">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Usage patterns and interactions</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>To create and manage your Universal ID account</li>
              <li>To provide, maintain, and improve our services</li>
              <li>To process transactions and send related information</li>
              <li>To send you updates, security alerts, and support messages</li>
              <li>To respond to your comments, questions, and customer service requests</li>
              <li>To monitor and analyze usage patterns and trends</li>
              <li>To detect, prevent, and address technical issues or fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Information Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>With service providers who assist in our operations (hosting, analytics, email delivery)</li>
              <li>When required by law, regulation, or legal process</li>
              <li>To protect the rights, property, or safety of Universal Guard Trust, our users, or the public</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mt-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure password hashing with salt</li>
              <li>Row Level Security (RLS) in our database</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Cookies & Tracking</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our Platform</li>
              <li>Deliver personalized content and recommendations</li>
              <li>Improve our services and user experience</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              You can control cookies through your browser settings. Disabling cookies may affect Platform functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@ugtglobal.space.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">8. Data Retention</h2>
            <p className="text-slate-600 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. 
              We may retain certain information for longer periods as required by law or for legitimate business purposes, 
              such as fraud prevention or technical stability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">9. Children's Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">10. International Transfers</h2>
            <p className="text-slate-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">11. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date. We encourage you to 
              review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">12. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-700 font-medium">Universal Guard Trust</p>
              <p className="text-slate-600">Email: privacy@ugtglobal.space</p>
              <p className="text-slate-600">Website: www.ugtglobal.space</p>
            </div>
          </section>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default PrivacyPolicy;