import type {
  SkillScore,
  SkillCategory,
  DifficultyLevel,
  SkillGap,
  Resource,
  AIInsight,
  AssessmentResult,
  StudentProfile,
} from "@/types";
import { resourceLibrary } from "@/data/resources";
import { goalSkillMap, allSkills } from "@/data/demoData";

export function categorizeSkill(score: number): SkillCategory {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Moderate";
  return "Needs Improvement";
}

export function getDifficultyForScore(score: number): DifficultyLevel {
  if (score < 50) return "Beginner";
  if (score < 75) return "Intermediate";
  return "Advanced";
}

export function scoresFromResults(results: AssessmentResult[]): SkillScore[] {
  const latest = new Map<string, AssessmentResult>();
  for (const r of results) {
    const existing = latest.get(r.skillName);
    if (!existing || new Date(r.dateTaken) > new Date(existing.dateTaken)) {
      latest.set(r.skillName, r);
    }
  }
  return Array.from(latest.values()).map((r) => ({
    skillName: r.skillName,
    score: r.score,
    category: categorizeSkill(r.score),
  }));
}

export function identifySkillGaps(
  scores: SkillScore[],
  goal: string,
): SkillGap[] {
  const requiredSkills = goalSkillMap[goal] || allSkills;
  const scoreMap = new Map(scores.map((s) => [s.skillName, s.score]));

  const gaps: SkillGap[] = [];

  for (const skill of requiredSkills) {
    const currentScore = scoreMap.get(skill) ?? 0;
    const requiredScore = 75;
    const gap = requiredScore - currentScore;

    if (gap > 0) {
      let priority: "High" | "Medium" | "Low" = "Low";
      if (gap >= 40) priority = "High";
      else if (gap >= 20) priority = "Medium";

      gaps.push({
        skill,
        currentScore,
        requiredScore,
        gap,
        priority,
        reason: generateGapReason(skill, currentScore, goal),
      });
    }
  }

  return gaps.sort((a, b) => b.gap - a.gap);
}

function generateGapReason(skill: string, currentScore: number, goal: string): string {
  const reasons: Record<string, string> = {
    Statistics: `Statistics is foundational for ${goal}. Your current score of ${currentScore}% means you'll struggle with model evaluation, understanding distributions, and interpreting ML results. Mastering mean, variance, and hypothesis testing is essential before advancing.`,
    Probability: `Probability theory underpins core ${goal} algorithms like Naive Bayes and Bayesian inference. At ${currentScore}%, you need to build intuition for conditional probability and distributions before tackling ML models.`,
    "Machine Learning": `Your ${goal} goal requires direct ML knowledge. At ${currentScore}%, you should start with supervised learning fundamentals, model training, and evaluation before moving to advanced topics.`,
    Python: `Python is the primary programming language for ${goal}. Your ${currentScore}% suggests some gaps in advanced features needed for ML libraries and data manipulation.`,
    "Data Structures": `Efficient data handling is crucial for ${goal}. At ${currentScore}%, understanding arrays, hash maps, and trees will help you process large datasets efficiently.`,
    NumPy: `NumPy is essential for numerical computing in ${goal}. At ${currentScore}%, you need to learn array operations and vectorization before working with ML frameworks.`,
    Pandas: `Pandas is the standard tool for data manipulation in ${goal}. At ${currentScore}%, you need DataFrame operations and data cleaning skills for real ML projects.`,
  };

  return reasons[skill] || `Your current score of ${currentScore}% in ${skill} is below the 75% threshold needed for ${goal}. Improving this skill will strengthen your foundation and prepare you for advanced topics.`;
}

export function recommendResources(
  scores: SkillScore[],
  gaps: SkillGap[],
): { skill: string; difficulty: DifficultyLevel; resources: Resource[] }[] {
  const recommendations: { skill: string; difficulty: DifficultyLevel; resources: Resource[] }[] = [];

  // Recommend for skill gaps first (prioritized)
  for (const gap of gaps) {
    const difficulty = getDifficultyForScore(gap.currentScore);
    const resources = resourceLibrary[gap.skill]?.[difficulty] || [];
    if (resources.length > 0) {
      recommendations.push({ skill: gap.skill, difficulty, resources });
    }
  }

  // Also recommend for skills that are Moderate but not Strong
  for (const score of scores) {
    if (score.category === "Moderate" && !gaps.find((g) => g.skill === score.skillName)) {
      const difficulty = getDifficultyForScore(score.score);
      const resources = resourceLibrary[score.skillName]?.[difficulty] || [];
      if (resources.length > 0) {
        recommendations.push({ skill: score.skillName, difficulty, resources });
      }
    }
  }

  return recommendations;
}

export function generateAIInsights(
  profile: StudentProfile,
  scores: SkillScore[],
  gaps: SkillGap[],
  recommendations: { skill: string; difficulty: DifficultyLevel; resources: Resource[] }[],
): AIInsight[] {
  const insights: AIInsight[] = [];

  const strongSkills = scores.filter((s) => s.category === "Strong");
  const weakSkills = scores.filter((s) => s.category === "Needs Improvement");

  if (strongSkills.length > 0) {
    insights.push({
      title: "Leverage Your Strengths",
      description: `You excel in ${strongSkills.map((s) => s.skillName).join(", ")}. These skills give you a solid foundation for ${profile.learningGoal}. Use these as building blocks while you work on weaker areas.`,
      type: "strength",
      icon: "Award",
    });
  }

  if (weakSkills.length > 0) {
    insights.push({
      title: "Critical Skill Gaps Detected",
      description: `${weakSkills.map((s) => s.skillName).join(", ")} ${
        weakSkills.length === 1 ? "is" : "are"
      } significantly below the required level. The AI agent recommends focusing on ${weakSkills
        .map((s) => s.skillName)
        .join(", ")} before advancing to complex ${profile.learningGoal} topics.`,
      type: "weakness",
      icon: "AlertTriangle",
    });
  }

  const highPriorityGaps = gaps.filter((g) => g.priority === "High");
  if (highPriorityGaps.length > 0) {
    insights.push({
      title: "Priority Learning Plan",
      description: `Based on your goal of ${profile.learningGoal}, the system has identified ${highPriorityGaps.length} high-priority gap${highPriorityGaps.length > 1 ? "s" : ""}. Start with ${highPriorityGaps[0].skill} (${highPriorityGaps[0].currentScore}%) — it's the most critical prerequisite for your goal.`,
      type: "plan",
      icon: "Target",
    });
  }

  if (recommendations.length > 0) {
    insights.push({
      title: "Adaptive Difficulty Active",
      description: `The system has set your difficulty to ${recommendations[0].difficulty} for ${recommendations[0].skill}. As your assessment scores improve, recommendations will automatically adjust to more advanced materials.`,
      type: "recommendation",
      icon: "Sparkles",
    });
  }

  insights.push({
    title: "Personalized Study Schedule",
    description: `With ${profile.studyHoursPerDay} hour${profile.studyHoursPerDay > 1 ? "s" : ""} per day and a ${profile.preferredLearningStyle} learning preference, the system recommends ${profile.preferredLearningStyle === "Visual" ? "video-based and interactive content" : profile.preferredLearningStyle === "Reading/Writing" ? "documentation and tutorial-heavy resources" : "practice-oriented and hands-on exercises"} as your primary learning materials.`,
    type: "recommendation",
    icon: "Clock",
  });

  return insights;
}

export function calculateOverallProgress(
  completedTopics: string[],
  totalTopics: number,
): number {
  if (totalTopics === 0) return 0;
  return Math.round((completedTopics.length / totalTopics) * 100);
}

export function calculateSkillProgress(
  scores: SkillScore[],
  assessmentHistory: AssessmentResult[],
): { skill: string; progress: number; trend: "up" | "down" | "stable" }[] {
  return scores.map((score) => {
    const history = assessmentHistory
      .filter((h) => h.skillName === score.skillName)
      .sort((a, b) => new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime());

    let trend: "up" | "down" | "stable" = "stable";
    if (history.length >= 2) {
      const prev = history[history.length - 2].score;
      const curr = history[history.length - 1].score;
      if (curr > prev) trend = "up";
      else if (curr < prev) trend = "down";
    }

    return {
      skill: score.skillName,
      progress: score.score,
      trend,
    };
  });
}
