import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        let calculatedResults, totalQuestions, answeredQuestions;
        
        // Prova prima a leggere da location.state
        const stateData = location.state;
        if (stateData && stateData.results) {
          console.log('Loading results from location.state');
          calculatedResults = stateData.results;
          totalQuestions = stateData.totalQuestions;
          answeredQuestions = stateData.answeredQuestions;
        } else {
          // Fallback 1: leggi da sessionStorage
          console.log('location.state empty, trying sessionStorage...');
          let savedResults = sessionStorage.getItem('ipip_neo_results');
          
          if (!savedResults) {
            // Fallback 2: leggi da localStorage
            console.log('sessionStorage empty, trying localStorage...');
            savedResults = localStorage.getItem('ipip_neo_results');
          }
          
          if (savedResults) {
            const parsedData = JSON.parse(savedResults);
            console.log('Loading results from storage:', parsedData);
            calculatedResults = parsedData.results;
            totalQuestions = parsedData.totalQuestions;
            answeredQuestions = parsedData.answeredQuestions;
          } else {
            throw new Error('No results data available in location.state, sessionStorage, or localStorage');
          }
        }
        
        if (calculatedResults) {
          console.log('Loading results for', answeredQuestions, 'out of', totalQuestions, 'questions');
          setResults(calculatedResults);
        } else {
          throw new Error('No results data available');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading results:', err);
        setError('Failed to load results. Please take the test again.');
        setLoading(false);
      }
    };

    loadResults();
  }, [location.state]);

  const handleTakeTestAgain = () => {
    // Pulisce i risultati salvati da entrambi gli storage
    sessionStorage.removeItem('ipip_neo_results');
    localStorage.removeItem('ipip_neo_results');
    console.log('Cleared saved results from sessionStorage and localStorage');
    navigate('/test');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your personality results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No results available'}</p>
          <button 
            onClick={() => navigate('/test')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mr-4"
          >
            Take Test Again
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const radarData = Object.entries(results.trait_scores || {}).map(([trait, data]) => ({
    trait: data.name,
    score: Math.round(data.percentile || 0),
    fullMark: 100
  }));

  const barData = Object.entries(results.trait_scores || {}).map(([trait, data]) => ({
    name: data.name,
    score: Math.round(data.percentile || 0),
    average: data.average || 0,
    fill: data.color
  }));

  const getPersonalityType = (traits) => {
    const scores = Object.values(traits);
    const avgScore = scores.reduce((sum, trait) => sum + (trait.percentile || 0), 0) / scores.length;
    
    if (avgScore > 75) return { type: "The Achiever", description: "High achiever with strong personality traits across multiple dimensions" };
    if (avgScore > 60) return { type: "The Balanced Leader", description: "Well-balanced personality with above-average traits" };
    if (avgScore > 40) return { type: "The Steady Contributor", description: "Balanced personality with consistent moderate traits" };
    if (avgScore > 25) return { type: "The Thoughtful Observer", description: "Reflective personality with measured responses" };
    return { type: "The Introspective", description: "Thoughtful and introspective personality with unique perspectives" };
  };

  const personalityType = getPersonalityType(results.trait_scores || {});

  const getTraitInterpretation = (percentile) => {
    if (percentile >= 80) return { level: "Very High", description: "Significantly above average", color: "text-green-700" };
    if (percentile >= 60) return { level: "High", description: "Above average", color: "text-blue-700" };
    if (percentile >= 40) return { level: "Average", description: "Typical range", color: "text-gray-700" };
    if (percentile >= 20) return { level: "Low", description: "Below average", color: "text-orange-700" };
    return { level: "Very Low", description: "Significantly below average", color: "text-red-700" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Personality Results</h1>
          <p className="text-gray-600 mb-4">Based on the Big Five personality model (IPIP-NEO)</p>
          <p className="text-sm text-gray-500 mb-4">
            Analysis based on {results.answered_questions} out of {results.total_questions} questions
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-indigo-600 mb-2">{personalityType.type}</h2>
            <p className="text-gray-600">{personalityType.description}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personality Profile Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="trait" />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={false}
                  />
                  <Radar
                    name="Percentile"
                    dataKey="score"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trait Scores</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentile']}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Detailed Trait Analysis</h2>
            
            <div className="grid gap-6">
              {Object.entries(results.trait_scores || {}).map(([trait, data]) => {
                const interpretation = getTraitInterpretation(data.percentile || 0);
                return (
                  <div key={trait} className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-3"
                          style={{ backgroundColor: data.color }}
                        ></div>
                        {data.name}
                      </h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-indigo-600">
                          {Math.round(data.percentile || 0)}%
                        </span>
                        <p className="text-sm text-gray-500">Percentile</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Low</span>
                        <span>Average</span>
                        <span>High</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${data.percentile || 0}%`,
                            backgroundColor: data.color
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p><strong>Average Score:</strong> {(data.average || 0).toFixed(2)} / 5.0</p>
                        <p><strong>Questions:</strong> {data.count || 0}</p>
                      </div>
                      <div>
                        <p className={`font-semibold ${interpretation.color}`}>
                          <strong>Level:</strong> {interpretation.level}
                        </p>
                        <p className="text-gray-600">{interpretation.description}</p>
                      </div>
                      <div>
                        <p><strong>Percentile:</strong> {Math.round(data.percentile || 0)}th</p>
                        <p className="text-gray-600">
                          Higher than {Math.round(data.percentile || 0)}% of people
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trait Descriptions */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Understanding Your Traits</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    Neuroticism
                  </h3>
                  <p className="text-sm text-gray-600">
                    Measures emotional stability and tendency to experience negative emotions.
                    Higher scores indicate greater emotional reactivity and stress sensitivity.
                    Lower scores suggest emotional resilience and stability.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-yellow-700 mb-2 flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    Extraversion
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reflects sociability, assertiveness, and positive emotionality.
                    Higher scores indicate more outgoing, energetic, and social behavior.
                    Lower scores suggest preference for solitude and quiet activities.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    Openness
                  </h3>
                  <p className="text-sm text-gray-600">
                    Measures creativity, curiosity, and openness to new experiences.
                    Higher scores indicate greater intellectual curiosity and artistic appreciation.
                    Lower scores suggest preference for conventional and familiar approaches.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                    Agreeableness
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reflects compassion, cooperation, and trust in others.
                    Higher scores indicate more cooperative, trusting, and empathetic behavior.
                    Lower scores suggest competitive and skeptical tendencies.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-700 mb-2 flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                    Conscientiousness
                  </h3>
                  <p className="text-sm text-gray-600">
                    Measures organization, discipline, and goal-directed behavior.
                    Higher scores indicate greater self-discipline, reliability, and achievement orientation.
                    Lower scores suggest flexibility and spontaneity.
                  </p>
                </div>

                {/* Summary Box */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-800 mb-2">Your Profile Summary</h4>
                  <p className="text-sm text-indigo-700">
                    Your personality profile shows a unique combination of traits that influence 
                    how you think, feel, and behave. This assessment is based on scientifically 
                    validated questions from the IPIP-NEO inventory.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <div className="space-x-4">
              <button
                onClick={handleTakeTestAgain}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Take Test Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Return Home
              </button>
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;

