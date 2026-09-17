import type { StudentProfile, AssessmentResult, SkillScore } from "@/types";
import { categorizeSkill } from "@/lib/engine";

export const demoProfile: StudentProfile = {
  name: "Ananya",
  educationLevel: "Undergraduate",
  branch: "Computer Science",
  year: "3rd Year",
  learningGoal: "Machine Learning",
  areasOfInterest: ["Artificial Intelligence", "Data Science", "Machine Learning"],
  currentSkillLevel: "Beginner",
  preferredLearningStyle: "Visual",
  studyHoursPerDay: 2,
};

export const demoAssessmentResults: AssessmentResult[] = [
  {
    skillName: "Python",
    score: 85,
    category: categorizeSkill(85),
    dateTaken: "2026-09-15T10:00:00Z",
  },
  {
    skillName: "Data Structures",
    score: 65,
    category: categorizeSkill(65),
    dateTaken: "2026-09-15T10:00:00Z",
  },
  {
    skillName: "Statistics",
    score: 35,
    category: categorizeSkill(35),
    dateTaken: "2026-09-15T10:00:00Z",
  },
  {
    skillName: "Machine Learning",
    score: 40,
    category: categorizeSkill(40),
    dateTaken: "2026-09-15T10:00:00Z",
  },
];

export const demoCompletedTopics = ["python-basics", "python-oop"];

export const demoAssessmentHistory: AssessmentResult[] = [
  {
    skillName: "Python",
    score: 60,
    category: categorizeSkill(60),
    dateTaken: "2026-09-01T10:00:00Z",
  },
  {
    skillName: "Data Structures",
    score: 45,
    category: categorizeSkill(45),
    dateTaken: "2026-09-01T10:00:00Z",
  },
  {
    skillName: "Python",
    score: 85,
    category: categorizeSkill(85),
    dateTaken: "2026-09-15T10:00:00Z",
  },
  {
    skillName: "Data Structures",
    score: 65,
    category: categorizeSkill(65),
    dateTaken: "2026-09-15T10:00:00Z",
  },
  {
    skillName: "Statistics",
    score: 35,
    category: categorizeSkill(35),
    dateTaken: "2026-09-15T10:00:00Z",
  },
  {
    skillName: "Machine Learning",
    score: 40,
    category: categorizeSkill(40),
    dateTaken: "2026-09-15T10:00:00Z",
  },
];

export const educationLevels = [
  "High School",
  "Undergraduate",
  "Postgraduate",
  "PhD",
  "Self-Taught",
];

export const branches = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Data Science",
  "Mathematics",
  "Other",
];

export const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year", "Graduated"];

export const learningGoals = [
  "Machine Learning",
  "Data Science",
  "Web Development",
  "Mobile Development",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
];

export const skillLevels = ["Beginner", "Intermediate", "Advanced"];

export const learningStyles = ["Visual", "Reading/Writing", "Auditory", "Kinesthetic"];

export const interestAreas = [
  "Artificial Intelligence",
  "Data Science",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "Algorithms",
  "Statistics",
  "Deep Learning",
];

// All skills available in the system
export const allSkills = [
  "Python",
  "Data Structures",
  "Statistics",
  "Machine Learning",
  "NumPy",
  "Pandas",
  "Probability",
];

// Skills required for each goal
export const goalSkillMap: Record<string, string[]> = {
  "Machine Learning": ["Python", "Statistics", "Probability", "NumPy", "Pandas", "Data Structures", "Machine Learning"],
  "Data Science": ["Python", "Statistics", "NumPy", "Pandas", "Machine Learning", "Data Structures"],
  "Artificial Intelligence": ["Python", "Data Structures", "Statistics", "Machine Learning", "Probability"],
  "Web Development": ["Python", "Data Structures"],
  "Mobile Development": ["Python", "Data Structures"],
  "Cybersecurity": ["Python", "Data Structures"],
  "Cloud Computing": ["Python", "Data Structures"],
  "DevOps": ["Python", "Data Structures"],
};
