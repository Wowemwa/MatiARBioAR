import { memo, useState } from 'react'
import ModernHero from './ModernHero'
import ModernFeatures from './ModernFeatures'
import FeedbackFloating from './FeedbackFloating'
import AboutFooter from './AboutFooter'

/**
 * Modern Home Component - Combines Hero and Features
 * into a cohesive modern landing page experience
 */
const ModernHome = memo(function ModernHome() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Enhanced background with animated gradients - disabled on mobile to prevent flicker */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="hidden md:block absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-full blur-3xl will-change-opacity" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="hidden md:block absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-3xl will-change-opacity" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) 1s infinite' }} />
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-400/5 via-transparent to-pink-400/5 rounded-full blur-3xl will-change-opacity" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) 0.5s infinite' }} />
      </div>

      <div className="relative">
        <ModernHero />

        <ModernFeatures />

      </div>

      {/* Enhanced Footer */}
      <AboutFooter 
        onShowPrivacyModal={() => setShowPrivacyModal(true)}
        onShowFeedbackModal={() => setShowFeedbackModal(true)}
      />

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 text-slate-700 dark:text-slate-300">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Last updated: November 27, 2025
              </div>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">1. Introduction</h3>
                <p className="leading-relaxed">
                  Mati ARBio ("we," "our," or "us") is committed to protecting your privacy and ensuring compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) and other relevant Philippine cybersecurity laws and regulations. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our biodiversity exploration platform.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">2. Information We Collect</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Name and contact information (when voluntarily provided)</li>
                      <li>Device information and browser fingerprints for security purposes</li>
                      <li>IP addresses and geolocation data for regional content delivery</li>
                      <li>Usage patterns and interaction data for platform improvement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Technical Data</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Browser type, version, and operating system</li>
                      <li>Device characteristics and screen resolution</li>
                      <li>Access times and referring website URLs</li>
                      <li>Pages viewed and time spent on our platform</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">3. Legal Basis for Processing</h3>
                <p className="leading-relaxed mb-4">
                  In accordance with the Data Privacy Act of 2012, we process your personal data based on the following lawful bases:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Consent:</strong> When you voluntarily provide information or agree to our terms</li>
                  <li><strong>Legitimate Interest:</strong> To improve our services and ensure platform security</li>
                  <li><strong>Legal Obligation:</strong> To comply with Philippine laws and regulations</li>
                  <li><strong>Contract:</strong> To fulfill our obligations in providing biodiversity services</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">4. How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Provide and maintain our biodiversity exploration platform</li>
                  <li>Ensure cybersecurity and prevent unauthorized access</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Comply with legal obligations under Philippine law</li>
                  <li>Communicate important updates about conservation efforts</li>
                  <li>Support environmental education and research initiatives</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">5. Data Sharing and Disclosure</h3>
                <p className="leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>With trusted partners for biodiversity research (anonymized data only)</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">6. Cybersecurity Measures</h3>
                <p className="leading-relaxed mb-4">
                  In compliance with Republic Act No. 11038 (Expanded National Integrated Protected Areas System Act) and related cybersecurity regulations, we implement robust security measures:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>SSL/TLS encryption for all data transmission</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Data minimization and retention policies</li>
                  <li>Incident response and breach notification procedures</li>
                  <li>Employee training on data protection and cybersecurity</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">7. Your Rights Under Philippine Law</h3>
                <p className="leading-relaxed mb-4">
                  Under the Data Privacy Act of 2012, you have the following rights:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Right to be Informed:</strong> Know what personal data we collect and how we use it</li>
                  <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Object:</strong> Object to processing in certain circumstances</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">8. Data Retention</h3>
                <p className="leading-relaxed">
                  We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Technical data for cybersecurity purposes is retained for a maximum of 3 years in accordance with Philippine data protection regulations.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">9. Cookies and Tracking</h3>
                <p className="leading-relaxed">
                  We use essential cookies and similar technologies to ensure platform functionality and security. These help us prevent unauthorized access and maintain service availability. You can control cookie preferences through your browser settings, though disabling essential cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">10. International Data Transfers</h3>
                <p className="leading-relaxed">
                  Some of our service providers may be located outside the Philippines. When we transfer personal data internationally, we ensure adequate protection through standard contractual clauses or other legally recognized safeguards in compliance with Philippine data protection laws.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">11. Children's Privacy</h3>
                <p className="leading-relaxed">
                  Our platform is designed for environmental education and is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">12. Changes to This Policy</h3>
                <p className="leading-relaxed">
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify users of material changes through our platform or via email. Continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">13. Contact Information</h3>
                <p className="leading-relaxed mb-4">
                  For questions, concerns, or to exercise your data privacy rights, please contact our Data Protection Officer:
                </p>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <p className="text-sm"><strong>Mati ARBio Data Protection Officer</strong></p>
                  <p className="text-sm">Email: privacy@matiarbio.ph</p>
                  <p className="text-sm">Address: Mati City, Davao Oriental, Philippines</p>
                  <p className="text-sm">Phone: +63 (82) 388-xxxx</p>
                </div>
                <p className="text-sm mt-4">
                  You may also file complaints with the National Privacy Commission (NPC) at privacy.gov.ph or call their hotline at 02-914-2696.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">14. Governing Law</h3>
                <p className="leading-relaxed">
                  This Privacy Policy is governed by and construed in accordance with the laws of the Republic of the Philippines, particularly Republic Act No. 10173 (Data Privacy Act of 2012) and related cybersecurity regulations.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-6 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Support</h2>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  💬
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Share Your Feedback</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Help us improve the Mati ARBio platform. Your feedback is valuable to our conservation efforts.
                </p>
              </div>

              {/* Embed the FeedbackFloating component */}
              <div className="relative">
                <FeedbackFloating />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
})

export default ModernHome
