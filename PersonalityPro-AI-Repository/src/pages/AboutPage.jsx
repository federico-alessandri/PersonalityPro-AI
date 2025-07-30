import React from 'react';

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white my-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About IPIP-NEO</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is the IPIP-NEO?</h2>
          <p className="text-gray-700 leading-relaxed">
            The IPIP-NEO is a scientifically validated personality assessment based on the Big Five model of personality. 
            It measures five major personality dimensions and 30 specific facets, providing a comprehensive understanding 
            of your personality traits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Big Five Model</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Openness to Experience</h3>
              <p className="text-gray-700 text-sm">
                Reflects imagination, creativity, intellectual curiosity, and appreciation for art and beauty.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Conscientiousness</h3>
              <p className="text-gray-700 text-sm">
                Measures organization, self-discipline, goal-directed behavior, and attention to detail.
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Extraversion</h3>
              <p className="text-gray-700 text-sm">
                Assesses sociability, assertiveness, energy level, and positive emotions.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Agreeableness</h3>
              <p className="text-gray-700 text-sm">
                Evaluates trust, altruism, cooperation, and concern for others' well-being.
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg md:col-span-2">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Neuroticism</h3>
              <p className="text-gray-700 text-sm">
                Measures emotional stability, anxiety, mood fluctuations, and stress reactivity.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Scientific Foundation</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The IPIP-NEO is based on the International Personality Item Pool (IPIP), developed by Lewis Goldberg and 
            colleagues. It provides a public domain alternative to commercial personality tests while maintaining 
            high scientific standards.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Validated across multiple cultures and languages</li>
            <li>High reliability and test-retest stability</li>
            <li>Extensive research supporting its validity</li>
            <li>Used in academic research and clinical settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Interpret Your Results</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your results are presented as percentile scores, showing how you compare to others. For example, 
            a score at the 70th percentile means you scored higher than 70% of people who have taken this assessment.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Notes:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>There are no "good" or "bad" personality traits</li>
              <li>Each trait has advantages and disadvantages</li>
              <li>Personality can change gradually over time</li>
              <li>Context matters - behavior varies across situations</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data</h2>
          <p className="text-gray-700 leading-relaxed">
            We take your privacy seriously. Your assessment responses are anonymized and used only for generating 
            your personality profile. We do not share individual results with third parties, and you can request 
            deletion of your data at any time.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;

