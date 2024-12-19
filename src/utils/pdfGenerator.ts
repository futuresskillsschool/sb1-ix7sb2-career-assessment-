import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AssessmentResult } from '../types/results';

const questionMappings = {
  'p65': {
    title: 'Personality Traits',
    description: 'These traits reflect how you see yourself and interact with the world around you.',
  },
  'p66': {
    title: 'Challenge Handling Approach',
    description: 'Your preferred methods for tackling challenges and solving problems.',
  },
  'p67': {
    title: 'Leisure Activities',
    description: 'Activities you enjoy during your free time, indicating your interests and potential areas for skill development.',
  },
  'pref11': {
    title: 'Career Interests',
    description: 'Professional fields that align with your interests and aspirations.',
  },
  's13': {
    title: 'Confident Skills',
    description: 'Areas where you feel most competent and capable.',
  },
};

export async function generateResultsPDF(
  result: AssessmentResult | null, 
  userData?: any,
  multiSelectAnswers?: Record<string, string[]>
): Promise<void> {
  if (!result) return;

  try {
    const pdf = new jsPDF();
    let yOffset = 20;

    // Add header
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Career Assessment Results', 20, yOffset);
    yOffset += 20;

    // Add user info if available
    if (userData) {
      pdf.setFontSize(12);
      pdf.text(`Name: ${userData.name}`, 20, yOffset);
      yOffset += 10;
      pdf.text(`Email: ${userData.email}`, 20, yOffset);
      yOffset += 20;
    }

    // Add multi-select answers if available
    if (multiSelectAnswers) {
      pdf.setFontSize(16);
      pdf.text('Your Detailed Responses', 20, yOffset);
      yOffset += 10;

      Object.entries(multiSelectAnswers).forEach(([questionId, answers]) => {
        const mapping = questionMappings[questionId];
        if (!mapping || !answers.length) return;

        if (yOffset > 270) {
          pdf.addPage();
          yOffset = 20;
        }

        pdf.setFontSize(14);
        pdf.text(mapping.title, 20, yOffset);
        yOffset += 7;

        pdf.setFontSize(12);
        pdf.setTextColor(100, 100, 100);
        const descLines = pdf.splitTextToSize(mapping.description, 170);
        descLines.forEach(line => {
          if (yOffset > 270) {
            pdf.addPage();
            yOffset = 20;
          }
          pdf.text(line, 20, yOffset);
          yOffset += 7;
        });

        answers.forEach(answer => {
          if (yOffset > 270) {
            pdf.addPage();
            yOffset = 20;
          }
          pdf.text(`• ${answer}`, 25, yOffset);
          yOffset += 7;
        });

        yOffset += 5;
      });

      yOffset += 10;
    }

    // Add personality traits
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Personality Profile', 20, yOffset);
    yOffset += 10;

    result.psychometric.personalityTraits.forEach(trait => {
      yOffset = addTraitSection(pdf, trait, yOffset);
    });

    // Add learning style
    yOffset += 10;
    pdf.setFontSize(16);
    pdf.text('Learning Style', 20, yOffset);
    yOffset += 10;

    result.psychometric.learningStyle.forEach(style => {
      yOffset = addTraitSection(pdf, style, yOffset);
    });

    // Add skills assessment
    yOffset += 10;
    pdf.setFontSize(16);
    pdf.text('Skills Assessment', 20, yOffset);
    yOffset += 10;

    yOffset = addTraitSection(pdf, result.skills.technical, yOffset);
    yOffset = addTraitSection(pdf, result.skills.analytical, yOffset);
    result.skills.soft.forEach(skill => {
      yOffset = addTraitSection(pdf, skill, yOffset);
    });

    // Add recommendations
    yOffset += 10;
    pdf.setFontSize(16);
    pdf.text('Recommendations', 20, yOffset);
    yOffset += 10;

    result.overallRecommendations.forEach(rec => {
      const lines = pdf.splitTextToSize(rec, 170);
      lines.forEach(line => {
        if (yOffset > 270) {
          pdf.addPage();
          yOffset = 20;
        }
        pdf.setFontSize(12);
        pdf.text('• ' + line, 20, yOffset);
        yOffset += 10;
      });
    });

    // Save the PDF
    pdf.save('Career-Assessment-Results.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

function addTraitSection(pdf: jsPDF, trait: any, yOffset: number): number {
  if (yOffset > 270) {
    pdf.addPage();
    yOffset = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(trait.trait, 20, yOffset);
  yOffset += 7;

  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  const descriptionLines = pdf.splitTextToSize(trait.description, 170);
  descriptionLines.forEach(line => {
    if (yOffset > 270) {
      pdf.addPage();
      yOffset = 20;
    }
    pdf.text(line, 20, yOffset);
    yOffset += 7;
  });

  if (trait.recommendations) {
    yOffset += 3;
    trait.recommendations.forEach(rec => {
      if (yOffset > 270) {
        pdf.addPage();
        yOffset = 20;
      }
      const lines = pdf.splitTextToSize('• ' + rec, 160);
      lines.forEach(line => {
        pdf.text(line, 30, yOffset);
        yOffset += 7;
      });
    });
  }

  yOffset += 5;
  return yOffset;
}