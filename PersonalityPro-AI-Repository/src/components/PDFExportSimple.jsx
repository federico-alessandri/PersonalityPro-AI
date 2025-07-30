import React from 'react';
import { Download } from 'lucide-react';

const PDFExportSimple = ({ results, personalityType }) => {
  const generatePDF = () => {
    // Crea il contenuto HTML strutturato per la stampa PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Personality Assessment Report</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
          }
          
          .header h1 {
            font-size: 2.5em;
            margin: 0;
            font-weight: 700;
          }
          
          .header p {
            font-size: 1.1em;
            margin: 10px 0 0 0;
            opacity: 0.9;
          }
          
          .personality-type {
            background: #f8f9ff;
            border: 2px solid #667eea;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
          }
          
          .personality-type h2 {
            color: #667eea;
            font-size: 2em;
            margin: 0 0 10px 0;
            font-weight: 600;
          }
          
          .personality-type p {
            font-size: 1.1em;
            margin: 0;
            color: #555;
          }
          
          .scores-section {
            margin: 40px 0;
          }
          
          .scores-section h3 {
            color: #667eea;
            font-size: 1.8em;
            margin-bottom: 25px;
            font-weight: 600;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          
          .trait-score {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin: 10px 0;
            background: #f9f9f9;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          
          .trait-name {
            font-weight: 600;
            font-size: 1.1em;
            color: #333;
            flex: 1;
          }
          
          .trait-bar-container {
            flex: 2;
            margin: 0 20px;
          }
          
          .trait-bar {
            width: 100%;
            height: 12px;
            background: #e0e0e0;
            border-radius: 6px;
            position: relative;
            overflow: hidden;
          }
          
          .trait-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 6px;
            transition: width 0.3s ease;
          }
          
          .trait-percentage {
            font-size: 1.2em;
            font-weight: 700;
            color: #667eea;
            min-width: 50px;
            text-align: right;
          }
          
          .insights-section {
            margin: 40px 0;
          }
          
          .insights-section h3 {
            color: #667eea;
            font-size: 1.8em;
            margin-bottom: 20px;
            font-weight: 600;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
          }
          
          .insight-item {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9ff;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          
          .insight-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            font-size: 1.1em;
          }
          
          .insight-text {
            color: #555;
            line-height: 1.7;
          }
          
          .footer {
            margin-top: 50px;
            padding: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            background: #f9f9f9;
            border-radius: 8px;
          }
          
          .date {
            color: #999;
            font-size: 0.9em;
            margin-top: 10px;
          }
          
          .print-button {
            background: #667eea;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            margin: 20px auto;
            display: block;
          }
          
          .print-button:hover {
            background: #5a6fd8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PersonalityPro</h1>
          <p>Scientific Personality Assessment Report</p>
          <p class="date">Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="personality-type">
          <h2>${personalityType?.name || 'The Balanced'}</h2>
          <p>${personalityType?.description || 'You show a balanced mix of traits, adapting well to different situations and challenges.'}</p>
        </div>

        <div class="scores-section">
          <h3>Big Five Personality Traits</h3>
          ${Object.entries(results || {}).map(([trait, score]) => `
            <div class="trait-score">
              <div class="trait-name">${trait.charAt(0).toUpperCase() + trait.slice(1)}</div>
              <div class="trait-bar-container">
                <div class="trait-bar">
                  <div class="trait-fill" style="width: ${score}%"></div>
                </div>
              </div>
              <div class="trait-percentage">${score}%</div>
            </div>
          `).join('')}
        </div>

        <div class="insights-section">
          <h3>Key Insights</h3>
          
          <div class="insight-item">
            <div class="insight-title">🎯 Strengths</div>
            <div class="insight-text">
              ${getStrengths(results)}
            </div>
          </div>

          <div class="insight-item">
            <div class="insight-title">📈 Growth Areas</div>
            <div class="insight-text">
              ${getGrowthAreas(results)}
            </div>
          </div>

          <div class="insight-item">
            <div class="insight-title">💼 Career Insights</div>
            <div class="insight-text">
              ${getCareerInsights(results)}
            </div>
          </div>

          <div class="insight-item">
            <div class="insight-title">🤝 Relationship Style</div>
            <div class="insight-text">
              ${getRelationshipInsights(results)}
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>PersonalityPro</strong> - Scientific Personality Assessment</p>
          <p>Based on the International Personality Item Pool (IPIP-NEO) with 120 validated questions</p>
          <p>This report provides insights into your personality traits and should be used for self-development purposes.</p>
        </div>
        
        <div class="no-print">
          <button class="print-button" onclick="window.print()">Print as PDF</button>
          <p style="text-align: center; color: #666; margin-top: 10px;">
            Use your browser's print function and select "Save as PDF" to download this report.
          </p>
        </div>

        <script>
          // Auto-focus per la stampa
          setTimeout(() => {
            window.print();
          }, 1000);
        </script>
      </body>
      </html>
    `;

    // Apri il contenuto in una nuova finestra per la stampa
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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

export default PDFExportSimple;

