import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SkillBadge, Badge } from "@/components/ui/Badge";
import { PerformanceChart, RadarChart } from "@/components/ui/Charts";
import {
  BarChart3,
  Award,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
} from "lucide-react";

export function PerformancePage() {
  const { scores, skillProgress } = useApp();

  const strongSkills = scores.filter((s) => s.category === "Strong");
  const weakSkills = scores.filter((s) => s.category === "Needs Improvement");
  const moderateSkills = scores.filter((s) => s.category === "Moderate");

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    : 0;

  const trendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp size={16} className="text-emerald-500" />;
    if (trend === "down") return <TrendingDown size={16} className="text-rose-500" />;
    return <Minus size={16} className="text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Average Score</p>
              <p className="text-xl font-bold text-slate-900">{avgScore}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Strong Skills</p>
              <p className="text-xl font-bold text-slate-900">{strongSkills.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart3 size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Moderate Skills</p>
              <p className="text-xl font-bold text-slate-900">{moderateSkills.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Needs Improvement</p>
              <p className="text-xl font-bold text-slate-900">{weakSkills.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Performance Chart" subtitle="Bar chart of all skill scores" icon={<BarChart3 size={20} />} />
          <CardBody>
            <PerformanceChart scores={scores} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Skill Radar" subtitle="Multi-dimensional view" icon={<Activity size={20} />} />
          <CardBody className="flex items-center justify-center pt-2">
            <RadarChart scores={scores} />
          </CardBody>
        </Card>
      </div>

      {/* Detailed skill breakdown */}
      <Card>
        <CardHeader title="Detailed Skill Breakdown" subtitle="Progress bars with trend indicators" icon={<TrendingUp size={20} />} />
        <CardBody>
          <div className="space-y-5">
            {scores.map((score) => {
              const progress = skillProgress.find((p) => p.skill === score.skillName);
              return (
                <div key={score.skillName} className="flex items-center gap-4">
                  <div className="w-32 sm:w-40 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{score.skillName}</span>
                      {progress && trendIcon(progress.trend)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <ProgressBar
                      value={score.score}
                      color={score.category === "Strong" ? "green" : score.category === "Moderate" ? "amber" : "red"}
                      showValue={false}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-24 justify-end shrink-0">
                    <span className="text-lg font-bold text-slate-900">{score.score}%</span>
                    <SkillBadge category={score.category} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Strong & Weak skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Strong Skills" subtitle="Your areas of excellence" icon={<Award size={20} />} />
          <CardBody>
            {strongSkills.length > 0 ? (
              <div className="space-y-3">
                {strongSkills.map((skill) => (
                  <div key={skill.skillName} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Award size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{skill.skillName}</p>
                      <p className="text-xs text-slate-500">Score: {skill.score}%</p>
                    </div>
                    <Badge variant="green">Strong</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No strong skills yet. Keep practicing!</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Weak Skills" subtitle="Focus areas for improvement" icon={<AlertTriangle size={20} />} />
          <CardBody>
            {weakSkills.length > 0 ? (
              <div className="space-y-3">
                {weakSkills.map((skill) => (
                  <div key={skill.skillName} className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                      <AlertTriangle size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{skill.skillName}</p>
                      <p className="text-xs text-slate-500">Score: {skill.score}%</p>
                    </div>
                    <Badge variant="red">Needs Work</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No weak skills detected. Great job!</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
