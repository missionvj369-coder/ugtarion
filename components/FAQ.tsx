import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// Generate FAQPage schema for search engines
const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

const faqData: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is Universal Guard Trust?',
    answer: 'Universal Guard Trust (UGT) is an initiative designed to foster global human evolution and consciousness. Positioning itself as a bridge between science, spirituality, and organizational frameworks, UGT aims to redesign social systems and guide national transformation—with an emphasis on youth programs, strategic alliances, and global community building. Through its platform, UGT invites individuals to register as "Guardians" to receive a sovereign Universal ID, offering a structured identification hierarchy aimed at uniting conscious beings to shape the future of civilization.'
  },
  {
    category: 'General',
    question: 'How does the Universal ID work?',
    answer: 'When you register with Universal Guard Trust, you receive a unique Universal ID (e.g., UGT-000001). This ID is linked to your verified identity information and can be used to establish trust across different platforms and services globally. Your Universal ID is secure, non-transferable, and remains with you throughout your journey.'
  },
  {
    category: 'General',
    question: 'Is my information safe with Universal Guard Trust?',
    answer: 'Yes, protecting your information is our top priority. We implement industry-standard security measures including encryption of data in transit and at rest, secure password hashing, Row Level Security (RLS) in our database, and regular security audits. We never sell your personal information to third parties.'
  },
  {
    category: 'General',
    question: 'What makes Universal Guard Trust different from other identity systems?',
    answer: 'Universal Guard Trust is designed with a global perspective. Unlike regional identity systems, our Universal ID works across borders and boundaries. We focus on building trust networks, not just identity verification. Our platform combines security, accessibility, and global interoperability to serve individuals and organizations worldwide.'
  },
  
  // Registration & Account
  {
    category: 'Registration & Account',
    question: 'How do I create an account?',
    answer: 'Creating an account is simple: 1) Click the "Register" or "Get Started" button on our homepage, 2) Fill in your personal details (name, date of birth, email, phone), 3) Provide your location information (city, district, state, country, pincode), 4) Create a strong password (minimum 8 characters with uppercase, lowercase, numbers, and special characters), 5) Verify your email address. Once complete, you will receive your unique Universal ID.'
  },
  {
    category: 'Registration & Account',
    question: 'Why do I need to provide my date of birth?',
    answer: 'Your date of birth is required for identity verification purposes and to ensure you meet the minimum age requirement (18 years) to use our services. It also helps in distinguishing your identity from others with similar names.'
  },
  {
    category: 'Registration & Account',
    question: 'Can I change my Universal ID?',
    answer: 'No, your Universal ID is assigned by our system and cannot be changed. This ensures consistency and reliability across the trust network. The ID is designed to be a permanent, unique identifier throughout your association with Universal Guard Trust.'
  },
  {
    category: 'Registration & Account',
    question: 'How do I reset my password?',
    answer: 'To reset your password: 1) Click "Forgot Password" on the login page, 2) Enter your registered email address, 3) Check your email for a password reset link, 4) Click the link and create a new strong password. The reset link expires after 24 hours for security reasons.'
  },
  {
    category: 'Registration & Account',
    question: 'Can I have multiple accounts?',
    answer: 'No, each individual is allowed only one account. Multiple accounts for the same person are not permitted and may result in account termination. If you have trouble accessing your existing account, please contact our support team instead of creating a new one.'
  },
  
  // Security
  {
    category: 'Security',
    question: 'How is my password protected?',
    answer: 'Your password is hashed using secure cryptographic algorithms with salt before storage. We never store plain-text passwords. Additionally, we implement password strength requirements to ensure you use strong, unique passwords that are resistant to brute-force attacks.'
  },
  {
    category: 'Security',
    question: 'What should I do if I suspect unauthorized access?',
    answer: 'If you suspect someone has accessed your account: 1) Change your password immediately, 2) Contact our support team at oneness@ugtglobal.space, 3) Review your account activity for any unauthorized actions, 4) Enable additional security measures if available. We recommend using a unique, strong password and being cautious of phishing attempts.'
  },
  {
    category: 'Security',
    question: 'Is my data encrypted?',
    answer: 'Yes, all data is encrypted both in transit (using TLS/SSL) and at rest. This means your information is protected while being transmitted to our servers and while stored in our databases. We use industry-standard encryption protocols to safeguard your data.'
  },
  {
    category: 'Security',
    question: 'What is Row Level Security (RLS)?',
    answer: 'Row Level Security is a database security feature that restricts access to specific rows based on user credentials. In our system, RLS ensures that you can only access your own data, preventing unauthorized access to other users\' information even if someone gains access to the database.'
  },
  
  // Privacy
  {
    category: 'Privacy',
    question: 'Who can see my information?',
    answer: 'Your personal information is protected and only accessible to you by default. We implement strict access controls and Row Level Security to ensure data isolation. We may share your information only when required by law, with your explicit consent, or with service providers who assist in our operations under strict confidentiality agreements.'
  },
  {
    category: 'Privacy',
    question: 'Can I delete my account and data?',
    answer: 'Yes, you have the right to request deletion of your account and personal data. Contact our support team at oneness@ugtglobal.space with your request. Please note that certain information may be retained as required by law or for legitimate business purposes such as fraud prevention.'
  },
  {
    category: 'Privacy',
    question: 'Do you share my data with third parties?',
    answer: 'We do not sell, trade, or rent your personal information to third parties. We may share minimal information with trusted service providers who help us operate our platform (such as hosting providers or email services), but only as necessary to provide our services to you.'
  },
  {
    category: 'Privacy',
    question: 'How do you use cookies?',
    answer: 'We use cookies to: remember your preferences and settings, understand how you use our platform, deliver personalized content, and improve your user experience. You can control cookies through your browser settings, though disabling them may affect some platform functionality.'
  },
  
  // Technical
  {
    category: 'Technical',
    question: 'What are the password requirements?',
    answer: 'Your password must meet the following criteria: minimum 8 characters, at least one uppercase letter (A-Z), at least one lowercase letter (a-z), at least one number (0-9), and at least one special character (!@#$%^&*(),.?":{}|<>). These requirements ensure your account remains secure.'
  },
  {
    category: 'Technical',
    question: 'What browsers are supported?',
    answer: 'Our platform works best on modern browsers including the latest versions of Chrome, Firefox, Safari, Edge, and Opera. For the best experience and security, we recommend keeping your browser updated to the latest version.'
  },
  {
    category: 'Technical',
    question: 'Is there a mobile app?',
    answer: 'Currently, Universal Guard Trust is accessible through our responsive web platform that works seamlessly on mobile devices through your mobile browser. We are working on dedicated mobile applications and will announce them when available.'
  },
  {
    category: 'Technical',
    question: 'What should I do if I encounter technical issues?',
    answer: 'If you experience technical issues: 1) Clear your browser cache and cookies, 2) Try using a different browser, 3) Ensure you have a stable internet connection, 4) Disable browser extensions temporarily. If issues persist, contact our support team with details of the problem and any error messages you see.'
  },
  
  // Support
  {
    category: 'Support',
    question: 'How can I contact support?',
    answer: 'You can reach our support team via email at support@ugtglobal.space. We aim to respond to all inquiries within 24-48 hours. For urgent security concerns, please email security@ugtglobal.space with "URGENT" in the subject line.'
  },
  {
    category: 'Support',
    question: 'I didn\'t receive my verification email. What should I do?',
    answer: 'If you didn\'t receive your verification email: 1) Check your spam/junk folder, 2) Ensure you entered the correct email address, 3) Wait a few minutes as delivery may be delayed, 4) Try requesting a new verification email. If the issue persists, contact support@ugtglobal.space.'
  },
  {
    category: 'Support',
    question: 'How long does account verification take?',
    answer: 'Account verification is typically instant. After completing registration and verifying your email, your account is immediately active and you receive your Universal ID. If additional verification is required, you will be notified with next steps.'
  }
];

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...new Set(faqData.map(item => item.category))];

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Inject FAQPage schema into document head
  useEffect(() => {
    const schema = generateFAQSchema(faqData);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'faq-schema';
    
    // Remove existing schema if present
    const existing = document.getElementById('faq-schema');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about Universal Guard Trust, registration, security, and more.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No questions found matching your search.</p>
            </div>
          ) : (
            filteredFAQs.map((item, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div>
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-medium text-slate-900 mt-1">
                      {item.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-500 transform transition ${
                      expandedItems.has(index) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedItems.has(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

          {/* Contact CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="mailto:oneness@ugtglobal.space?subject=Support Request - FAQ&body=Hello, I need help with:"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default FAQ;