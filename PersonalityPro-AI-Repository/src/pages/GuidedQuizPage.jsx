import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AIGuide from '../components/AIGuide';
import { getQuestionSubset, getModeInfo } from '../data/ipip-questions-subset';

const GuidedQuizPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || localStorage.getItem('assessment_mode') || 'complete';
  
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
    sessionStorage.removeItem('ipip_neo_results');
    setAnswers({});
    setCurrentQuestion(0);
  };

  // Reset automatico all'avvio del quiz
  useEffect(() => {
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
        const allQuestions = await response.json();
        
        // Seleziona subset basato sulla modalità
        const selectedQuestions = getQuestionSubset(mode, allQuestions);
        setQuestions(selectedQuestions);
        
        // Salva modalità e domande
        localStorage.setItem('assessment_mode', mode);
        localStorage.setItem('ipip_questions', JSON.stringify(selectedQuestions));
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions');
        setLoading(false);
      }
    };

    loadQuestions();
  }, [mode]);

  // Salva risposte quando cambiano
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('ipip_answers', JSON.stringify(answers));
      localStorage.setItem('ipip_currentQuestion', currentQuestion.toString());
    }
  }, [answers, currentQuestion]);

  const handleAnswer = (value) => {
    const newAnswers = {
      ...answers,
      [currentQuestion]: {
        questionId: questions[currentQuestion].id,
        originalId: questions[currentQuestion].originalId || questions[currentQuestion].id,
        value: value,
        trait: questions[currentQuestion].trait,
        keyed_direction: questions[currentQuestion].keyed_direction,
        text: questions[currentQuestion].text
      }
    };
    setAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const completeAssessment = () => {
    // Salva i dati finali
    localStorage.setItem('ipip_answers', JSON.stringify(answers));
    localStorage.setItem('assessment_mode', mode);
    
    // Naviga ai risultati
    navigate('/results');
  };

  const isComplete = Object.keys(answers).length >= Math.min(5, questions.length);
  const progress = questions.length > 0 ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;
  const modeInfo = getModeInfo(mode);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header con info modalità */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {modeInfo.name}
          </h1>
          <p className="text-gray-600">
            {modeInfo.description} • {modeInfo.duration} • {modeInfo.itemCount} questions
          </p>
        </div>

        {/* AI Guide */}
        <AIGuide 
          mode={mode}
          step={Object.keys(answers).length}
          totalSteps={questions.length}
          currentQuestion={currentQ?.text}
        />

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {Object.keys(answers).length} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="text-center">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {currentQ.trait} - {currentQ.facet || 'Core'}
              </span>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {currentQ.text}
            </h2>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Strongly Disagree</span>
              <span className="text-sm text-gray-500">Strongly Agree</span>
            </div>

            {/* Answer buttons */}
            <div className="flex justify-center space-x-4 mb-8">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-16 h-16 rounded-lg border-2 font-semibold text-lg transition-all ${
                    answers[currentQuestion]?.value === value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-lg font-medium ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              <span className="text-sm text-gray-500">
                {currentQuestion + 1} of {questions.length}
              </span>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={completeAssessment}
                  disabled={!answers[currentQuestion]}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    answers[currentQuestion]
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Complete Assessment
                </button>
              ) : (
                <button
                  onClick={goToNext}
                  disabled={!answers[currentQuestion]}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    answers[currentQuestion]
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Complete Assessment Button (if enough answers) */}
        {isComplete && currentQuestion < questions.length - 1 && (
          <div className="text-center mb-6">
            <button
              onClick={completeAssessment}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Complete Assessment ({Object.keys(answers).length} answers)
            </button>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[index]
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

export default GuidedQuizPage;

