import React from 'react';

interface ResultsOverviewProps {
  recommendations: string[];
}

export function ResultsOverview({ recommendations }: ResultsOverviewProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Overall Recommendations</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </section>
  );
}