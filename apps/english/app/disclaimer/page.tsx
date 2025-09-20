import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Disclaimer</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-3">🚨 IMPORTANT MEDICAL DISCLAIMER</h2>
            <p className="text-red-700 dark:text-red-300 font-medium">
              talkAI is NOT a medical device, healthcare provider, or substitute for professional mental health care. 
              This service is for informational and emotional support purposes only.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Not Professional Medical Advice</h2>
          <p className="mb-4">
            The information and conversations provided through talkAI are not intended to be a substitute for professional medical advice, diagnosis, or treatment. Our AI system:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cannot diagnose mental health conditions</li>
            <li>Cannot prescribe medications or treatments</li>
            <li>Cannot provide crisis intervention services</li>
            <li>Cannot replace therapy with licensed professionals</li>
            <li>Should not be relied upon for medical decisions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Emergency Situations</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ If You Are in Crisis</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-3">
              If you are experiencing a mental health emergency, thoughts of self-harm, or suicidal ideation, please:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-yellow-700 dark:text-yellow-300">
              <li>Call 911 (US) or your local emergency number immediately</li>
              <li>Contact the 988 Suicide & Crisis Lifeline (US): 988</li>
              <li>Go to your nearest emergency room</li>
              <li>Contact a licensed mental health professional</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our AI service is not equipped to handle crisis situations and should never be used as a replacement for emergency services. For a comprehensive list of mental health resources and crisis support, visit our <Link href="/mental-health-resources" className="text-primary underline hover:text-primary/80 transition-colors">Mental Health Resources page</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Limitations of AI Technology</h2>
          <p className="mb-4">
            While our AI technology is advanced, it has important limitations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI responses are generated based on patterns in data, not human understanding</li>
            <li>The AI cannot truly understand complex human emotions or situations</li>
            <li>Responses may not always be appropriate or helpful for your specific situation</li>
            <li>The AI cannot form genuine therapeutic relationships</li>
            <li>Technical errors or misinterpretations may occur</li>
            <li>The AI lacks the training and licensing of human therapists</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Intended Use</h2>
          <p className="mb-4">
            talkAI is designed for:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>General emotional support and wellness conversations</li>
            <li>Stress management and relaxation techniques</li>
            <li>Emotional awareness and reflection</li>
            <li>Supplemental support alongside professional care</li>
            <li>Personal growth and self-improvement discussions</li>
          </ul>
          
          <p className="mb-4">
            talkAI is NOT intended for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Treating serious mental health conditions</li>
            <li>Crisis intervention or emergency situations</li>
            <li>Replacing professional therapy or counseling</li>
            <li>Medical diagnosis or treatment recommendations</li>
            <li>Legal or financial advice</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Professional Consultation Recommended</h2>
          <p className="mb-4">
            We strongly recommend consulting with qualified healthcare professionals for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Persistent feelings of sadness, anxiety, or depression</li>
            <li>Substance abuse or addiction issues</li>
            <li>Relationship or family problems</li>
            <li>Trauma or PTSD symptoms</li>
            <li>Eating disorders</li>
            <li>Any serious mental health concerns</li>
          </ul>
          <p className="mt-4">
            To find qualified mental health professionals and additional resources, visit our <Link href="/mental-health-resources" className="text-primary underline hover:text-primary/80 transition-colors">Mental Health Resources page</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Data and Privacy Limitations</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>While we implement security measures, no system is 100% secure</li>
            <li>Voice data is processed by third-party AI services (Hume AI)</li>
            <li>Conversations may be analyzed for emotion detection</li>
            <li>Users should avoid sharing sensitive personal information</li>
            <li>Data retention policies are subject to legal requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">No Warranty</h2>
          <p className="mb-4">
            talkAI is provided "as is" without any warranties, express or implied. We do not guarantee:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The accuracy or appropriateness of AI responses</li>
            <li>Continuous availability of the service</li>
            <li>That the service will meet your specific needs</li>
            <li>Error-free operation or bug-free experience</li>
            <li>Compatibility with all devices or browsers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Limitation of Liability</h2>
          <p className="mb-4">
            To the maximum extent permitted by law, talkAI and its operators shall not be liable for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Any harm resulting from use of the service</li>
            <li>Decisions made based on AI conversations</li>
            <li>Technical failures or service interruptions</li>
            <li>Loss of data or privacy breaches</li>
            <li>Indirect, incidental, or consequential damages</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Age Restrictions</h2>
          <p>
            This service is not intended for children under 13 years of age. Users between 13-17 should have parental guidance and supervision when using mental health services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Regulatory Status</h2>
          <p>
            talkAI is not regulated by the FDA, state medical boards, or other healthcare regulatory agencies. It is not a medical device and has not undergone clinical trials for therapeutic efficacy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Responsibility</h2>
          <p className="mb-4">
            By using talkAI, you acknowledge that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You understand the limitations of AI technology</li>
            <li>You will seek professional help for serious mental health issues</li>
            <li>You will not rely solely on AI for mental health support</li>
            <li>You are responsible for your own wellbeing and decisions</li>
            <li>You will discontinue use if it causes distress or harm</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Updates to This Disclaimer</h2>
          <p>
            This disclaimer may be updated periodically to reflect changes in our service, technology, or legal requirements. Please review this page regularly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Information</h2>
          <p>
            If you have questions about this disclaimer or need to report concerns, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p>Email: support@talkai.im</p>
          </div>
        </section>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-8">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <strong>Remember:</strong> Your mental health is important. If you're struggling, please reach out to qualified professionals who can provide the care and support you deserve. Visit our <Link href="/mental-health-resources" className="text-primary underline hover:text-primary/80 transition-colors">Mental Health Resources page</Link> for comprehensive support options.
          </p>
        </div>
      </div>
    </div>
  );
} 