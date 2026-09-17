import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  StudentProfile,
  AssessmentResult,
  SkillScore,
  SkillGap,
  AIInsight,
  Resource,
  DifficultyLevel,
  LearningPathNode,
  PageKey,
} from "@/types";
import {
  demoProfile,
  demoAssessmentResults,
  demoCompletedTopics,
  demoAssessmentHistory,
} from "@/data/demoData";
import {
  scoresFromResults,
  identifySkillGaps,
  recommendResources,
  generateAIInsights,
  calculateOverallProgress,
  calculateSkillProgress,
} from "@/lib/engine";
import { generateLearningPath } from "@/lib/learningPath";

interface AppContextValue {
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
  assessmentResults: AssessmentResult[];
  assessmentHistory: AssessmentResult[];
  addAssessmentResults: (results: AssessmentResult[]) => void;
  scores: SkillScore[];
  skillGaps: SkillGap[];
  recommendations: { skill: string; difficulty: DifficultyLevel; resources: Resource[] }[];
  aiInsights: AIInsight[];
  learningPath: LearningPathNode[];
  completedTopics: string[];
  toggleTopicComplete: (topicId: string) => void;
  overallProgress: number;
  skillProgress: { skill: string; progress: number; trend: "up" | "down" | "stable" }[];
  currentPage: PageKey;
  setCurrentPage: (p: PageKey) => void;
  hasProfile: boolean;
  setHasProfile: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(demoProfile);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>(demoAssessmentResults);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>(demoAssessmentHistory);
  const [completedTopics, setCompletedTopics] = useState<string[]>(demoCompletedTopics);
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");
  const [hasProfile, setHasProfile] = useState(true);

  const scores = useMemo(() => scoresFromResults(assessmentResults), [assessmentResults]);

  const skillGaps = useMemo(() => identifySkillGaps(scores, profile.learningGoal), [scores, profile.learningGoal]);

  const recommendations = useMemo(() => recommendResources(scores, skillGaps), [scores, skillGaps]);

  const aiInsights = useMemo(
    () => generateAIInsights(profile, scores, skillGaps, recommendations),
    [profile, scores, skillGaps, recommendations],
  );

  const learningPath = useMemo(
    () => generateLearningPath(profile.learningGoal, scores, skillGaps, completedTopics),
    [profile.learningGoal, scores, skillGaps, completedTopics],
  );

  const overallProgress = useMemo(
    () => calculateOverallProgress(completedTopics, learningPath.length),
    [completedTopics, learningPath],
  );

  const skillProgress = useMemo(
    () => calculateSkillProgress(scores, assessmentHistory),
    [scores, assessmentHistory],
  );

  const addAssessmentResults = (results: AssessmentResult[]) => {
    setAssessmentResults((prev) => [...prev, ...results]);
    setAssessmentHistory((prev) => [...prev, ...results]);
  };

  const toggleTopicComplete = (topicId: string) => {
    setCompletedTopics((prev) => {
      if (prev.includes(topicId)) {
        return prev.filter((id) => id !== topicId);
      }
      return [...prev, topicId];
    });
  };

  const value: AppContextValue = {
    profile,
    setProfile,
    assessmentResults,
    assessmentHistory,
    addAssessmentResults,
    scores,
    skillGaps,
    recommendations,
    aiInsights,
    learningPath,
    completedTopics,
    toggleTopicComplete,
    overallProgress,
    skillProgress,
    currentPage,
    setCurrentPage,
    hasProfile,
    setHasProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
