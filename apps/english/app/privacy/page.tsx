export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <p className="mb-4">
            At talkAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI therapy service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Information We Collect</h2>
          
          <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Email address and account credentials</li>
            <li>Profile information you provide</li>
            <li>Subscription and billing information</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">Therapy Session Data</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Voice recordings during therapy sessions (processed in real-time)</li>
            <li>Conversation transcripts (if you choose to save sessions)</li>
            <li>Emotion analysis data and metrics</li>
            <li>Session duration and usage statistics</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 text-gray-800 dark:text-gray-200">Technical Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Usage patterns and analytics</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our AI therapy services</li>
            <li>Process payments and manage subscriptions</li>
            <li>Analyze emotions and provide personalized responses</li>
            <li>Send important service updates and notifications</li>
            <li>Ensure platform security and prevent abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data Storage and Security</h2>
          <div className="space-y-4">
            <p>
              <strong>Session Data:</strong> By default, we do not store your conversation content. If you choose to save sessions with a subscription, all data is encrypted and securely stored.
            </p>
            <p>
              <strong>Voice Processing:</strong> Voice data is processed in real-time by Hume AI for emotion analysis and is not permanently stored on our servers.
            </p>
            <p>
              <strong>Security Measures:</strong> We implement industry-standard security measures including encryption, secure data transmission, and regular security audits.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data Sharing and Disclosure</h2>
          <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With service providers who assist in operating our platform (under strict confidentiality agreements)</li>
            <li>When required by law or to protect our rights and safety</li>
            <li>In connection with a business transfer or merger (with prior notice)</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your Rights and Choices</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request access to your personal data</li>
            <li><strong>Correction:</strong> Update or correct your information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Data Export:</strong> Download your data (Premium users)</li>
            <li><strong>Privacy Mode:</strong> Enable enhanced privacy settings</li>
            <li><strong>Communication Preferences:</strong> Opt out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Cookies and Tracking</h2>
          <p className="mb-4">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintain your login session</li>
            <li>Remember your preferences</li>
            <li>Analyze usage patterns</li>
            <li>Improve our services</li>
          </ul>
          <p className="mt-4">You can control cookie settings through your browser preferences.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">International Users</h2>
          <p>
            If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p>Email: privacy@talkai.im</p>
          </div>
        </section>
      </div>
    </div>
  );
} 