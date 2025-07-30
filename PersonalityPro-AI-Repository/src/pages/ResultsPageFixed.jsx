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
import PDFExportSimple from '../components/PDFExportSimple';

function ResultsPageFixed() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        let calculatedResults = null;
        
        // Metodo 1: Prova a leggere da location.state
        if (location.state && location.state.results) {
          console.log('Loading results from location.state');
          calculatedResults = location.state.results;
        } 
        // Metodo 2: Prova localStorage con chiave corretta
        else {
          console.log('location.state empty, trying localStorage...');
          let savedResults = localStorage.getItem('ipip_results');
          
          if (!savedResults) {
            // Metodo 3: Prova sessionStorage
            console.log('localStorage empty, trying sessionStorage...');
            savedResults = sessionStorage.getItem('ipip_neo_results');
          }
          
          if (savedResults) {
            const parsedData = JSON.parse(savedResults);
            // QuizPageComplete salva direttamente l'oggetto results
            calculatedResults = parsedData.traits || parsedData;
            console.log('Results loaded from storage:', calculatedResults);
          }
        }
        
        // Metodo 4: Se non ci sono risultati, prova a ricalcolare
        if (!calculatedResults) {
          console.log('No results found, trying to recalculate...');
          const answers = JSON.parse(localStorage.getItem('assessmentAnswers') || '{}');
          const questionsData = localStorage.getItem('ipip_neo_questions');
          
          if (Object.keys(answers).length > 0 && questionsData) {
            const questions = JSON.parse(questionsData);
            calculatedResults = calculateResults(answers, questions);
            console.log('Results recalculated:', calculatedResults);
          }
        }
        
        if (calculatedResults) {
          setResults(calculatedResults);
        } else {
          setError('No assessment results found. Please complete the assessment first.');
        }
        
      } catch (err) {
        console.error('Error loading results:', err);
        setError('Error loading results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [location.state]);

  const calculateResults = (answers, questions) => {
    console.log('=== RECALCULATING RESULTS ===');
    
    const traits = {
      neuroticism: { total: 0, count: 0 },
      extraversion: { total: 0, count: 0 },
      openness: { total: 0, count: 0 },
      agreeableness: { total: 0, count: 0 },
      conscientiousness: { total: 0, count: 0 }
    };

    const traitMapping = {
      'N': 'neuroticism',
      'E': 'extraversion', 
      'O': 'openness',
      'A': 'agreeableness',
      'C': 'conscientiousness'
    };

    // Calcola i punteggi per ogni tratto
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question && question.trait) {
        const traitName = traitMapping[question.trait];
        if (traitName && traits[traitName]) {
          let score = parseInt(answerValue);
          
          // Applica reverse scoring se necessario
          if (question.keyed_direction === '-') {
            score = 6 - score;
          }
          
          traits[traitName].total += score;
          traits[traitName].count += 1;
        }
      }
    });

    // Calcola percentili
    const results = {};
    Object.entries(traits).forEach(([trait, data]) => {
      if (data.count > 0) {
        const average = data.total / data.count;
        const percentile = Math.round(((average - 1) / 4) * 100);
        results[trait] = Math.max(0, Math.min(100, percentile));
      } else {
        results[trait] = 50; // Default se non ci sono dati
      }
    });

    console.log('Calculated results:', results);
    return results;
  };

  const getPersonalityType = (results) => {
    if (!results) return { type: 'Unknown', description: 'Unable to determine personality type.' };
    
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = results;
    
    // Logica corretta che considera tutti i tratti, incluso neuroticism
    if (neuroticism > 80) {
      if (openness > 70) {
        return {
          type: 'The Sensitive Creative',
          description: 'Highly creative and emotionally sensitive. You experience life intensely and channel emotions into innovative expression.'
        };
      } else if (conscientiousness > 70) {
        return {
          type: 'The Anxious Achiever',
          description: 'Driven and emotionally reactive. You set high standards for yourself and feel stress when things don\'t go as planned.'
        };
      } else {
        return {
          type: 'The Emotional Reactor',
          description: 'Highly sensitive to stress and emotional stimuli. You experience emotions intensely and may need extra support managing anxiety.'
        };
      }
    } else if (openness > 70 && conscientiousness > 70) {
      return {
        type: 'The Innovator',
        description: 'Creative, organized, and forward-thinking. You excel at bringing new ideas to life through systematic execution.'
      };
    } else if (extraversion > 70 && agreeableness > 70) {
      return {
        type: 'The Collaborator', 
        description: 'Outgoing and cooperative. You thrive in team environments and excel at building relationships.'
      };
    } else if (conscientiousness > 70 && agreeableness > 70) {
      return {
        type: 'The Supporter',
        description: 'Reliable and caring. You are the backbone of any team, providing stability and support to others.'
      };
    } else if (openness > 70 && extraversion < 40) {
      return {
        type: 'The Thinker',
        description: 'Introspective and creative. You prefer deep thinking and innovative problem-solving over social interaction.'
      };
    } else if (neuroticism < 30 && conscientiousness > 60) {
      return {
        type: 'The Steady Performer',
        description: 'Calm, reliable, and consistent. You handle stress well and deliver steady results in any environment.'
      };
    } else {
      return {
        type: 'The Balanced',
        description: 'You show a balanced mix of traits, adapting well to different situations and challenges.'
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/test')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mr-4"
          >
            Take Assessment
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

  const personalityType = getPersonalityType(results);
  
  const chartData = [
    { trait: 'Openness', value: results.openness || 0 },
    { trait: 'Conscientiousness', value: results.conscientiousness || 0 },
    { trait: 'Extraversion', value: results.extraversion || 0 },
    { trait: 'Agreeableness', value: results.agreeableness || 0 },
    { trait: 'Neuroticism', value: results.neuroticism || 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Personality Results</h1>
          <p className="text-gray-600">Based on the IPIP-NEO personality assessment</p>
        </div>

        {/* Personality Type */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">
            {personalityType.type}
          </h2>
          <p className="text-gray-700 text-center text-lg">
            {personalityType.description}
          </p>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Personality Profile</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="trait" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Trait Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trait" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Detailed Scores</h3>
          <div className="grid md:grid-cols-5 gap-4">
            {chartData.map((item) => (
              <div key={item.trait} className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{item.value}%</div>
                <div className="text-sm text-gray-600">{item.trait}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
              <PDFExportSimple results={results} personalityType={personalityType} />
          </div>
          <div>
            <button 
              onClick={() => {
                // Pulisci tutti i dati dell'assessment prima di riavviare
                localStorage.removeItem('ipip_answers');
                localStorage.removeItem('ipip_questions');
                localStorage.removeItem('ipip_results');
                localStorage.removeItem('ipip_currentQuestion');
                sessionStorage.removeItem('ipip_neo_results');
                navigate('/test');
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 mr-4"
            >
              Retake Assessment
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPageFixed;

