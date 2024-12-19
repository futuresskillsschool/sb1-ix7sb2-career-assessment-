import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AssessmentResult } from '../types/results';
import { generateResultsPDF } from '../utils/pdfGenerator';
import { generateCareerRecommendations } from '../utils/careerMapping';
import { loadResults } from '../services/resultsService';
import { ResultsHeader } from './results/ResultsHeader';
import { ResultsContent } from './results/ResultsContent';
import { ResultsLoading } from './results/ResultsLoading';

export function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [userData, setUserData] = useState(null);
  const [multiSelectAnswers, setMultiSelectAnswers] = useState<Record<string, string[]>>({});

  useEffect(() => {
    try {
      const storedData = loadResults();
      if (!storedData) {
        navigate('/');
        return;
      }

      const { result, userData, answers } = storedData;
      setResult(result);
      setUserData(userData);
      
      // Extract multi-select answers
      const multiSelectQuestions = ['p65', 'p66', 'p67', 'pref11', 'pref12', 'pref13'];
      const multiSelectResults = answers.reduce((acc, answer) => {
        if (multiSelectQuestions.includes(answer.questionId) && Array.isArray(answer.value)) {
          acc[answer.questionId] = answer.value;
        }
        return acc;
      }, {});
      
      setMultiSelectAnswers(multiSelectResults);
      
      const recommendations = generateCareerRecommendations(
        result,
        userData?.preferredSkills
      );
      setCareerRecommendations(recommendations);
    } catch (error) {
      console.error('Error loading results:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleDownloadPDF = async () => {
    if (result) {
      await generateResultsPDF(result, userData, multiSelectAnswers);
    }
  };

  if (!result) {
    return <ResultsLoading />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ResultsHeader onDownload={handleDownloadPDF} />
      <ResultsContent
        result={result}
        careerRecommendations={careerRecommendations}
        multiSelectAnswers={multiSelectAnswers}
      />
    </div>
  );
}