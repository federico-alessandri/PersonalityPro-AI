import React from 'react';
import { useNavigate } from 'react-router-dom';
import AIGuide from '../components/AIGuide';

const AssessmentModePage = () => {
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    // Salva la modalità selezionata nel localStorage
    localStorage.setItem('assessment_mode', mode);
    
    // Pulisci eventuali dati precedenti
    localStorage.removeItem('ipip_answers');
    localStorage.removeItem('ipip_questions');
    localStorage.removeItem('ipip_results');
    sessionStorage.removeItem('ipip_neo_results');
    
    // Naviga al quiz con la modalità selezionata
    navigate(`/test?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <AIGuide 
          mode={null} 
          onModeSelect={handleModeSelect}
        />
      </div>
    </div>
  );
};

export default AssessmentModePage;

