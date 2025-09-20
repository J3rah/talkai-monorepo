import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Terms of Service</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <p className="mb-4">
            Welcome to talkAI. These Terms of Service ("Terms") govern your use of our AI therapy service. By accessing or using our service, you agree to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Acceptance of Terms</h2>
          <p className="mb-4">
            By creating an account or using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Description of Service</h2>
          <p className="mb-4">
            talkAI provides an AI-powered therapy and emotional support service that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Offers conversational AI therapy sessions</li>
            <li>Analyzes emotional states through voice processing</li>
            <li>Provides personalized responses based on emotional analysis</li>
            <li>Tracks emotional progress and insights</li>
            <li>Offers subscription-based access to extended features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Important Limitations</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Not a Replacement for Professional Care</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Our AI therapy service is NOT a substitute for professional mental health care, medical advice, diagnosis, or treatment. It is designed for general emotional support and wellness conversations only.
            </p>
          </div>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>This service is not suitable for mental health emergencies or crisis situations</li>
            <li>If you are experiencing thoughts of self-harm, please contact emergency services immediately</li>
            <li>For serious mental health conditions, please consult with licensed mental health professionals</li>
            <li>Our AI cannot provide medical diagnoses or prescribe treatments</li>
          </ul>
          <p className="mt-4">
            For comprehensive mental health resources, crisis support, and information on finding professional help, visit our <Link href="/mental-health-resources" className="text-primary underline hover:text-primary/80 transition-colors">Mental Health Resources page</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Eligibility</h2>
          <p className="mb-4">To use our service, you must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be at least 13 years of age (13-18 years of age must get permission from parents or guardian)</li>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use the service in compliance with applicable laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Subscription Plans and Billing</h2>
          
          <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">Available Plans</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Free:</strong> 30 minutes per month</li>
            <li><strong>Standard:</strong> 120 minutes per month - $12.99/mn</li>
            <li><strong>Premium:</strong> 300 minutes per month - $29.99/mn</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">Billing Terms</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Subscriptions are billed monthly in advance</li>
            <li>All fees are non-refundable unless required by law</li>
            <li>We may change pricing with 30 days notice</li>
            <li>You can cancel your subscription at any time</li>
            <li>Access continues until the end of your billing period after cancellation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Acceptable Use</h2>
          <p className="mb-4">You agree NOT to use our service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate any laws or regulations</li>
            <li>Harass, abuse, or harm others</li>
            <li>Share inappropriate, offensive, or harmful content</li>
            <li>Attempt to reverse engineer or hack our systems</li>
            <li>Use the service for commercial purposes without permission</li>
            <li>Share your account credentials with others</li>
            <li>Circumvent usage limits or restrictions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data and Privacy</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your use of the service is governed by our Privacy Policy</li>
            <li>You retain ownership of your personal data</li>
            <li>We may use aggregated, anonymized data to improve our service</li>
            <li>You can request deletion of your data at any time</li>
            <li>Premium users can download their session data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Intellectual Property</h2>
          <p className="mb-4">
            The talkAI service, including all content, features, and functionality, is owned by us and protected by copyright, trademark, and other intellectual property laws.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You may not copy, modify, or distribute our content without permission</li>
            <li>You grant us a license to use your feedback to improve our service</li>
            <li>Your personal conversations remain private and are not used for training</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Service Availability</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We strive to provide 24/7 service availability</li>
            <li>We may perform maintenance that temporarily interrupts service</li>
            <li>We do not guarantee uninterrupted or error-free service</li>
            <li>We reserve the right to modify or discontinue features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Disclaimers and Limitations</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-700 dark:text-red-300 font-medium">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </p>
          </div>
          
          <p className="mb-4">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Account Termination</h2>
          <p className="mb-4">We may suspend or terminate your account if you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate these Terms</li>
            <li>Engage in fraudulent or harmful behavior</li>
            <li>Fail to pay subscription fees</li>
            <li>Request account deletion</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Governing Law</h2>
          <p>
            These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved in the courts of [Your Jurisdiction].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of significant changes by email or through our service. Continued use after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Information</h2>
          <p>
            If you have questions about these Terms, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p>Email: legal@talkai.im</p>
          </div>
        </section>
      </div>
    </div>
  );
} 