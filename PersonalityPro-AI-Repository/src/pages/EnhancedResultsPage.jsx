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
import AIResultsEnhancer from '../components/AIResultsEnhancer';
import PDFExportSimple from '../components/PDFExportSimple';
import { getModeInfo } from '../data/ipip-questions-subset';

function EnhancedResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessmentMode, setAssessmentMode] = useState('complete');

  useEffect(() => {
    const loadResults = async () => {
      try {
        let calculatedResults = null;
        let mode = localStorage.getItem('assessment_mode') || 'complete';
        setAssessmentMode(mode);
        
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
            calculatedResults = parsedData.traits || parsedData;
            console.log('Results loaded from storage:', calculatedResults);
          }
        }
        
        // Metodo 4: Se non ci sono risultati, prova a ricalcolare
        if (!calculatedResults) {
          console.log('No results found, trying to recalculate...');
          const answers = JSON.parse(localStorage.getItem('ipip_answers') || '{}');
          const questionsData = localStorage.getItem('ipip_questions');
          
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
    console.log('=== CALCULATING RESULTS ===');
    console.log('Answers:', answers);
    console.log('Questions count:', questions?.length);
    
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

    // Processa ogni risposta
    Object.values(answers).forEach(answer => {
      const traitName = traitMapping[answer.trait];
      if (traitName && traits[traitName]) {
        let score = answer.value;
        
        // Applica reverse-scoring per item negativi
        if (answer.keyed_direction === '-') {
          score = 6 - answer.value;
        }
        
        traits[traitName].total += score;
        traits[traitName].count += 1;
        
        console.log(`${traitName}: ${answer.text} (${answer.trait}${answer.keyed_direction}) = ${answer.value} -> ${score}`);
      }
    });

    // Calcola percentili
    const finalResults = {};
    Object.keys(traits).forEach(trait => {
      if (traits[trait].count > 0) {
        const average = traits[trait].total / traits[trait].count;
        const percentile = Math.round(((average - 1) / 4) * 100);
        finalResults[trait] = Math.max(0, Math.min(100, percentile));
        
        console.log(`${trait}: avg=${average.toFixed(2)}, percentile=${percentile}%`);
      } else {
        finalResults[trait] = 50; // Default se nessuna risposta
      }
    });

    // Salva risultati
    localStorage.setItem('ipip_results', JSON.stringify(finalResults));
    sessionStorage.setItem('ipip_neo_results', JSON.stringify({ traits: finalResults }));
    
    console.log('Final results:', finalResults);
    return finalResults;
  };

  const getPersonalityType = (traits) => {
    const { neuroticism, extraversion, openness, agreeableness, conscientiousness } = traits;
    
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

  const handleRetakeAssessment = () => {
    // Pulisci tutti i dati
    localStorage.removeItem('ipip_answers');
    localStorage.removeItem('ipip_questions');
    localStorage.removeItem('ipip_results');
    localStorage.removeItem('assessment_mode');
    sessionStorage.removeItem('ipip_neo_results');
    
    // Naviga alla selezione modalità
    navigate('/assessment-mode');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your personality profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleRetakeAssessment}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const personalityType = getPersonalityType(results);
  const modeInfo = getModeInfo(assessmentMode);

  // Prepara dati per i grafici
  const radarData = [
    { trait: 'Openness', value: results.openness, fullMark: 100 },
    { trait: 'Conscientiousness', value: results.conscientiousness, fullMark: 100 },
    { trait: 'Extraversion', value: results.extraversion, fullMark: 100 },
    { trait: 'Agreeableness', value: results.agreeableness, fullMark: 100 },
    { trait: 'Neuroticism', value: results.neuroticism, fullMark: 100 }
  ];

  const barData = [
    { name: 'Openness', value: results.openness, color: '#3B82F6' },
    { name: 'Conscientiousness', value: results.conscientiousness, color: '#10B981' },
    { name: 'Extraversion', value: results.extraversion, color: '#F59E0B' },
    { name: 'Agreeableness', value: results.agreeableness, color: '#EF4444' },
    { name: 'Neuroticism', value: results.neuroticism, color: '#8B5CF6' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Personality Assessment Results</h1>
          <p className="text-gray-600">
            {modeInfo.name} • {modeInfo.itemCount} questions • {modeInfo.duration}
          </p>
        </div>

        {/* AI Enhanced Results */}
        <AIResultsEnhancer results={results} mode={assessmentMode} />

        {/* Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Radar Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personality Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="trait" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Your Profile"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trait Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <PDFExportSimple results={results} personalityType={personalityType} />
          <button
            onClick={handleRetakeAssessment}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retake Assessment
          </button>
          <button
            onClick={handleReturnHome}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnhancedResultsPage;

