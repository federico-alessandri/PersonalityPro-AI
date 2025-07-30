import React from 'react';
import { Brain, TrendingUp, Users, Target, Lightbulb, Heart } from 'lucide-react';

const AIResultsEnhancer = ({ results, mode }) => {
  const getPersonalityTypeAI = (traits) => {
    // Algoritmo migliorato per determinazione tipo personalità
    const { neuroticism, extraversion, openness, agreeableness, conscientiousness } = traits;
    
    // Identifica il tratto dominante
    const traitValues = [
      { name: 'neuroticism', value: neuroticism, label: 'Emotional Sensitivity' },
      { name: 'extraversion', value: extraversion, label: 'Social Energy' },
      { name: 'openness', value: openness, label: 'Intellectual Curiosity' },
      { name: 'agreeableness', value: agreeableness, label: 'Interpersonal Harmony' },
      { name: 'conscientiousness', value: conscientiousness, label: 'Goal Orientation' }
    ];
    
    const dominant = traitValues.reduce((max, trait) => 
      trait.value > max.value ? trait : max
    );
    
    // Pattern di personalità basati su combinazioni
    if (neuroticism > 80) {
      if (openness > 70) return "The Sensitive Creative";
      if (conscientiousness > 70) return "The Anxious Achiever";
      return "The Emotional Reactor";
    }
    
    if (extraversion > 75 && openness > 75) return "The Innovator";
    if (extraversion > 75 && agreeableness > 75) return "The Collaborator";
    if (agreeableness > 75 && conscientiousness > 75) return "The Supporter";
    if (openness > 75 && conscientiousness > 75) return "The Thinker";
    if (conscientiousness > 75) return "The Steady Performer";
    if (extraversion > 75) return "The Social Catalyst";
    if (openness > 75) return "The Explorer";
    if (agreeableness > 75) return "The Harmonizer";
    
    return "The Balanced";
  };

  const getTraitInsights = (trait, value) => {
    const insights = {
      neuroticism: {
        high: {
          description: "You experience emotions intensely and may be more sensitive to stress. This emotional depth can be a source of creativity and empathy.",
          strengths: ["Deep emotional awareness", "High empathy", "Creative sensitivity", "Authentic expression"],
          growth: ["Stress management techniques", "Mindfulness practices", "Emotional regulation skills", "Building resilience"],
          career: "Consider roles that value emotional intelligence: counseling, creative arts, human resources, or research."
        },
        medium: {
          description: "You maintain a balanced emotional state, experiencing both stability and appropriate emotional responses to situations.",
          strengths: ["Emotional balance", "Adaptability", "Realistic outlook", "Steady performance"],
          growth: ["Developing emotional vocabulary", "Stress prevention", "Building confidence", "Assertiveness training"],
          career: "Your emotional stability suits many fields: management, education, healthcare, or business."
        },
        low: {
          description: "You tend to remain calm under pressure and maintain emotional stability. You're resilient in the face of challenges.",
          strengths: ["Emotional stability", "Stress resilience", "Calm decision-making", "Consistent performance"],
          growth: ["Emotional awareness", "Empathy development", "Recognizing others' emotions", "Vulnerability in relationships"],
          career: "Your stability is valuable in high-pressure roles: emergency services, leadership, finance, or operations."
        }
      },
      extraversion: {
        high: {
          description: "You're energized by social interaction and tend to be outgoing, assertive, and enthusiastic in your approach to life.",
          strengths: ["Natural leadership", "Strong communication", "Team motivation", "Networking abilities"],
          growth: ["Active listening", "Solitude appreciation", "Depth over breadth", "Patience with introverts"],
          career: "Thrive in people-focused roles: sales, marketing, public relations, teaching, or management."
        },
        medium: {
          description: "You're comfortable in both social and solitary situations, adapting your energy to the context and people around you.",
          strengths: ["Social flexibility", "Balanced communication", "Adaptable leadership", "Versatile networking"],
          growth: ["Developing consistent style", "Building deeper relationships", "Public speaking", "Team dynamics"],
          career: "Your versatility fits many roles: project management, consulting, research, or customer service."
        },
        low: {
          description: "You prefer quieter environments and smaller groups, often doing your best thinking and work independently.",
          strengths: ["Deep focus", "Independent work", "Thoughtful analysis", "Quality relationships"],
          growth: ["Public speaking", "Networking skills", "Team collaboration", "Assertiveness"],
          career: "Excel in focused roles: research, writing, technical work, analysis, or specialized expertise."
        }
      },
      openness: {
        high: {
          description: "You're intellectually curious, creative, and open to new experiences. You enjoy exploring ideas and possibilities.",
          strengths: ["Creative thinking", "Innovation", "Learning agility", "Cultural appreciation"],
          growth: ["Practical application", "Follow-through", "Detail attention", "Routine acceptance"],
          career: "Flourish in creative fields: design, research, arts, innovation, or strategic planning."
        },
        medium: {
          description: "You balance appreciation for new ideas with practical considerations, being selectively open to experiences.",
          strengths: ["Balanced perspective", "Practical creativity", "Selective learning", "Measured risk-taking"],
          growth: ["Expanding comfort zone", "Creative exploration", "Intellectual curiosity", "Cultural exposure"],
          career: "Suit balanced roles: education, business development, product management, or consulting."
        },
        low: {
          description: "You prefer familiar approaches and practical solutions, valuing tradition and proven methods over novelty.",
          strengths: ["Practical focus", "Reliable methods", "Attention to detail", "Consistent execution"],
          growth: ["Embracing change", "Creative thinking", "New perspectives", "Innovation appreciation"],
          career: "Excel in structured roles: operations, administration, quality control, or traditional industries."
        }
      },
      agreeableness: {
        high: {
          description: "You're naturally cooperative, trusting, and concerned with others' well-being. You prioritize harmony in relationships.",
          strengths: ["Team collaboration", "Conflict resolution", "Empathy", "Supportive leadership"],
          growth: ["Assertiveness", "Boundary setting", "Self-advocacy", "Difficult conversations"],
          career: "Thrive in helping roles: healthcare, social work, education, human resources, or customer service."
        },
        medium: {
          description: "You balance cooperation with self-interest, being helpful while maintaining appropriate boundaries.",
          strengths: ["Balanced relationships", "Fair negotiation", "Selective trust", "Diplomatic communication"],
          growth: ["Deeper empathy", "Team building", "Conflict mediation", "Collaborative leadership"],
          career: "Fit well in balanced roles: management, business, law, consulting, or project coordination."
        },
        low: {
          description: "You're direct and competitive, prioritizing efficiency and results over maintaining harmony in all situations.",
          strengths: ["Direct communication", "Competitive drive", "Objective decision-making", "Results focus"],
          growth: ["Empathy development", "Team collaboration", "Diplomatic communication", "Relationship building"],
          career: "Excel in competitive fields: sales, law, business, leadership, or entrepreneurship."
        }
      },
      conscientiousness: {
        high: {
          description: "You're highly organized, disciplined, and goal-oriented. You take responsibilities seriously and work systematically.",
          strengths: ["Excellent planning", "Reliable execution", "Goal achievement", "Quality focus"],
          growth: ["Flexibility", "Spontaneity", "Work-life balance", "Delegation skills"],
          career: "Excel in structured roles: project management, finance, operations, quality assurance, or administration."
        },
        medium: {
          description: "You balance organization with flexibility, being responsible while maintaining adaptability to changing circumstances.",
          strengths: ["Balanced approach", "Adaptive planning", "Reasonable standards", "Flexible execution"],
          growth: ["Time management", "Goal setting", "Attention to detail", "Systematic approaches"],
          career: "Suit many roles: general management, education, healthcare, consulting, or customer relations."
        },
        low: {
          description: "You prefer flexibility and spontaneity, adapting quickly to changing situations rather than following rigid plans.",
          strengths: ["Adaptability", "Creative spontaneity", "Crisis response", "Flexible thinking"],
          growth: ["Organization skills", "Goal setting", "Time management", "Follow-through"],
          career: "Thrive in dynamic roles: creative fields, emergency services, sales, or entrepreneurship."
        }
      }
    };

    const level = value >= 70 ? 'high' : value >= 30 ? 'medium' : 'low';
    return insights[trait][level];
  };

  const getModeSpecificInsights = (mode, results) => {
    const modeInsights = {
      brief: {
        title: "Quick Personality Overview",
        description: "Based on your brief assessment, here's an initial glimpse into your personality profile. For deeper insights, consider taking our comprehensive assessment.",
        reliability: "This overview provides a general indication of your personality traits. Results may vary with a more comprehensive assessment."
      },
      standard: {
        title: "Comprehensive Personality Analysis", 
        description: "Your standard assessment provides a well-rounded view of your personality across all Big Five dimensions with good reliability.",
        reliability: "This assessment provides reliable insights into your personality patterns and behavioral tendencies."
      },
      complete: {
        title: "Complete Personality Profile",
        description: "Your comprehensive assessment offers the most detailed and accurate analysis of your personality, providing deep insights for personal and professional development.",
        reliability: "This assessment provides highly reliable and detailed insights with maximum scientific accuracy."
      }
    };

    return modeInsights[mode] || modeInsights.complete;
  };

  const getActionableRecommendations = (results) => {
    const recommendations = [];
    
    // Analisi pattern specifici
    if (results.neuroticism > 70) {
      recommendations.push({
        icon: <Heart className="w-5 h-5" />,
        title: "Emotional Wellness",
        action: "Practice mindfulness and stress management techniques. Consider meditation or counseling for emotional regulation."
      });
    }
    
    if (results.extraversion < 30) {
      recommendations.push({
        icon: <Users className="w-5 h-5" />,
        title: "Social Skills Development",
        action: "Gradually expand your social comfort zone. Start with small group interactions and build confidence."
      });
    }
    
    if (results.openness > 70) {
      recommendations.push({
        icon: <Lightbulb className="w-5 h-5" />,
        title: "Creative Expression",
        action: "Channel your creativity into projects or hobbies. Explore new learning opportunities and experiences."
      });
    }
    
    if (results.conscientiousness < 30) {
      recommendations.push({
        icon: <Target className="w-5 h-5" />,
        title: "Organization & Planning",
        action: "Develop time management systems. Start with simple daily routines and gradually build structure."
      });
    }
    
    if (results.agreeableness > 80) {
      recommendations.push({
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Assertiveness Training",
        action: "Practice setting healthy boundaries. Learn to advocate for your needs while maintaining relationships."
      });
    }

    return recommendations;
  };

  if (!results) return null;

  const personalityType = getPersonalityTypeAI(results);
  const modeInsights = getModeSpecificInsights(mode, results);
  const recommendations = getActionableRecommendations(results);

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Brain className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">AI Psychometrician Analysis</h3>
            <p className="text-sm text-gray-600">{modeInsights.title}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-2">{modeInsights.description}</p>
        <p className="text-sm text-blue-600 italic">{modeInsights.reliability}</p>
      </div>

      {/* Personality Type */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Your Personality Type</h4>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg">
          <h5 className="text-xl font-bold mb-2">{personalityType}</h5>
          <p className="text-blue-100">
            Based on your unique combination of traits, this type reflects your primary behavioral patterns and preferences.
          </p>
        </div>
      </div>

      {/* Detailed Trait Insights */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Detailed Trait Analysis</h4>
        
        {Object.entries(results).map(([trait, value]) => {
          if (trait === 'personalityType') return null;
          
          const insights = getTraitInsights(trait, value);
          const traitName = trait.charAt(0).toUpperCase() + trait.slice(1);
          
          return (
            <div key={trait} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-lg font-semibold text-gray-900">{traitName}</h5>
                <span className="text-2xl font-bold text-blue-600">{value}%</span>
              </div>
              
              <p className="text-gray-700 mb-4">{insights.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h6 className="font-semibold text-green-700 mb-2">Key Strengths</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h6 className="font-semibold text-orange-700 mb-2">Growth Areas</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {insights.growth.map((area, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h6 className="font-semibold text-blue-700 mb-2">Career Insights</h6>
                  <p className="text-sm text-gray-600">{insights.career}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="text-blue-600 mr-3 mt-1">{rec.icon}</div>
                <div>
                  <h6 className="font-semibold text-gray-900">{rec.title}</h6>
                  <p className="text-sm text-gray-600">{rec.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Closing Message */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex items-start">
          <Brain className="w-6 h-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h6 className="font-semibold text-blue-800 mb-1">AI Psychometrician Note</h6>
            <p className="text-blue-700 text-sm">
              Remember, personality is dynamic and can evolve over time. These insights are meant to enhance self-awareness 
              and guide personal development, not to limit your potential. Use this information as a starting point for 
              growth and self-discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResultsEnhancer;

