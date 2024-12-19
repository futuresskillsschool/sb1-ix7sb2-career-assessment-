import { Answer } from '../types/assessment';
import { AssessmentResult, TraitScore } from '../types/results';

// Comprehensive trait categories with question mappings
const PERSONALITY_TRAITS = {
  OPENNESS: ['p1', 'p2', 'p13', 'p14', 'p15', 'p34', 'p65', 'p67'],
  CONSCIENTIOUSNESS: ['p3', 'p4', 'p19', 'p20', 'p33', 'p21', 'p66'],
  EXTRAVERSION: ['p5', 'p6', 'p42', 'p27', 'p29', 'p40', 'p41'],
  AGREEABLENESS: ['p7', 'p8', 'p16', 'p17', 'p26', 'p43', 'p64'],
  EMOTIONAL_STABILITY: ['p9', 'p10', 'p45', 'p46', 'p50', 'p53', 'p54'],
  RESILIENCE: ['p30', 'p31', 'p32', 'p47', 'p48', 'p52'],
  SOCIAL_SUPPORT: ['p55', 'p57', 'p58', 'p59', 'p64'],
  ACADEMIC_MOTIVATION: ['p60', 'p61', 'p62', 'p63']
};

// Learning style categories
const LEARNING_STYLES = {
  ANALYTICAL: ['p11', 'p12', 'p13', 's3', 's4', 'p66'],
  CREATIVE: ['p14', 'p15', 'pref4', 's5', 'p67'],
  PRACTICAL: ['p3', 'p4', 'p33', 's1', 'p66'],
  SOCIAL: ['p27', 'p42', 'pref5', 'p65']
};

// Comprehensive skill categories
const SKILL_CATEGORIES = {
  TECHNICAL: {
    ids: ['s1', 's2', 'pref3', 's13'],
    subcategories: {
      COMPUTER_LITERACY: ['s1'],
      PROGRAMMING: ['s2'],
      TECHNICAL_APTITUDE: ['pref3']
    }
  },
  ANALYTICAL: {
    ids: ['s3', 's4', 's9', 's10', 's11', 's12'],
    subcategories: {
      MATHEMATICAL: ['s3', 's9', 's10'],
      LOGICAL: ['s11', 's12'],
      DATA_ANALYSIS: ['s4']
    }
  },
  PROBLEM_SOLVING: {
    ids: ['s6', 'p31', 'p32', 'p66'],
    subcategories: {
      CRITICAL_THINKING: ['s6'],
      INNOVATION: ['p31'],
      RESILIENCE: ['p32']
    }
  },
  COMMUNICATION: {
    ids: ['s7', 's8', 'pref5'],
    subcategories: {
      VERBAL: ['s7'],
      INTERPERSONAL: ['s8'],
      TEAMWORK: ['pref5']
    }
  }
};

function calculateTraitScore(answers: Answer[], questionIds: string[]): number {
  const relevantAnswers = answers.filter(a => questionIds.includes(a.questionId));
  if (relevantAnswers.length === 0) return 0;
  
  const total = relevantAnswers.reduce((sum, answer) => {
    let value = 0;
    if (typeof answer.value === 'number') {
      value = answer.value;
    } else if (answer.value === 'True') {
      value = 5;
    } else if (answer.value === 'False') {
      value = 1;
    } else if (Array.isArray(answer.value)) {
      // For multiple choice questions, calculate based on number of selections
      value = (answer.value.length / questionIds.length) * 5;
    } else if (typeof answer.value === 'string') {
      // For single choice questions
      const correctAnswers = {
        's9': '32', // Sequence question
        's10': '30', // Percentage question
        's11': 'Car', // Word that doesn't belong
        's12': 'Triangle' // Pattern completion
      };
      value = answer.value === correctAnswers[answer.questionId] ? 5 : 1;
    }
    return sum + value;
  }, 0);
  
  return Math.round((total / (questionIds.length * 5)) * 100);
}

function getPersonalityTraitDescription(trait: string, score: number): TraitScore {
  const descriptions: Record<string, TraitScore> = {
    OPENNESS: {
      trait: 'Openness to Experience',
      score,
      description: score > 70 
        ? 'Highly curious and creative with a strong appetite for learning' 
        : 'Practical and conventional in approach',
      recommendations: score > 70 
        ? [
          'Consider careers in research, innovation, or creative fields',
          'Look for roles that involve continuous learning',
          'Seek opportunities for creative problem-solving'
        ] 
        : [
          'Consider structured roles with clear guidelines',
          'Focus on practical, hands-on work',
          'Look for positions with established procedures'
        ]
    },
    CONSCIENTIOUSNESS: {
      trait: 'Conscientiousness',
      score,
      description: score > 70 
        ? 'Highly organized and detail-oriented with strong work ethic' 
        : 'Flexible and adaptable in approach',
      recommendations: score > 70 
        ? [
          'Consider project management or administrative roles',
          'Look for positions requiring attention to detail',
          'Seek roles with clear processes and structure'
        ] 
        : [
          'Consider dynamic, creative positions',
          'Look for roles with variety and flexibility',
          'Seek positions that value adaptability'
        ]
    },
    // Add other traits with detailed descriptions...
  };
  
  return descriptions[trait] || {
    trait,
    score,
    description: score > 70 ? 'Strong capability' : 'Area for development',
    recommendations: [
      score > 70 
        ? 'Continue leveraging this strength in your career choices'
        : 'Consider development opportunities in this area'
    ]
  };
}

function calculateSkillScore(answers: Answer[], category: keyof typeof SKILL_CATEGORIES): TraitScore {
  const categoryData = SKILL_CATEGORIES[category];
  const score = calculateTraitScore(answers, categoryData.ids);
  
  const subcategoryScores = Object.entries(categoryData.subcategories).map(([name, ids]) => ({
    name,
    score: calculateTraitScore(answers, ids)
  }));

  const recommendations = subcategoryScores
    .filter(sub => sub.score < 60)
    .map(sub => `Consider developing ${sub.name.toLowerCase().replace('_', ' ')} skills`);

  return {
    trait: category,
    score,
    description: score > 70 
      ? `Strong proficiency in ${category.toLowerCase()} skills` 
      : `Developing ${category.toLowerCase()} capabilities`,
    recommendations: recommendations.length > 0 ? recommendations : [`Continue strengthening ${category.toLowerCase()} skills`]
  };
}

function calculatePreferences(answers: Answer[]): {
  workStyle: TraitScore[];
  careerPaths: string[];
} {
  // Extract career cluster preferences
  const careerPrefs = answers.find(a => a.questionId === 'pref11');
  const careerPaths = careerPrefs && Array.isArray(careerPrefs.value) 
    ? careerPrefs.value 
    : [];

  // Calculate work style preferences
  const workStyles = [
    {
      trait: 'Team Collaboration',
      questionIds: ['pref1', 'pref5', 'p27']
    },
    {
      trait: 'Leadership',
      questionIds: ['pref2', 'pref6', 'pref7']
    },
    {
      trait: 'Innovation',
      questionIds: ['pref3', 'pref4', 's6']
    }
  ].map(style => ({
    trait: style.trait,
    score: calculateTraitScore(answers, style.questionIds),
    description: `Your preference for ${style.trait.toLowerCase()}`,
    recommendations: []
  }));

  return {
    workStyle: workStyles,
    careerPaths
  };
}

export function calculateResults(answers: Answer[]): AssessmentResult {
  // Calculate personality traits
  const personalityTraits = Object.entries(PERSONALITY_TRAITS).map(([trait, questions]) => {
    const score = calculateTraitScore(answers, questions);
    return getPersonalityTraitDescription(trait, score);
  });

  // Calculate learning styles
  const learningStyles = Object.entries(LEARNING_STYLES).map(([style, questions]) => ({
    trait: style,
    score: calculateTraitScore(answers, questions),
    description: `Your preference for ${style.toLowerCase()} learning`,
    recommendations: []
  }));

  // Calculate skills
  const skills = {
    technical: calculateSkillScore(answers, 'TECHNICAL'),
    analytical: calculateSkillScore(answers, 'ANALYTICAL'),
    soft: [
      calculateSkillScore(answers, 'PROBLEM_SOLVING'),
      calculateSkillScore(answers, 'COMMUNICATION')
    ]
  };

  // Calculate preferences
  const preferences = calculatePreferences(answers);

  // Generate overall recommendations
  const overallRecommendations = generateOverallRecommendations({
    psychometric: {
      personalityTraits,
      learningStyle: learningStyles,
      socialBehavior: []
    },
    skills,
    preferences,
    overallRecommendations: []
  });

  return {
    psychometric: {
      personalityTraits,
      learningStyle: learningStyles,
      socialBehavior: []
    },
    skills,
    preferences,
    overallRecommendations
  };
}

function generateOverallRecommendations(result: AssessmentResult): string[] {
  const recommendations: string[] = [];
  
  // Analyze personality traits
  const strongTraits = result.psychometric.personalityTraits
    .filter(trait => trait.score >= 70);
  
  if (strongTraits.length > 0) {
    recommendations.push(
      `Your strongest traits (${strongTraits.map(t => t.trait).join(', ')}) suggest you would excel in roles that value these characteristics.`
    );
  }

  // Analyze skills
  const skillGaps = [
    result.skills.technical,
    result.skills.analytical,
    ...result.skills.soft
  ].filter(skill => skill.score < 60);

  if (skillGaps.length > 0) {
    recommendations.push(
      `Consider focusing on developing these key areas: ${skillGaps.map(s => s.trait).join(', ')}.`
    );
  }

  // Add learning style recommendations
  const dominantLearningStyle = result.psychometric.learningStyle
    .reduce((prev, current) => prev.score > current.score ? prev : current);
  
  recommendations.push(
    `Your ${dominantLearningStyle.trait.toLowerCase()} learning style suggests you would benefit from ${
      dominantLearningStyle.trait === 'ANALYTICAL' ? 'structured, logical learning approaches' :
      dominantLearningStyle.trait === 'CREATIVE' ? 'innovative, artistic learning methods' :
      dominantLearningStyle.trait === 'PRACTICAL' ? 'hands-on, experiential learning' :
      'collaborative, interactive learning experiences'
    }.`
  );

  return recommendations;
}