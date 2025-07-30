import React from 'react';
import { Download } from 'lucide-react';

const PDFExportFixed = ({ results, personalityType }) => {
  const generatePDF = async () => {
    try {
      // Importa jsPDF dinamicamente
      const { jsPDF } = await import('jspdf');
      
      // Crea una nuova istanza PDF
      const doc = new jsPDF();
      
      // Configurazione colori e font
      const primaryColor = [102, 126, 234]; // #667eea
      const secondaryColor = [118, 75, 162]; // #764ba2
      const textColor = [51, 51, 51]; // #333
      const lightGray = [102, 102, 102]; // #666
      
      // Header con gradient simulato
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Titolo principale
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PersonalityPro', 105, 20, { align: 'center' });
      
      // Sottotitolo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Scientific Personality Assessment Report', 105, 30, { align: 'center' });
      
      // Data
      doc.setTextColor(...lightGray);
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });
      
      // Reset colore testo
      doc.setTextColor(...textColor);
      
      // Tipo di personalità
      let yPosition = 60;
      doc.setFillColor(240, 240, 255);
      doc.rect(20, yPosition - 5, 170, 25, 'F');
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text(personalityType?.name || 'The Balanced', 105, yPosition + 5, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      const description = personalityType?.description || 'You show a balanced mix of traits, adapting well to different situations and challenges.';
      const descriptionLines = doc.splitTextToSize(description, 160);
      doc.text(descriptionLines, 105, yPosition + 15, { align: 'center' });
      
      // Sezione punteggi Big Five
      yPosition += 45;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Big Five Personality Traits', 20, yPosition);
      
      yPosition += 15;
      
      // Disegna i punteggi per ogni tratto
      const traits = Object.entries(results || {});
      traits.forEach(([trait, score], index) => {
        const traitName = trait.charAt(0).toUpperCase() + trait.slice(1);
        
        // Nome del tratto
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...textColor);
        doc.text(traitName, 20, yPosition);
        
        // Percentuale
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text(`${score}%`, 170, yPosition);
        
        // Barra del progresso
        const barWidth = 120;
        const barHeight = 6;
        const barX = 45;
        const barY = yPosition - 3;
        
        // Background della barra
        doc.setFillColor(240, 240, 240);
        doc.rect(barX, barY, barWidth, barHeight, 'F');
        
        // Riempimento della barra
        const fillWidth = (barWidth * score) / 100;
        doc.setFillColor(...primaryColor);
        doc.rect(barX, barY, fillWidth, barHeight, 'F');
        
        yPosition += 20;
      });
      
      // Sezione Insights
      yPosition += 10;
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Key Insights', 20, yPosition);
      
      yPosition += 15;
      
      // Strengths
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textColor);
      doc.text('🎯 Strengths', 20, yPosition);
      
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const strengthsText = getStrengths(results);
      const strengthsLines = doc.splitTextToSize(strengthsText, 170);
      doc.text(strengthsLines, 20, yPosition);
      yPosition += strengthsLines.length * 5 + 10;
      
      // Growth Areas
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('📈 Growth Areas', 20, yPosition);
      
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const growthText = getGrowthAreas(results);
      const growthLines = doc.splitTextToSize(growthText, 170);
      doc.text(growthLines, 20, yPosition);
      yPosition += growthLines.length * 5 + 10;
      
      // Career Insights
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('💼 Career Insights', 20, yPosition);
      
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const careerText = getCareerInsights(results);
      const careerLines = doc.splitTextToSize(careerText, 170);
      doc.text(careerLines, 20, yPosition);
      yPosition += careerLines.length * 5 + 10;
      
      // Relationship Style
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('🤝 Relationship Style', 20, yPosition);
      
      yPosition += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const relationshipText = getRelationshipInsights(results);
      const relationshipLines = doc.splitTextToSize(relationshipText, 170);
      doc.text(relationshipLines, 20, yPosition);
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...lightGray);
        doc.text('PersonalityPro - Scientific Personality Assessment', 105, 285, { align: 'center' });
        doc.text('Based on the International Personality Item Pool (IPIP-NEO)', 105, 290, { align: 'center' });
      }
      
      // Salva il PDF
      const fileName = `personality-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Errore nella generazione del PDF:', error);
      alert('Errore nella generazione del PDF. Riprova più tardi.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      <Download size={20} />
      Download PDF Report
    </button>
  );
};

// Funzioni helper per generare insights personalizzati
function getStrengths(results) {
  const strengths = [];
  
  if (results?.openness >= 70) strengths.push("highly creative and open to new experiences");
  if (results?.conscientiousness >= 70) strengths.push("well-organized and reliable");
  if (results?.extraversion >= 70) strengths.push("socially confident and energetic");
  if (results?.agreeableness >= 70) strengths.push("cooperative and empathetic");
  if (results?.neuroticism <= 30) strengths.push("emotionally stable and resilient");
  
  if (strengths.length === 0) {
    return "You demonstrate a balanced approach across personality dimensions, showing adaptability in various situations.";
  }
  
  return `You are ${strengths.join(", ")}. These qualities make you well-suited for collaborative environments and leadership roles.`;
}

function getGrowthAreas(results) {
  const growthAreas = [];
  
  if (results?.openness <= 30) growthAreas.push("exploring new ideas and experiences");
  if (results?.conscientiousness <= 30) growthAreas.push("developing better organization and planning skills");
  if (results?.extraversion <= 30) growthAreas.push("building confidence in social situations");
  if (results?.agreeableness <= 30) growthAreas.push("practicing empathy and cooperation");
  if (results?.neuroticism >= 70) growthAreas.push("developing stress management techniques");
  
  if (growthAreas.length === 0) {
    return "Your personality profile shows good balance across all dimensions. Continue developing your existing strengths.";
  }
  
  return `Consider focusing on ${growthAreas.join(", ")} to enhance your personal and professional development.`;
}

function getCareerInsights(results) {
  const high = Object.entries(results || {}).filter(([_, score]) => score >= 70).map(([trait]) => trait);
  const low = Object.entries(results || {}).filter(([_, score]) => score <= 30).map(([trait]) => trait);
  
  let insights = "Based on your personality profile, you may thrive in careers that ";
  
  if (high.includes('openness')) insights += "involve creativity and innovation, ";
  if (high.includes('conscientiousness')) insights += "require attention to detail and organization, ";
  if (high.includes('extraversion')) insights += "involve frequent social interaction, ";
  if (high.includes('agreeableness')) insights += "focus on helping others and teamwork, ";
  if (low.includes('neuroticism')) insights += "involve high-pressure situations, ";
  
  insights += "align with your natural strengths and preferences.";
  
  return insights;
}

function getRelationshipInsights(results) {
  let insights = "In relationships, you tend to be ";
  
  if (results?.extraversion >= 70) insights += "outgoing and socially active, ";
  else if (results?.extraversion <= 30) insights += "more reserved and prefer intimate settings, ";
  
  if (results?.agreeableness >= 70) insights += "cooperative and supportive, ";
  else if (results?.agreeableness <= 30) insights += "direct and independent, ";
  
  if (results?.neuroticism <= 30) insights += "emotionally stable and reassuring to others.";
  else if (results?.neuroticism >= 70) insights += "sensitive and may need emotional support.";
  
  return insights;
}

export default PDFExportFixed;

