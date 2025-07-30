import React, { useState } from 'react';

function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How long does the assessment take?",
      answer: "The IPIP-NEO assessment contains 120 questions and typically takes 15-20 minutes to complete. You can take breaks and return to finish later if needed."
    },
    {
      question: "How accurate are the results?",
      answer: "The IPIP-NEO is a scientifically validated assessment with high reliability. However, like all personality tests, it provides a snapshot of your current self-perception and should be interpreted as one piece of information about yourself."
    },
    {
      question: "Can my personality change over time?",
      answer: "Yes, personality traits can change gradually over time, especially during major life transitions. While core traits tend to be relatively stable, they can shift due to life experiences, therapy, or conscious effort."
    },
    {
      question: "Are there right or wrong answers?",
      answer: "No, there are no right or wrong answers. The assessment measures your typical thoughts, feelings, and behaviors. Answer honestly based on how you generally are, not how you think you should be."
    },
    {
      question: "How does this compare to other personality tests?",
      answer: "The IPIP-NEO is based on the Big Five model, which is the most scientifically supported framework in personality psychology. Unlike some popular tests, it's based on decades of research and has strong empirical support."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes, we take privacy seriously. Your responses are anonymized and encrypted. We don't share individual results with third parties, and you can request deletion of your data at any time."
    },
    {
      question: "Can I retake the assessment?",
      answer: "Yes, you can retake the assessment at any time. However, we recommend waiting at least a few months between assessments, as personality traits are relatively stable in the short term."
    },
    {
      question: "What should I do with my results?",
      answer: "Use your results for self-reflection and personal growth. They can help you understand your strengths, areas for development, and how you might interact with others. Consider discussing them with a counselor or coach for deeper insights."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white my-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  openFAQ === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openFAQ === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Still have questions?</h2>
        <p className="text-blue-800 mb-4">
          If you have additional questions about the IPIP-NEO assessment or your results, 
          please don't hesitate to reach out to us.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}

export default FAQPage;

