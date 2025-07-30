import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizPageComplete = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funzione per resettare l'assessment
  const clearAssessmentData = () => {
    localStorage.removeItem('ipip_answers');
    localStorage.removeItem('ipip_questions');
    localStorage.removeItem('ipip_results');
    localStorage.removeItem('ipip_currentQuestion');
    setAnswers({});
    setCurrentQuestion(0);
  };

  // Reset automatico all'avvio del quiz
  useEffect(() => {
    // Pulisci sempre i dati quando si accede al quiz
    clearAssessmentData();
  }, []);

  // Carica domande all'avvio
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions');
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Salva risposte quando cambiano
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('ipip_answers', JSON.stringify(answers));
      localStorage.setItem('ipip_questions', JSON.stringify(questions));
    }
  }, [answers, questions]);

  const handleAnswer = (value) => {
    const questionData = questions[currentQuestion];
    const newAnswers = {
      ...answers,
      [currentQuestion]: {
        questionId: currentQuestion + 1,
        text: questionData.text,
        trait: questionData.trait,
        keyed_direction: questionData.keyed_direction,
        value: parseInt(value),
        timestamp: new Date().toISOString()
      }
    };
    setAnswers(newAnswers);
    
    console.log(`Question ${currentQuestion + 1}: ${questionData.text}`);
    console.log(`Answer: ${value}, Trait: ${questionData.trait}, Direction: ${questionData.keyed_direction}`);
  };

  const goToQuestion = (questionIndex) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setCurrentQuestion(questionIndex);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    console.log('Calculating results with answers:', answers);
    
    // Inizializza contatori per ogni tratto
    const traits = {
      neuroticism: { total: 0, count: 0 },
      extraversion: { total: 0, count: 0 },
      openness: { total: 0, count: 0 },
      agreeableness: { total: 0, count: 0 },
      conscientiousness: { total: 0, count: 0 }
    };

    // Mapping dei tratti dalle lettere ai nomi completi
    const traitMapping = {
      'N': 'neuroticism',
      'E': 'extraversion',
      'O': 'openness',
      'A': 'agreeableness',
      'C': 'conscientiousness'
    };

    // Calcola punteggi per ogni risposta
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
        
        console.log(`${traitName}: +${score} (original: ${answer.value}, direction: ${answer.keyed_direction})`);
      }
    });

    // Calcola percentili (0-100%)
    const results = {};
    Object.keys(traits).forEach(trait => {
      if (traits[trait].count > 0) {
        const average = traits[trait].total / traits[trait].count;
        const percentile = Math.round(((average - 1) / 4) * 100);
        results[trait] = Math.max(0, Math.min(100, percentile));
        
        console.log(`${trait}: avg=${average.toFixed(2)}, percentile=${results[trait]}%`);
      } else {
        results[trait] = 50; // Default se nessuna risposta
      }
    });

    // Determina tipo di personalità basato sui punteggi
    const personalityType = determinePersonalityType(results);
    
    const finalResults = {
      traits: results,
      personalityType: personalityType,
      timestamp: new Date().toISOString(),
      totalQuestions: Object.keys(answers).length
    };

    console.log('Final results:', finalResults);
    return finalResults;
  };

  const determinePersonalityType = (traits) => {
    // Logica semplificata per determinare il tipo di personalità
    const { neuroticism, extraversion, openness, agreeableness, conscientiousness } = traits;
    
    if (openness > 70 && conscientiousness > 60) {
      return {
        type: "The Innovator",
        description: "Creative, organized, and forward-thinking. You combine imagination with practical execution."
      };
    } else if (extraversion > 70 && agreeableness > 70) {
      return {
        type: "The Collaborator", 
        description: "Outgoing, cooperative, and team-oriented. You thrive in social environments."
      };
    } else if (conscientiousness > 70 && neuroticism < 40) {
      return {
        type: "The Achiever",
        description: "Disciplined, reliable, and goal-oriented. You excel at completing tasks and meeting objectives."
      };
    } else if (openness > 70 && neuroticism < 40) {
      return {
        type: "The Explorer",
        description: "Curious, adventurous, and open to new experiences. You seek knowledge and novel experiences."
      };
    } else if (agreeableness > 70 && conscientiousness > 60) {
      return {
        type: "The Helper",
        description: "Compassionate, reliable, and service-oriented. You focus on supporting others."
      };
    } else {
      return {
        type: "The Balanced",
        description: "Well-rounded with moderate traits across all dimensions. You adapt well to various situations."
      };
    }
  };

  const completeAssessment = () => {
    const results = calculateResults();
    localStorage.setItem('ipip_results', JSON.stringify(results));
    navigate('/results');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading IPIP-NEO questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">No questions available</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = Object.keys(answers).length;
  const isComplete = progress >= 5; // Minimo 5 risposte per completare

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IPIP-NEO Personality Assessment</h1>
          <p className="text-gray-600">Complete scientific personality test with 120 questions</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{progress} / 120</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(progress / 120) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg p-8 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
            <span className="text-sm text-gray-500">{currentQ.trait} - {currentQ.facet}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.text}</h2>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">Strongly Disagree</span>
            <span className="text-sm text-gray-500">Strongly Agree</span>
          </div>
          
          {/* Answer Options */}
          <div className="flex justify-center space-x-4 mb-8">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="flex flex-col items-center cursor-pointer">
                <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-semibold text-white transition-all ${
                  value === 1 ? 'bg-red-500 border-red-500' :
                  value === 2 ? 'bg-orange-500 border-orange-500' :
                  value === 3 ? 'bg-yellow-500 border-yellow-500' :
                  value === 4 ? 'bg-blue-500 border-blue-500' :
                  'bg-green-500 border-green-500'
                } ${answers[currentQuestion]?.value === value ? 'ring-4 ring-offset-2 ring-blue-300' : 'hover:scale-105'}`}>
                  {value}
                </div>
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={value}
                  checked={answers[currentQuestion]?.value === value}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-500">{currentQuestion + 1} of 120</span>
            
            {currentQuestion === questions.length - 1 ? (
              isComplete ? (
                <button
                  onClick={completeAssessment}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  Complete Assessment
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Answer more questions
                </button>
              )
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
          
          {/* Complete Assessment Button (se abbastanza risposte) */}
          {isComplete && currentQuestion < questions.length - 1 && (
            <div className="mt-4 text-center">
              <button
                onClick={completeAssessment}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Complete Assessment ({progress} answers)
              </button>
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 rounded text-sm font-medium transition-all ${
                  answers[index] 
                    ? 'bg-green-500 text-white' 
                    : index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPageComplete;

