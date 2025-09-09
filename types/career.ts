export interface Question {
  id: string;
  question: string;
  options: string[];
  category: CareerCategory;
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  category: CareerCategory;
}

export interface QuizSession {
  id: string;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  educationPath: string[];
  averageSalary?: string;
  jobOutlook: string;
  category: CareerCategory;
}

export interface CareerProfile {
  strengths: string[];
  interests: CareerCategory[];
  personalityTraits: string[];
  recommendations: CareerRecommendation[];
}

export enum CareerCategory {
  AVIATION = 'aviation',
  TECHNOLOGY = 'technology',
  HEALTHCARE = 'healthcare',
  BUSINESS = 'business',
  CREATIVE = 'creative',
  ENGINEERING = 'engineering',
  EDUCATION = 'education',
  SCIENCE = 'science',
  SOCIAL_SERVICES = 'social_services',
  SPORTS = 'sports',
}

export interface AviatorCharacter {
  name: string;
  message: string;
  mood: 'friendly' | 'encouraging' | 'thinking' | 'congratulating';
}

export interface GeminiResponse {
  questions?: Question[];
  recommendations?: CareerRecommendation[];
  aviatorMessage?: string;
  error?: string;
}
