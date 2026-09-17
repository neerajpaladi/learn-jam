import type { LearningPathNode, SkillScore, SkillGap, DifficultyLevel } from "@/types";
import { getDifficultyForScore } from "@/lib/engine";

interface PathTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  skillsCovered: string[];
}

// Master templates for each goal — the engine personalizes these
const pathTemplates: Record<string, PathTemplate[]> = {
  "Machine Learning": [
    { id: "python-basics", title: "Python Fundamentals", description: "Variables, data types, loops, functions, and file I/O — the building blocks.", difficulty: "Beginner", estimatedHours: 20, skillsCovered: ["Python"] },
    { id: "python-oop", title: "Python OOP & Libraries", description: "Classes, inheritance, and introduction to NumPy and Pandas.", difficulty: "Beginner", estimatedHours: 15, skillsCovered: ["Python", "NumPy"] },
    { id: "data-structures", title: "Data Structures Essentials", description: "Arrays, linked lists, stacks, queues, and hash maps for efficient data handling.", difficulty: "Intermediate", estimatedHours: 18, skillsCovered: ["Data Structures"] },
    { id: "statistics", title: "Statistics Foundations", description: "Descriptive stats, distributions, hypothesis testing, and correlation.", difficulty: "Beginner", estimatedHours: 16, skillsCovered: ["Statistics"] },
    { id: "probability", title: "Probability Theory", description: "Conditional probability, Bayes' theorem, and common distributions.", difficulty: "Beginner", estimatedHours: 14, skillsCovered: ["Probability"] },
    { id: "numpy-pandas", title: "NumPy & Pandas", description: "Array operations, DataFrames, data cleaning, and transformation.", difficulty: "Intermediate", estimatedHours: 12, skillsCovered: ["NumPy", "Pandas"] },
    { id: "ml-basics", title: "Machine Learning Basics", description: "Supervised learning, train/test split, and model evaluation.", difficulty: "Intermediate", estimatedHours: 20, skillsCovered: ["Machine Learning"] },
    { id: "ml-algorithms", title: "Core ML Algorithms", description: "Linear/logistic regression, decision trees, KNN, and clustering.", difficulty: "Intermediate", estimatedHours: 25, skillsCovered: ["Machine Learning"] },
    { id: "ml-project", title: "End-to-End ML Project", description: "Build, train, evaluate, and deploy a complete ML model on a real dataset.", difficulty: "Advanced", estimatedHours: 30, skillsCovered: ["Machine Learning"] },
  ],
  "Data Science": [
    { id: "python-basics", title: "Python Fundamentals", description: "Variables, data types, loops, functions, and file I/O.", difficulty: "Beginner", estimatedHours: 20, skillsCovered: ["Python"] },
    { id: "statistics", title: "Statistics for Data Science", description: "Descriptive stats, distributions, and hypothesis testing.", difficulty: "Beginner", estimatedHours: 16, skillsCovered: ["Statistics"] },
    { id: "numpy-pandas", title: "NumPy & Pandas Mastery", description: "Data manipulation, cleaning, and transformation at scale.", difficulty: "Intermediate", estimatedHours: 15, skillsCovered: ["NumPy", "Pandas"] },
    { id: "data-structures", title: "Data Structures for Data", description: "Efficient data handling and algorithm fundamentals.", difficulty: "Intermediate", estimatedHours: 18, skillsCovered: ["Data Structures"] },
    { id: "ml-basics", title: "Machine Learning Basics", description: "Supervised and unsupervised learning fundamentals.", difficulty: "Intermediate", estimatedHours: 20, skillsCovered: ["Machine Learning"] },
    { id: "ds-project", title: "Data Science Capstone Project", description: "End-to-end data analysis project with visualization and reporting.", difficulty: "Advanced", estimatedHours: 30, skillsCovered: ["Machine Learning"] },
  ],
  "Artificial Intelligence": [
    { id: "python-basics", title: "Python Fundamentals", description: "Core programming skills for AI development.", difficulty: "Beginner", estimatedHours: 20, skillsCovered: ["Python"] },
    { id: "data-structures", title: "Data Structures & Algorithms", description: "Trees, graphs, and search algorithms essential for AI.", difficulty: "Intermediate", estimatedHours: 18, skillsCovered: ["Data Structures"] },
    { id: "statistics", title: "Statistics & Probability", description: "Mathematical foundations for AI and ML.", difficulty: "Beginner", estimatedHours: 16, skillsCovered: ["Statistics", "Probability"] },
    { id: "ml-basics", title: "Machine Learning Foundations", description: "Supervised learning, model training, and evaluation.", difficulty: "Intermediate", estimatedHours: 20, skillsCovered: ["Machine Learning"] },
    { id: "ml-algorithms", title: "AI Algorithms", description: "Search, optimization, and reasoning algorithms.", difficulty: "Advanced", estimatedHours: 25, skillsCovered: ["Machine Learning"] },
    { id: "ai-project", title: "AI System Project", description: "Build an intelligent agent or recommendation system.", difficulty: "Advanced", estimatedHours: 30, skillsCovered: ["Machine Learning"] },
  ],
};

const defaultPath: PathTemplate[] = [
  { id: "python-basics", title: "Python Fundamentals", description: "Start with core programming concepts.", difficulty: "Beginner", estimatedHours: 20, skillsCovered: ["Python"] },
  { id: "data-structures", title: "Data Structures", description: "Learn fundamental data organization.", difficulty: "Intermediate", estimatedHours: 18, skillsCovered: ["Data Structures"] },
  { id: "project", title: "Capstone Project", description: "Apply your skills in a real project.", difficulty: "Advanced", estimatedHours: 30, skillsCovered: ["Python"] },
];

export function generateLearningPath(
  goal: string,
  scores: SkillScore[],
  gaps: SkillGap[],
  completedTopicIds: string[],
): LearningPathNode[] {
  const templates = pathTemplates[goal] || defaultPath;
  const scoreMap = new Map(scores.map((s) => [s.skillName, s.score]));
  const gapSkills = new Set(gaps.map((g) => g.skill));

  const nodes: LearningPathNode[] = templates.map((tmpl, index) => {
    // Determine if this node's skills are already strong
    const coveredScores = tmpl.skillsCovered.map((s) => scoreMap.get(s) ?? 0);
    const avgScore = coveredScores.length > 0
      ? coveredScores.reduce((a, b) => a + b, 0) / coveredScores.length
      : 0;

    const completed = completedTopicIds.includes(tmpl.id);

    // Prerequisites: all previous nodes
    const prerequisites = templates.slice(0, index).map((t) => t.id);

    // Personalize difficulty based on current skill level
    let personalizedDifficulty = tmpl.difficulty;
    if (avgScore > 0) {
      const adaptedDifficulty = getDifficultyForScore(avgScore);
      // If the student is strong in this area, bump up; if weak, keep beginner
      if (avgScore >= 75 && tmpl.difficulty !== "Advanced") {
        personalizedDifficulty = "Advanced";
      } else if (avgScore < 50) {
        personalizedDifficulty = "Beginner";
      } else {
        personalizedDifficulty = adaptedDifficulty;
      }
    }

    return {
      id: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      difficulty: personalizedDifficulty,
      prerequisites,
      estimatedHours: tmpl.estimatedHours,
      skillsCovered: tmpl.skillsCovered,
      completed,
      isCurrent: false,
    };
  });

  // Mark current node: first incomplete node whose prerequisites are met
  for (const node of nodes) {
    if (node.completed) continue;
    const prereqsMet = node.prerequisites.every((pid) => {
      const prereqNode = nodes.find((n) => n.id === pid);
      return prereqNode?.completed;
    });
    if (prereqsMet) {
      node.isCurrent = true;
      break;
    }
  }

  // If all are completed, mark the last as current
  if (!nodes.some((n) => n.isCurrent) && nodes.length > 0) {
    nodes[nodes.length - 1].isCurrent = true;
  }

  return nodes;
}
