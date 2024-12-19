import { AssessmentResult } from '../types/results';

interface StoredResults {
  result: AssessmentResult;
  userData: any;
  answers: any[];
  completedAt: number;
}

export function saveResults(data: StoredResults): void {
  try {
    sessionStorage.setItem('assessmentResults', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving results:', error);
    throw new Error('Failed to save assessment results');
  }
}

export function loadResults(): StoredResults | null {
  try {
    const stored = sessionStorage.getItem('assessmentResults');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading results:', error);
    throw new Error('Failed to load assessment results');
  }
}

export function clearResults(): void {
  try {
    sessionStorage.removeItem('assessmentResults');
  } catch (error) {
    console.error('Error clearing results:', error);
  }
}