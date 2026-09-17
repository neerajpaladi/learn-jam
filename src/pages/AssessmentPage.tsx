import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge, SkillBadge } from "@/components/ui/Badge";
import { assessmentQuestions } from "@/data/assessments";
import { categorizeSkill } from "@/lib/engine";
import type { AssessmentResult, AssessmentQuestion } from "@/types";
import {
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
  RotateCcw,
  Play,
} from "lucide-react";

export function AssessmentPage() {
  const { addAssessmentResults, scores, submitAnswer } = useApp();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<AssessmentResult[]>([]);

  const questions = assessmentQuestions;

  const handleAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    // Calculate scores per skill
    const skillQuestions = new Map<string, AssessmentQuestion[]>();
    for (const q of questions) {
      const arr = skillQuestions.get(q.skill) || [];
      arr.push(q);
      skillQuestions.set(q.skill, arr);
    }

    const newResults: AssessmentResult[] = [];
    const now = new Date().toISOString();

    for (const [skill, qs] of skillQuestions) {
      let correct = 0;
      for (const q of qs) {
        if (answers[q.id] === q.correctAnswer) correct++;
      }
      const score = Math.round((correct / qs.length) * 100);
      newResults.push({
        skillName: skill,
        score,
        category: categorizeSkill(score),
        dateTaken: now,
      });
    }

    setResults(newResults);
    addAssessmentResults(newResults);
    await Promise.all(questions.map((question) => submitAnswer({
      questionId: question.id,
      conceptId: question.skill,
      selectedOptionIndex: answers[question.id],
      correctOptionIndex: question.correctAnswer,
      difficulty: 0,
    })));
    setSubmitted(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setSubmitted(false);
    setCurrentQ(0);
    setAnswers({});
    setResults([]);
  };

  // --- Start screen ---
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader
            title="Skill Assessment"
            subtitle="Test your knowledge across core skills"
            icon={<ClipboardList size={20} />}
          />
          <CardBody className="space-y-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <h4 className="font-semibold text-slate-900 mb-2">How it works</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  Answer {questions.length} multiple-choice questions across {new Set(questions.map((q) => q.skill)).size} skills
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  Each skill is scored from 0 to 100%
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  The AI agent uses your scores to personalize recommendations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  Difficulty adapts automatically based on your performance
                </li>
              </ul>
            </div>

            {/* Current scores */}
            {scores.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Your current scores:</p>
                <div className="grid grid-cols-2 gap-3">
                  {scores.map((s) => (
                    <div key={s.skillName} className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                      <span className="text-sm font-medium text-slate-700">{s.skillName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{s.score}%</span>
                        <SkillBadge category={s.category} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={() => setStarted(true)} size="lg" className="w-full">
              <Play size={18} /> Start Assessment
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // --- Results screen ---
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader
            title="Assessment Results"
            subtitle="Your scores have been recorded"
            icon={<Award size={20} />}
          />
          <CardBody className="space-y-4">
            {results.map((result) => (
              <div key={result.skillName} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{result.skillName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{result.score}%</span>
                    <SkillBadge category={result.category} />
                  </div>
                </div>
                <ProgressBar
                  value={result.score}
                  color={result.category === "Strong" ? "green" : result.category === "Moderate" ? "amber" : "red"}
                  showValue={false}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <ClipboardList size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">AI Agent Updated</h4>
              <p className="text-sm text-slate-600">
                Your recommendations, skill gap analysis, and learning path have been automatically
                updated based on these new scores. Check the Performance, Skill Gaps, and Learning
                Path pages to see the changes.
              </p>
            </div>
          </div>
        </Card>

        <Button onClick={handleRestart} variant="outline" size="lg" className="w-full">
          <RotateCcw size={18} /> Retake Assessment
        </Button>
      </div>
    );
  }

  // --- Question screen ---
  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const isAnswered = answers[question.id] !== undefined;
  const isLast = currentQ === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">
            Question {currentQ + 1} of {questions.length}
          </span>
          <Badge variant="blue">{question.skill}</Badge>
        </div>
        <ProgressBar value={progress} color="blue" showValue={false} size="sm" />
      </div>

      {/* Question */}
      <Card>
        <CardBody className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 leading-snug">
            {question.question}
          </h3>
          <div className="space-y-2.5">
            {question.options.map((option, i) => {
              const selected = answers[question.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(question.id, i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    selected
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                    selected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
          disabled={currentQ === 0}
        >
          <ChevronLeft size={18} /> Previous
        </Button>
        {isLast ? (
          <Button onClick={handleSubmit} disabled={!isAnswered}>
            Submit Assessment <CheckCircle2 size={18} />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQ((c) => Math.min(questions.length - 1, c + 1))}
            disabled={!isAnswered}
          >
            Next <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
