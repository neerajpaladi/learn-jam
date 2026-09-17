import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge, SkillBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  SplitSquareVertical,
  AlertTriangle,
  ArrowRight,
  Target,
  Info,
  Flame,
  Shield,
} from "lucide-react";

export function SkillGapsPage() {
  const { skillGaps, scores, profile } = useApp();

  const highPriority = skillGaps.filter((g) => g.priority === "High");
  const mediumPriority = skillGaps.filter((g) => g.priority === "Medium");
  const lowPriority = skillGaps.filter((g) => g.priority === "Low");

  const priorityConfig = {
    High: { variant: "red" as const, icon: <Flame size={16} />, label: "High Priority" },
    Medium: { variant: "amber" as const, icon: <Shield size={16} />, label: "Medium Priority" },
    Low: { variant: "blue" as const, icon: <Info size={16} />, label: "Low Priority" },
  };

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <SplitSquareVertical size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">AI Skill-Gap Analysis</h3>
            <p className="text-sm text-slate-300">
              The AI agent compared your assessment scores against the skills required for{" "}
              <span className="font-semibold text-white">{profile.learningGoal}</span> and
              identified <span className="font-semibold text-white">{skillGaps.length} skill gap{skillGaps.length !== 1 ? "s" : ""}</span>.
              Each gap is explained and prioritized below.
            </p>
          </div>
        </div>
      </div>

      {/* Required skills overview */}
      <Card>
        <CardHeader title="Required Skills vs. Your Scores" subtitle="Skills needed for your learning goal" icon={<Target size={20} />} />
        <CardBody>
          <div className="space-y-4">
            {scores.map((score) => {
              const gap = skillGaps.find((g) => g.skill === score.skillName);
              return (
                <div key={score.skillName} className="flex items-center gap-4">
                  <div className="w-36 sm:w-44 shrink-0">
                    <span className="text-sm font-medium text-slate-700">{score.skillName}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-16">Your score</span>
                      <ProgressBar value={score.score} color={score.category === "Strong" ? "green" : score.category === "Moderate" ? "amber" : "red"} showValue={false} size="sm" />
                      <span className="text-xs font-semibold text-slate-700 w-8">{score.score}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-16">Required</span>
                      <ProgressBar value={75} color="blue" showValue={false} size="sm" />
                      <span className="text-xs font-semibold text-blue-600 w-8">75%</span>
                    </div>
                  </div>
                  <div className="w-24 shrink-0 text-right">
                    {gap ? (
                      <Badge variant={priorityConfig[gap.priority].variant}>
                        {priorityConfig[gap.priority].label}
                      </Badge>
                    ) : (
                      <SkillBadge category={score.category} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Skill gaps with explanations */}
      {skillGaps.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <Target size={32} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No Skill Gaps Detected</h3>
          <p className="text-sm text-slate-500">All your skills meet the 75% threshold for your learning goal. You're ready for advanced topics!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {highPriority.length > 0 && (
            <GapSection title="High Priority Gaps" subtitle="Address these first — they're critical blockers" gaps={highPriority} config={priorityConfig.High} />
          )}
          {mediumPriority.length > 0 && (
            <GapSection title="Medium Priority Gaps" subtitle="Important but not blocking" gaps={mediumPriority} config={priorityConfig.Medium} />
          )}
          {lowPriority.length > 0 && (
            <GapSection title="Low Priority Gaps" subtitle="Minor improvements for completeness" gaps={lowPriority} config={priorityConfig.Low} />
          )}
        </div>
      )}

      {/* How it works */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">How the AI identifies gaps</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              The system compares your latest assessment scores against the 75% proficiency
              threshold required for each skill in your learning goal. Skills below the
              threshold are flagged as gaps, ranked by severity, and explained with
              context about why they matter for your specific goal.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function GapSection({
  title,
  subtitle,
  gaps,
  config,
}: {
  title: string;
  subtitle: string;
  gaps: typeof useApp extends () => infer T ? any : any;
  config: { variant: "red" | "amber" | "blue"; icon: React.ReactNode; label: string };
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={config.variant}>{config.icon} {title}</Badge>
        <span className="text-sm text-slate-500">{subtitle}</span>
      </div>
      <div className="space-y-3">
        {gaps.map((gap: any) => (
          <Card key={gap.skill} className="p-4">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                config.variant === "red" ? "bg-rose-50 text-rose-600" :
                config.variant === "amber" ? "bg-amber-50 text-amber-600" :
                "bg-blue-50 text-blue-600"
              }`}>
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-900">{gap.skill}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Gap: </span>
                    <span className={`text-sm font-bold ${
                      gap.priority === "High" ? "text-rose-600" :
                      gap.priority === "Medium" ? "text-amber-600" :
                      "text-blue-600"
                    }`}>
                      {gap.gap > 0 ? "+" : ""}{gap.gap} pts
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Current</span>
                    <span className="text-sm font-semibold text-slate-700">{gap.currentScore}%</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">Target</span>
                    <span className="text-sm font-semibold text-blue-600">{gap.requiredScore}%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Why this is a gap: </span>
                    {gap.reason}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
