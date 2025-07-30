import React from 'react';
import { Brain, Clock, Target, Users } from 'lucide-react';

const AIGuide = ({ mode, step, totalSteps, onModeSelect, currentQuestion }) => {
  const getWelcomeMessage = () => {
    return {
      title: "🧠 Welcome to Your AI-Guided Personality Assessment",
      message: `Hello! I'm your AI psychometrician, and I'll guide you through a scientifically validated personality assessment based on the Big Five model (OCEAN). This test uses items from the International Personality Item Pool (IPIP-NEO), ensuring both reliability and validity.`,
      subtitle: "Let's discover your unique personality profile together."
    };
  };

  const getModeInfo = (selectedMode) => {
    const modes = {
      brief: {
        icon: <Clock className="w-6 h-6" />,
        title: "Brief Assessment",
        duration: "3 minutes",
        items: "20 items",
        description: "Quick overview of your personality profile, ideal for initial insights",
        accuracy: "Indicative",
        color: "bg-blue-500"
      },
      standard: {
        icon: <Target className="w-6 h-6" />,
        title: "Standard Assessment", 
        duration: "7 minutes",
        items: "60 items",
        description: "Balanced depth and efficiency, recommended for most users",
        accuracy: "Good",
        color: "bg-purple-500"
      },
      complete: {
        icon: <Brain className="w-6 h-6" />,
        title: "Comprehensive Assessment",
        duration: "12-15 minutes", 
        items: "120 items",
        description: "Full detailed analysis with maximum precision and reliability",
        accuracy: "Maximum",
        color: "bg-green-500"
      }
    };
    return modes[selectedMode];
  };

  const getProgressMessage = () => {
    const progress = Math.round((step / totalSteps) * 100);
    
    if (progress < 25) {
      return "Great start! You're building the foundation of your personality profile.";
    } else if (progress < 50) {
      return "Excellent progress! We're getting valuable insights into your personality.";
    } else if (progress < 75) {
      return "You're doing wonderfully! We're uncovering the deeper patterns of your behavior.";
    } else if (progress < 95) {
      return "Almost there! Your comprehensive personality profile is taking shape.";
    } else {
      return "Outstanding! You're about to discover your complete personality insights.";
    }
  };

  const getTraitExplanation = (questionText) => {
    // Simplified trait detection based on common IPIP-NEO patterns
    if (questionText?.toLowerCase().includes('worry') || 
        questionText?.toLowerCase().includes('anxious') ||
        questionText?.toLowerCase().includes('nervous')) {
      return {
        trait: "Neuroticism",
        explanation: "This question explores your emotional stability and stress resilience."
      };
    } else if (questionText?.toLowerCase().includes('party') || 
               questionText?.toLowerCase().includes('social') ||
               questionText?.toLowerCase().includes('talkative')) {
      return {
        trait: "Extraversion", 
        explanation: "This question examines your social energy and assertiveness."
      };
    } else if (questionText?.toLowerCase().includes('creative') || 
               questionText?.toLowerCase().includes('imagination') ||
               questionText?.toLowerCase().includes('ideas')) {
      return {
        trait: "Openness",
        explanation: "This question assesses your creativity and intellectual curiosity."
      };
    } else if (questionText?.toLowerCase().includes('organized') || 
               questionText?.toLowerCase().includes('plan') ||
               questionText?.toLowerCase().includes('careful')) {
      return {
        trait: "Conscientiousness",
        explanation: "This question evaluates your organization and self-discipline."
      };
    } else if (questionText?.toLowerCase().includes('helpful') || 
               questionText?.toLowerCase().includes('kind') ||
               questionText?.toLowerCase().includes('trust')) {
      return {
        trait: "Agreeableness",
        explanation: "This question measures your cooperation and empathy."
      };
    }
    return null;
  };

  if (!mode) {
    // Mode selection screen
    const welcome = getWelcomeMessage();
    
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AI Psychometrician</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{welcome.title}</h2>
          <p className="text-lg text-gray-600 mb-2">{welcome.message}</p>
          <p className="text-md text-blue-600 font-medium">{welcome.subtitle}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            📊 What You'll Discover
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[
              { letter: "O", name: "Openness", desc: "Creativity & curiosity" },
              { letter: "C", name: "Conscientiousness", desc: "Organization & discipline" },
              { letter: "E", name: "Extraversion", desc: "Social energy & assertiveness" },
              { letter: "A", name: "Agreeableness", desc: "Cooperation & empathy" },
              { letter: "N", name: "Neuroticism", desc: "Emotional stability" }
            ].map((trait, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-lg">
                  {trait.letter}
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">{trait.name}</h4>
                <p className="text-xs text-gray-600">{trait.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            🎯 Choose Your Assessment Mode
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['brief', 'standard', 'complete'].map((modeKey) => {
              const modeInfo = getModeInfo(modeKey);
              return (
                <div 
                  key={modeKey}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onModeSelect(modeKey)}
                >
                  <div className={`w-12 h-12 ${modeInfo.color} text-white rounded-lg flex items-center justify-center mb-4`}>
                    {modeInfo.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{modeInfo.title}</h4>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">⏱️ Duration: {modeInfo.duration}</p>
                    <p className="text-sm text-gray-600">📝 Items: {modeInfo.items}</p>
                    <p className="text-sm text-gray-600">🎯 Accuracy: {modeInfo.accuracy}</p>
                  </div>
                  <p className="text-sm text-gray-700">{modeInfo.description}</p>
                  <button className={`w-full mt-4 ${modeInfo.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}>
                    Select {modeInfo.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">🔒 Privacy & Approach</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>✅ Your responses are processed confidentially</div>
            <div>✅ No judgment - all personality types have strengths</div>
            <div>✅ Results focus on understanding, not labeling</div>
            <div>✅ Designed for personal growth and self-awareness</div>
          </div>
        </div>
      </div>
    );
  }

  // Progress guidance during assessment
  const modeInfo = getModeInfo(mode);
  const traitInfo = getTraitExplanation(currentQuestion);
  
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-start">
        <Brain className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-blue-800">AI Psychometrician</h4>
            <span className="text-sm text-blue-600">{modeInfo.title}</span>
          </div>
          <p className="text-blue-700 text-sm mb-2">{getProgressMessage()}</p>
          {traitInfo && (
            <div className="bg-white p-3 rounded-lg mt-2">
              <p className="text-xs text-gray-600 mb-1">
                <strong>{traitInfo.trait}:</strong> {traitInfo.explanation}
              </p>
            </div>
          )}
          <div className="flex items-center text-xs text-blue-600 mt-2">
            <Clock className="w-4 h-4 mr-1" />
            <span>Progress: {step}/{totalSteps} ({Math.round((step / totalSteps) * 100)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGuide;

