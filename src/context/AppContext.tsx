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
import { api, type ApiProfile } from "@/lib/api";

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
  isAuthenticated: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  syncProfile: (p: StudentProfile) => Promise<void>;
  submitAnswer: (answer: { questionId: string; conceptId: string; selectedOptionIndex: number; correctOptionIndex: number; difficulty: number }) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile>(demoProfile);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>(demoAssessmentResults);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>(demoAssessmentHistory);
  const [completedTopics, setCompletedTopics] = useState<string[]>(demoCompletedTopics);
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");
  const [hasProfile, setHasProfile] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(api.getToken()));
  const [authError, setAuthError] = useState<string | null>(null);

  const applyApiProfile = (remote: ApiProfile) => {
    setProfile((current) => ({
      ...current,
      learningGoal: remote.target_goals[0] ?? current.learningGoal,
      preferredLearningStyle: remote.preferred_format,
    }));
  };

  const login = async (email: string, password: string) => {
    try {
      const token = await api.login(email, password);
      applyApiProfile(await api.getProfile(token));
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to log in");
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    await api.register(email, password);
    await login(email, password);
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
  };

  const syncProfile = async (nextProfile: StudentProfile) => {
    setProfile(nextProfile);
    const token = api.getToken();
    if (!token) return;
    await api.updateProfile(token, {
      target_goals: [nextProfile.learningGoal],
      preferred_format: nextProfile.preferredLearningStyle,
      learning_pace: nextProfile.studyHoursPerDay >= 5 ? "fast" : nextProfile.studyHoursPerDay <= 2 ? "slow" : "medium",
    });
  };

  const submitAnswer = async (answer: { questionId: string; conceptId: string; selectedOptionIndex: number; correctOptionIndex: number; difficulty: number }) => {
    const token = api.getToken();
    if (!token) return;
    await api.submitAnswer(token, {
      question_id: answer.questionId,
      concept_id: answer.conceptId,
      selected_option_index: answer.selectedOptionIndex,
      correct_option_index: answer.correctOptionIndex,
      difficulty: answer.difficulty,
      discrimination: 1,
    });
  };

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
    isAuthenticated,
    authError,
    login,
    register,
    logout,
    syncProfile,
    submitAnswer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
