// Subset di domande IPIP-NEO per diverse modalità di assessment
// Bilanciamento: item positivi e negativi per ogni tratto

export const getQuestionSubset = (mode, allQuestions) => {
  if (!allQuestions || allQuestions.length === 0) {
    return [];
  }

  // Organizza le domande per tratto
  const questionsByTrait = {
    N: allQuestions.filter(q => q.trait === 'N'),
    E: allQuestions.filter(q => q.trait === 'E'), 
    O: allQuestions.filter(q => q.trait === 'O'),
    A: allQuestions.filter(q => q.trait === 'A'),
    C: allQuestions.filter(q => q.trait === 'C')
  };

  const getBalancedItems = (items, count) => {
    if (!items || items.length === 0) return [];
    
    // Separa item positivi e negativi
    const positive = items.filter(q => q.keyed_direction === '+');
    const negative = items.filter(q => q.keyed_direction === '-');
    
    const positiveCount = Math.ceil(count / 2);
    const negativeCount = Math.floor(count / 2);
    
    // Seleziona item bilanciati
    const selectedPositive = positive.slice(0, positiveCount);
    const selectedNegative = negative.slice(0, negativeCount);
    
    return [...selectedPositive, ...selectedNegative];
  };

  let selectedQuestions = [];

  switch (mode) {
    case 'brief':
      // 20 item totali: 4 per tratto (2 positivi + 2 negativi)
      Object.keys(questionsByTrait).forEach(trait => {
        const traitQuestions = getBalancedItems(questionsByTrait[trait], 4);
        selectedQuestions.push(...traitQuestions);
      });
      break;
      
    case 'standard':
      // 60 item totali: 12 per tratto (6 positivi + 6 negativi)
      Object.keys(questionsByTrait).forEach(trait => {
        const traitQuestions = getBalancedItems(questionsByTrait[trait], 12);
        selectedQuestions.push(...traitQuestions);
      });
      break;
      
    case 'complete':
    default:
      // 120 item totali: tutte le domande (24 per tratto)
      selectedQuestions = allQuestions;
      break;
  }

  // Mescola le domande per evitare pattern prevedibili
  const shuffled = [...selectedQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Aggiungi indici progressivi
  return shuffled.map((question, index) => ({
    ...question,
    id: index + 1,
    originalId: question.id
  }));
};

export const getModeInfo = (mode) => {
  const modes = {
    brief: {
      name: "Brief Assessment",
      duration: "3 minutes",
      itemCount: 20,
      itemsPerTrait: 4,
      description: "Quick overview of your personality profile"
    },
    standard: {
      name: "Standard Assessment", 
      duration: "7 minutes",
      itemCount: 60,
      itemsPerTrait: 12,
      description: "Balanced depth and efficiency"
    },
    complete: {
      name: "Comprehensive Assessment",
      duration: "12-15 minutes", 
      itemCount: 120,
      itemsPerTrait: 24,
      description: "Full detailed analysis with maximum precision"
    }
  };
  
  return modes[mode] || modes.complete;
};

