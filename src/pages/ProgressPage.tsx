import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge, SkillBadge } from "@/components/ui/Badge";
import {
  TrendingUp,
  CheckCircle2,
  BookOpen,
  PlayCircle,
  Clock,
  History,
  Award,
  Target,
  Calendar,
} from "lucide-react";

export function ProgressPage() {
  const {
    overallProgress,
    skillProgress,
    learningPath,
    completedTopics,
    assessmentHistory,
    scores,
    profile,
  } = useApp();

  const completedNodes = learningPath.filter((n) => n.completed);
  const currentNode = learningPath.find((n) => n.isCurrent);
  const upcomingNodes = learningPath.filter((n) => !n.completed && !n.isCurrent);

  // Group assessment history by date
  const historyByDate = assessmentHistory.reduce((acc, h) => {
    const date = new Date(h.dateTaken).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(h);
    return acc;
  }, {} as Record<string, typeof assessmentHistory>);

  const sortedDates = Object.keys(historyByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  const totalHours = completedNodes.reduce((sum, n) => sum + n.estimatedHours, 0);
  const remainingHours = learningPath
    .filter((n) => !n.completed)
    .reduce((sum, n) => sum + n.estimatedHours, 0);

  return (
    <div className="space-y-6">
      {/* Overall progress hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Overall Learning Progress</h3>
              <p className="text-sm text-slate-500">Your journey toward {profile.learningGoal}</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp size={28} />
            </div>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold text-slate-900">{overallProgress}%</span>
            <span className="text-sm text-slate-500 mb-1.5">complete</span>
          </div>
          <ProgressBar value={overallProgress} color="blue" showValue={false} size="lg" />
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-medium">Completed</p>
              <p className="text-lg font-bold text-emerald-600">{completedTopics.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Remaining</p>
              <p className="text-lg font-bold text-blue-600">{learningPath.length - completedTopics.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Topics</p>
              <p className="text-lg font-bold text-slate-900">{learningPath.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Study Time</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm text-slate-600">Hours Studied</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 ml-6">{totalHours} hrs</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-blue-500" />
                <span className="text-sm text-slate-600">Hours Remaining</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 ml-6">{remainingHours} hrs</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-amber-500" />
                <span className="text-sm text-slate-600">Est. Days to Finish</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 ml-6">
                {profile.studyHoursPerDay > 0 ? Math.ceil(remainingHours / profile.studyHoursPerDay) : 0} days
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Skill progress */}
      <Card>
        <CardHeader title="Skill Progress" subtitle="Individual skill mastery with trend" icon={<Award size={20} />} />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {skillProgress.map((sp) => {
              const score = scores.find((s) => s.skillName === sp.skill);
              return (
                <div key={sp.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{sp.skill}</span>
                      {sp.trend === "up" && <TrendingUp size={14} className="text-emerald-500" />}
                      {sp.trend === "down" && <span className="text-xs text-rose-500">↓</span>}
                      {sp.trend === "stable" && <span className="text-xs text-slate-400">—</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{sp.progress}%</span>
                      {score && <SkillBadge category={score.category} />}
                    </div>
                  </div>
                  <ProgressBar
                    value={sp.progress}
                    color={sp.progress >= 75 ? "green" : sp.progress >= 50 ? "amber" : "red"}
                    showValue={false}
                  />
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Topic tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completed */}
        <Card>
          <CardHeader title="Completed Topics" subtitle={`${completedNodes.length} finished`} icon={<CheckCircle2 size={20} />} />
          <CardBody>
            {completedNodes.length > 0 ? (
              <div className="space-y-2">
                {completedNodes.map((node) => (
                  <div key={node.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50/50">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{node.title}</p>
                      <p className="text-xs text-slate-400">{node.estimatedHours} hrs</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No topics completed yet. Start learning!</p>
            )}
          </CardBody>
        </Card>

        {/* Current */}
        <Card>
          <CardHeader title="Current Topic" subtitle="In progress" icon={<PlayCircle size={20} />} />
          <CardBody>
            {currentNode ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle size={18} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-600">Now Learning</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{currentNode.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{currentNode.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="slate">{currentNode.estimatedHours} hrs</Badge>
                  <Badge variant="blue">{currentNode.difficulty}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No current topic.</p>
            )}
          </CardBody>
        </Card>

        {/* Upcoming */}
        <Card>
          <CardHeader title="Upcoming Topics" subtitle={`${upcomingNodes.length} remaining`} icon={<BookOpen size={20} />} />
          <CardBody>
            {upcomingNodes.length > 0 ? (
              <div className="space-y-2">
                {upcomingNodes.slice(0, 5).map((node) => (
                  <div key={node.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100">
                    <BookOpen size={16} className="text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{node.title}</p>
                      <p className="text-xs text-slate-400">{node.estimatedHours} hrs</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No upcoming topics. You're all caught up!</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Assessment history */}
      <Card>
        <CardHeader title="Assessment History" subtitle="All your past assessments" icon={<History size={20} />} />
        <CardBody>
          {sortedDates.length > 0 ? (
            <div className="space-y-5">
              {sortedDates.map((date) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{date}</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {historyByDate[date].map((result, i) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">{result.skillName}</span>
                          <SkillBadge category={result.category} />
                        </div>
                        <div className="flex items-end gap-1">
                          <span className={`text-2xl font-bold ${
                            result.score >= 75 ? "text-emerald-600" :
                            result.score >= 50 ? "text-amber-600" :
                            "text-rose-600"
                          }`}>
                            {result.score}%
                          </span>
                        </div>
                        <ProgressBar
                          value={result.score}
                          color={result.score >= 75 ? "green" : result.score >= 50 ? "amber" : "red"}
                          showValue={false}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No assessment history yet.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
