export interface StudentProfile {
  name: string;
  educationLevel: string;
  branch: string;
  year: string;
  learningGoal: string;
  areasOfInterest: string[];
  currentSkillLevel: string;
  preferredLearningStyle: string;
  studyHoursPerDay: number;
}

export type SkillCategory = "Needs Improvement" | "Moderate" | "Strong";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface SkillScore {
  skillName: string;
  score: number; // 0-100
  category: SkillCategory;
}

export interface AssessmentQuestion {
  id: string;
  skill: string;
  question: string;
  options: string[];
  correctAnswer: number; // index into options
}

export interface AssessmentResult {
  skillName: string;
  score: number;
  category: SkillCategory;
  dateTaken: string;
}

export interface Resource {
  title: string;
  type: "Tutorial" | "Video" | "Documentation" | "Practice" | "Quiz" | "Project";
  url: string;
  description: string;
  difficulty: DifficultyLevel;
  provider: string;
  duration: string;
}

export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  estimatedHours: number;
  skillsCovered: string[];
  completed: boolean;
  isCurrent: boolean;
}

export interface SkillGap {
  skill: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  reason: string;
  priority: "High" | "Medium" | "Low";
}

export interface AIInsight {
  title: string;
  description: string;
  type: "strength" | "weakness" | "recommendation" | "plan";
  icon: string;
}

export type PageKey =
  | "dashboard"
  | "profile"
  | "assessment"
  | "performance"
  | "skillgaps"
  | "recommendations"
  | "learningpath"
  | "progress";
