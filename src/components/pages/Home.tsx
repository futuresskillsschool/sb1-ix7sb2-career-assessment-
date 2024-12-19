import React from 'react';
import { 
  Target, 
  Brain, 
  Compass, 
  Briefcase, 
  Lightbulb, 
  Heart, 
  Microscope,
  GraduationCap 
} from 'lucide-react';
import { AssessmentCard } from '../ui/AssessmentCard';

const assessments = [
  {
    id: 'career',
    title: 'Career Path Assessment',
    description: 'Discover your ideal career path through our comprehensive assessment that analyzes your personality, skills, and preferences.',
    icon: Target,
    color: 'blue' as const,
    link: '/assessment'
  },
  {
    id: 'scct',
    title: 'SCCT Assessment',
    description: 'Evaluate your career choices based on Social Cognitive Career Theory, exploring self-efficacy, outcome expectations, and personal goals.',
    icon: Brain,
    color: 'purple' as const,
    link: '/scct'
  },
  {
    id: 'personality',
    title: 'Personality Assessment',
    description: 'Gain deep insights into your personality traits and understand how they influence your work style and career choices.',
    icon: Heart,
    color: 'green' as const,
    link: '/personality'
  },
  {
    id: 'riasec',
    title: 'RIASEC Model',
    description: "Discover your career interests using Holland's RIASEC model to find occupations that match your personality type.",
    icon: Compass,
    color: 'orange' as const,
    link: '/riasec'
  },
  {
    id: 'values',
    title: 'Values Assessment',
    description: 'Identify your core work values and find career paths that align with your personal and professional principles.',
    icon: Lightbulb,
    color: 'blue' as const,
    link: '/coming-soon'
  },
  {
    id: 'skills',
    title: 'Skills Assessment',
    description: 'Evaluate your technical and soft skills to identify strengths and areas for professional development.',
    icon: Briefcase,
    color: 'purple' as const,
    link: '/coming-soon'
  },
  {
    id: 'aptitude',
    title: 'Aptitude Test',
    description: 'Measure your natural abilities and potential for success in different career fields.',
    icon: GraduationCap,
    color: 'green' as const,
    link: '/coming-soon'
  },
  {
    id: 'mmpi',
    title: 'MMPI Assessment',
    description: 'Comprehensive personality assessment using the Minnesota Multiphasic Personality Inventory methodology.',
    icon: Microscope,
    color: 'orange' as const,
    link: '/coming-soon'
  }
];

export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Professional Assessments
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take our scientifically validated assessments to gain valuable insights into your personality, skills, values, and career potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.map((assessment) => (
          <AssessmentCard key={assessment.id} {...assessment} />
        ))}
      </div>
    </div>
  );
}