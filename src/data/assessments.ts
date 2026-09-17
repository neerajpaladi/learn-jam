import type { AssessmentQuestion } from "@/types";

export const assessmentQuestions: AssessmentQuestion[] = [
  // Python
  {
    id: "py1",
    skill: "Python",
    question: "What is the output of: print(type([]))?",
    options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"],
    correctAnswer: 0,
  },
  {
    id: "py2",
    skill: "Python",
    question: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "fun", "define"],
    correctAnswer: 1,
  },
  {
    id: "py3",
    skill: "Python",
    question: "What does len([1, 2, 3]) return?",
    options: ["2", "3", "4", "Error"],
    correctAnswer: 1,
  },
  {
    id: "py4",
    skill: "Python",
    question: "Which of these is a valid dictionary creation?",
    options: ["dict = []", "dict = {}", "dict = ()", "dict = set()"],
    correctAnswer: 1,
  },
  // Data Structures
  {
    id: "ds1",
    skill: "Data Structures",
    question: "What is the time complexity of inserting at the head of a linked list?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctAnswer: 2,
  },
  {
    id: "ds2",
    skill: "Data Structures",
    question: "Which data structure uses LIFO (Last In, First Out)?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: 1,
  },
  {
    id: "ds3",
    skill: "Data Structures",
    question: "What is the height of a balanced binary tree with n nodes?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
  },
  {
    id: "ds4",
    skill: "Data Structures",
    question: "Which structure is best for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    correctAnswer: 2,
  },
  // Statistics
  {
    id: "st1",
    skill: "Statistics",
    question: "What is the median of the set {3, 5, 7, 1, 9}?",
    options: ["3", "5", "7", "4"],
    correctAnswer: 1,
  },
  {
    id: "st2",
    skill: "Statistics",
    question: "What does standard deviation measure?",
    options: ["Average value", "Spread of data", "Median", "Range"],
    correctAnswer: 1,
  },
  {
    id: "st3",
    skill: "Statistics",
    question: "Which distribution is symmetric and bell-shaped?",
    options: ["Uniform", "Normal", "Exponential", "Poisson"],
    correctAnswer: 1,
  },
  {
    id: "st4",
    skill: "Statistics",
    question: "What is the formula for variance?",
    options: ["Sum of values / n", "Sum of squared deviations / n", "Max - Min", "Mean * Median"],
    correctAnswer: 1,
  },
  // Machine Learning
  {
    id: "ml1",
    skill: "Machine Learning",
    question: "What type of learning uses labeled data?",
    options: ["Unsupervised", "Supervised", "Reinforcement", "Semi-supervised"],
    correctAnswer: 1,
  },
  {
    id: "ml2",
    skill: "Machine Learning",
    question: "Which algorithm is used for classification?",
    options: ["K-Means", "Linear Regression", "Decision Tree", "PCA"],
    correctAnswer: 2,
  },
  {
    id: "ml3",
    skill: "Machine Learning",
    question: "What is overfitting?",
    options: [
      "Model performs well on training but poorly on test",
      "Model performs poorly on both",
      "Model has too few parameters",
      "Model uses no training data",
    ],
    correctAnswer: 0,
  },
  {
    id: "ml4",
    skill: "Machine Learning",
    question: "Which is a common evaluation metric for classification?",
    options: ["MSE", "Accuracy", "R-Squared", "Silhouette"],
    correctAnswer: 1,
  },
];
