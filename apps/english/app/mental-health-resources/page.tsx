export default function MentalHealthResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Mental Health Resources</h1>
      
      <div className="space-y-8">
        <section>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-3">At a Glance</h2>
            <p className="text-blue-700 dark:text-blue-300">
              There are many resources available to help prevent suicide and support mental health. Below are resources for mental health support from trusted federal sources and national organizations.
            </p>
          </div>
        </section>

        {/* Helplines Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-primary">Helplines</h2>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-3">Need help? Know someone who does?</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">988 Suicide and Crisis Lifeline</h4>
                <p className="text-red-600 dark:text-red-400 mb-3">
                  The 988 Suicide and Crisis Lifeline is a 24-hour, toll-free, confidential suicide prevention hotline available to anyone in suicidal crisis or emotional distress. Calls are routed to the nearest crisis center in a national network, where callers receive crisis counseling and mental health referrals.
                </p>
                <p className="text-red-600 dark:text-red-400 mb-3">
                  Contact the 988 Suicide and Crisis Lifeline if you are experiencing mental health-related distress or are worried about a loved one who may need crisis support.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-red-600 dark:text-red-400 mb-3">
                  <li>Call or text <strong>988</strong></li>
                  <li>Chat at <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-800 dark:hover:text-red-200">988lifeline.org</a></li>
                </ul>
                <p className="text-red-600 dark:text-red-400 font-medium">
                  Connect with a trained crisis counselor. 988 is confidential, free, and available 24/7/365.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">The Trevor Project</h4>
              <p className="text-purple-700 dark:text-purple-300 mb-2">
                24/7 Suicide Hotline for LGBTQIA+ Youth
              </p>
              <ul className="text-purple-600 dark:text-purple-400 space-y-1">
                <li>Call <a href="tel:1-866-488-7386" className="underline">1-866-488-7386</a></li>
                <li>Text START to <a href="sms:678-678" className="underline">678-678</a></li>
                <li>Visit <a href="https://www.thetrevorproject.org/" target="_blank" rel="noopener noreferrer" className="underline">thetrevorproject.org</a></li>
              </ul>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">Disaster Distress Helpline</h4>
              <p className="text-orange-700 dark:text-orange-300 mb-2">
                Support for those experiencing emotional distress due to disasters
              </p>
              <p className="text-orange-600 dark:text-orange-400">
                CALL or TEXT <a href="tel:1-800-985-5990" className="underline">1-800-985-5990</a> (press 2 for Spanish)
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Veterans Crisis Line</h4>
              <p className="text-green-700 dark:text-green-300 mb-2">
                Support for veterans in crisis
              </p>
              <ul className="text-green-600 dark:text-green-400 space-y-1">
                <li>Call <a href="tel:988" className="underline">988</a>, then select 1</li>
                <li>Text <a href="sms:838255" className="underline">838255</a></li>
                <li>Visit <a href="https://www.veteranscrisisline.net/" target="_blank" rel="noopener noreferrer" className="underline">veteranscrisisline.net</a></li>
              </ul>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-teal-800 dark:text-teal-200 mb-2">Crisis Text Line</h4>
              <p className="text-teal-700 dark:text-teal-300 mb-2">
                Free 24/7 support via text message
              </p>
              <p className="text-teal-600 dark:text-teal-400">
                Text HOME to <a href="sms:741741" className="underline">741741</a>
              </p>
            </div>
          </div>
        </section>

        {/* CDC Resources Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-primary">CDC Resources</h2>
          
          <h3 className="text-xl font-medium mb-4">Support and Prevention Resources</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Coping with Stress</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                CDC's web page on learning to cope with stress in a healthy way.
              </p>
              <a href="https://www.cdc.gov/mental-health/living-with/index.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Learn stress management techniques →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Coping with a Disaster or Traumatic Event</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                CDC's web page on mental health during and after a disaster includes information on coping with the stress that results from natural and manmade traumatic events.
              </p>
              <a href="https://www.cdc.gov/natural-disasters/communication-resources/coping-with-a-disaster-or-traumatic-event-factsheet.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Access disaster mental health resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Mental Health</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                This page provides information on all of CDC's work related to mental health.
              </p>
              <a href="https://www.cdc.gov/mental-health/about/what-cdc-is-doing.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Explore CDC mental health resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Suicide in Rural America</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                CDC's web page on suicide in rural areas provides reports, a policy brief, a press release, and suicide prevention resources.
              </p>
              <a href="https://www.cdc.gov/rural-health/php/public-health-strategy/suicide-in-rural-america-prevention-strategies.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Access rural mental health resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Suicide Disparities Information</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Information that highlights disparities in suicide rates across the United States. People of any age, race, ethnicity, or sex can experience suicide risk, but certain groups have substantially higher rates of suicide than the general U.S. population.
              </p>
              <a href="https://www.cdc.gov/suicide/disparities/index.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Learn about suicide disparities →
              </a>
            </div>
          </div>
        </section>

        {/* Other Federal Resources Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-primary">Other Federal Resources</h2>
          
          <h3 className="text-xl font-medium mb-4">Campaigns</h3>
          <div className="space-y-4 mb-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">BeThe1To</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                This is the National Suicide Prevention Lifeline's campaign for National Suicide Prevention Month and beyond, spreading the word about actions we can all take to prevent suicide.
              </p>
              <a href="https://bethe1to.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Learn how to Be The 1 To help →
              </a>
            </div>
          </div>

          <h3 className="text-xl font-medium mb-4">Federal Organizations</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Substance Abuse and Mental Health Services Administration (SAMHSA)</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                SAMHSA is the federal agency charged with improving the quality and availability of prevention, treatment, and rehabilitative services to reduce illness, death, disability, and cost to society resulting from substance abuse and mental illnesses.
              </p>
              <a href="https://www.samhsa.gov/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Visit SAMHSA →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">National Institute of Mental Health (NIMH)</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                NIMH is the lead institute at the National Institutes of Health dedicated to research on mental health disorders.
              </p>
              <a href="https://www.nimh.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Explore NIMH resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">National Child Traumatic Stress Network (NCTSN)</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                NCTSN works to raise the standard of care and improve access to services for traumatized children, their families, and communities throughout the United States.
              </p>
              <a href="https://www.nctsn.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Access child trauma resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">The Suicide Prevention Resource Center (SPRC)</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                The Suicide Prevention Resource Center (SPRC) is the only federally supported resource center devoted to advancing the implementation of the National Strategy for Suicide Prevention.
              </p>
              <a href="https://sprc.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Visit SPRC →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Community-Led Suicide Prevention</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Community-Led Suicide Prevention (CLSP) helps communities come together to create and reach their suicide prevention goals. CLSP's web-based toolkit includes step-by-step information and how-to tools for implementing CDC's Suicide Prevention Resource for Action.
              </p>
              <a href="https://www.cdc.gov/suicide/prevention/community-led.html" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Access community prevention tools →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Indian Health Service Suicide Prevention Program</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                This national initiative to prevent suicide is based on fostering collaborations across tribes, tribal organizations, urban Indian organizations, and the entire Indian Health System.
              </p>
              <a href="https://www.ihs.gov/suicideprevention/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Access IHS suicide prevention resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">U.S. Department of Defense Suicide Prevention</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                The U.S. Department of Defense Suicide Prevention Office oversees the suicide prevention work across all branches of the military.
              </p>
              <a href="https://www.dspo.mil/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Access military suicide prevention resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">National Action Alliance for Suicide Prevention</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                The National Action Alliance for Suicide Prevention is the public-private partnership advancing the National Strategy for Suicide Prevention.
              </p>
              <a href="https://theactionalliance.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Visit the Action Alliance →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">U.S. Department of Veterans Affairs (VA) Suicide Prevention</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                The VA provides health and mental health services to U.S. veterans. This page provides information about mental health conditions, including suicide prevention, and how veterans can get help.
              </p>
              <a href="https://www.mentalhealth.va.gov/suicide_prevention/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Access VA mental health services →
              </a>
            </div>
          </div>
        </section>

        {/* Additional Resources Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-primary">Additional Mental Health Resources</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Mental Health America</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Mental health screening tools, resources, and advocacy information.
              </p>
              <a href="https://www.mhanational.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Visit Mental Health America →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">National Alliance on Mental Illness (NAMI)</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Education, support, and advocacy for individuals and families affected by mental illness.
              </p>
              <a href="https://www.nami.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Explore NAMI resources →
              </a>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Psychology Today Therapist Directory</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Find licensed mental health professionals in your area.
              </p>
              <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                Find a therapist →
              </a>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Remember</h3>
          <p className="text-blue-700 dark:text-blue-300">
            Your mental health is important. If you're struggling, please reach out to qualified professionals who can provide the care and support you deserve. These resources are here to help, and seeking help is a sign of strength, not weakness.
          </p>
        </section>
      </div>
    </div>
  );
} 