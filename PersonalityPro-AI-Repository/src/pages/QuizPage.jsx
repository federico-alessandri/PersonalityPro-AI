import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('Loading IPIP-NEO 120 questions...');
        
        // Prima prova a caricare dall'API del backend
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/questions`);
          if (response.data && response.data.questions) {
            console.log('Successfully loaded', response.data.questions.length, 'questions from API');
            setQuestions(response.data.questions);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('API not available, loading from local file...');
        }
        
        // Fallback: carica dal file JSON locale
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questions file');
        }
        
        const questionsData = await response.json();
        console.log('Successfully loaded', questionsData.length, 'questions from local file');
        
        // Aggiungi ID sequenziali alle domande
        const questionsWithIds = questionsData.map((q, index) => ({
          ...q,
          id: index + 1
        }));
        
        setQuestions(questionsWithIds);
        setLoading(false);
        
      } catch (err) {
        console.error("Error loading questions:", err);
        setError("Failed to load questions. Please refresh the page.");
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting answers for', Object.keys(answers).length, 'questions');
      
      // Calcola i risultati localmente
      const results = calculateResults(answers, questions);
      
      // Salva i risultati in localStorage per persistenza maggiore
      const resultsData = {
        results: results,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).length,
        timestamp: new Date().toISOString(),
        answers: answers // Salva anche le risposte per debug
      };
      
      // Salva in entrambi localStorage e sessionStorage per massima compatibilità
      localStorage.setItem('ipip_neo_results', JSON.stringify(resultsData));
      sessionStorage.setItem('ipip_neo_results', JSON.stringify(resultsData));
      console.log('Results saved to localStorage and sessionStorage:', resultsData);
      
      // Naviga alla pagina dei risultati con i dati calcolati
      navigate('/results', { state: { results: calculatedResults } });
      
    } catch (err) {
      console.error("Error submitting assessment:", err);
      setError("Failed to submit assessment. Please try again.");
    }
  };

  const calculateResults = (answers, questions) => {
    console.log('=== STARTING CALCULATION (FIXED VERSION) ===');
    console.log('Answers received:', answers);
    console.log('Questions received:', questions.length);
    
    const traits = {
      'N': { name: 'Neuroticism', score: 0, count: 0, color: '#ef4444' },
      'E': { name: 'Extraversion', score: 0, count: 0, color: '#f59e0b' },
      'O': { name: 'Openness', score: 0, count: 0, color: '#10b981' },
      'A': { name: 'Agreeableness', score: 0, count: 0, color: '#3b82f6' },
      'C': { name: 'Conscientiousness', score: 0, count: 0, color: '#8b5cf6' }
    };

    // CORREZIONE: Calcola i punteggi per ogni tratto con logging dettagliato
    questions.forEach((question, index) => {
      const answer = answers[question.id];
      
      if (index < 5) { // Log solo le prime 5 per debug
        console.log(`Question ${question.id}: "${question.text}" (${question.trait}) - Answer: ${answer}`);
      }
      
      if (answer && traits[question.trait]) {
        let score = parseInt(answer);
        
        // CORREZIONE: Inverti il punteggio per domande con keyed_direction negativo
        if (question.keyed_direction === '-') {
          score = 6 - score;
          if (index < 5) console.log(`Reversed score for question ${question.id}: ${answer} → ${score}`);
        }
        
        traits[question.trait].score += score;
        traits[question.trait].count += 1;
        
        if (index < 5) { // Log solo le prime 5 per debug
          console.log(`Updated ${question.trait}: score=${traits[question.trait].score}, count=${traits[question.trait].count}`);
        }
      }
    });

    // CORREZIONE: Calcola medie e percentili con formula corretta
    Object.keys(traits).forEach(trait => {
      if (traits[trait].count > 0) {
        traits[trait].average = traits[trait].score / traits[trait].count;
        // CORREZIONE: Formula corretta per convertire scala 1-5 in percentile 0-100%
        traits[trait].percentile = Math.round(((traits[trait].average - 1) / 4) * 100);
        // Assicurati che sia nel range 0-100
        traits[trait].percentile = Math.min(100, Math.max(0, traits[trait].percentile));
        console.log(`${trait}: avg=${traits[trait].average.toFixed(2)}, percentile=${traits[trait].percentile}%`);
      } else {
        traits[trait].average = 2.5; // Valore neutro se nessuna risposta
        traits[trait].percentile = 50; // 50% se nessuna risposta
        console.log(`${trait}: No answers, defaulting to 50%`);
      }
    });

    console.log('=== CALCULATION COMPLETE (FIXED) ===');
    
    return {
      trait_scores: traits,
      total_questions: questions.length,
      answered_questions: Object.keys(answers).length
    };
  };

  const isComplete = Object.keys(answers).length >= 2; // Modificato per testing: permette completamento con almeno 2 risposte
  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading IPIP-NEO questions...</p>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No questions available'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IPIP-NEO Personality Assessment</h1>
          <p className="text-gray-600 mb-4">Complete scientific personality test with {questions.length} questions</p>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">{Object.keys(answers).length} / {questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Question {currentQuestion.question_number}</span>
                <span className="text-sm text-gray-500">
                  {currentQuestion.trait} - {currentQuestion.facet}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Rating Scale */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={value}
                      checked={answers[currentQuestion.id] === value}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-6 h-6 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="mt-2 text-sm text-gray-600">{value}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {questions.length}
              </span>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!isComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Assessment
                </button>
              ) : Object.keys(answers).length >= 5 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Complete Assessment
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 text-xs rounded ${
                    index === currentQuestionIndex
                      ? 'bg-indigo-600 text-white'
                      : answers[questions[index].id]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  } hover:bg-indigo-500 hover:text-white`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mt-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;

