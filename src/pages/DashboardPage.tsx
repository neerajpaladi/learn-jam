import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SkillBadge, Badge, DifficultyBadge } from "@/components/ui/Badge";
import { PerformanceChart } from "@/components/ui/Charts";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Target,
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Flame,
  Brain,
} from "lucide-react";
import type { PageKey } from "@/types";

const insightIcons: Record<string, React.ReactNode> = {
  Award: <Award size={20} />,
  AlertTriangle: <AlertTriangle size={20} />,
  Target: <Target size={20} />,
  Sparkles: <Sparkles size={20} />,
  Clock: <Clock size={20} />,
};

export function DashboardPage() {
  const { profile, scores, skillGaps, recommendations, aiInsights, learningPath, overallProgress, completedTopics, setCurrentPage } = useApp();

  const strongSkills = scores.filter((s) => s.category === "Strong");
  const weakSkills = scores.filter((s) => s.category === "Needs Improvement");
  const currentNode = learningPath.find((n) => n.isCurrent);
  const upcomingTopics = learningPath.filter((n) => !n.completed && !n.isCurrent).slice(0, 3);

  const goTo = (page: PageKey) => setCurrentPage(page);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-6 sm:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-300/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={18} className="text-cyan-200" />
            <span className="text-sm font-medium text-blue-100">AI Agent Analysis Complete</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Welcome back, {profile.name}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
            Your personalized learning path for <span className="font-semibold text-white">{profile.learningGoal}</span> is ready.
            {weakSkills.length > 0 && ` The AI has identified ${weakSkills.length} skill gap${weakSkills.length > 1 ? "s" : ""} to focus on.`}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => goTo("assessment")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-medium text-sm hover:bg-blue-50 transition-colors"
            >
              Take Assessment <ArrowRight size={16} />
            </button>
            <button
              onClick={() => goTo("learningpath")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/30 text-white font-medium text-sm hover:bg-blue-500/40 transition-colors border border-white/20"
            >
              View Learning Path <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={22} />}
          label="Overall Progress"
          value={`${overallProgress}%`}
          color="blue"
        />
        <StatCard
          icon={<Award size={22} />}
          label="Strong Skills"
          value={strongSkills.length.toString()}
          color="green"
        />
        <StatCard
          icon={<AlertTriangle size={22} />}
          label="Skill Gaps"
          value={skillGaps.length.toString()}
          color="red"
        />
        <StatCard
          icon={<CheckCircle2 size={22} />}
          label="Topics Completed"
          value={`${completedTopics.length}/${learningPath.length}`}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Skill Performance" subtitle="Current assessment scores" icon={<BarChartIcon />} />
          <CardBody>
            <PerformanceChart scores={scores} />
          </CardBody>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader
            title="AI Insights"
            subtitle="Personalized analysis"
            icon={<Sparkles size={20} />}
          />
          <CardBody className="space-y-3">
            {aiInsights.slice(0, 3).map((insight, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  insight.type === "strength"
                    ? "bg-emerald-50 border-emerald-200"
                    : insight.type === "weakness"
                    ? "bg-rose-50 border-rose-200"
                    : insight.type === "plan"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-slate-600 mt-0.5 shrink-0">
                    {insightIcons[insight.icon] || <Sparkles size={18} />}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 mb-0.5">
                      {insight.title}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => goTo("recommendations")}
              className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 pt-1"
            >
              View all recommendations <ArrowRight size={14} />
            </button>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current topic */}
        <Card>
          <CardHeader
            title="Current Topic"
            subtitle="What to learn next"
            icon={<BookOpen size={20} />}
          />
          <CardBody>
            {currentNode ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{currentNode.title}</h4>
                    <DifficultyBadge level={currentNode.difficulty} />
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{currentNode.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentNode.skillsCovered.map((skill) => (
                      <Badge key={skill} variant="blue">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Estimated time: {currentNode.estimatedHours} hours</span>
                  <button
                    onClick={() => goTo("learningpath")}
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Go to path →
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">All topics completed!</p>
            )}
          </CardBody>
        </Card>

        {/* Upcoming topics */}
        <Card>
          <CardHeader
            title="Upcoming Topics"
            subtitle="Next in your journey"
            icon={<Flame size={20} />}
          />
          <CardBody>
            <div className="space-y-3">
              {upcomingTopics.length > 0 ? upcomingTopics.map((topic) => (
                <div key={topic.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{topic.title}</p>
                    <p className="text-xs text-slate-500">{topic.estimatedHours} hours</p>
                  </div>
                  <DifficultyBadge level={topic.difficulty} />
                </div>
              )) : (
                <p className="text-sm text-slate-500">No upcoming topics — you're all caught up!</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Skill overview */}
      <Card>
        <CardHeader title="Skill Overview" subtitle="All assessed skills" icon={<Target size={20} />} />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scores.map((score) => (
              <div key={score.skillName} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{score.skillName}</span>
                    <SkillBadge category={score.category} />
                  </div>
                  <ProgressBar
                    value={score.score}
                    color={score.category === "Strong" ? "green" : score.category === "Moderate" ? "amber" : "red"}
                    showValue={false}
                  />
                </div>
                <span className="text-lg font-bold text-slate-900 w-12 text-right">{score.score}%</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "green" | "red" | "amber";
}) {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600" },
    green: { bg: "bg-emerald-50", text: "text-emerald-600" },
    red: { bg: "bg-rose-50", text: "text-rose-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600" },
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl ${colorMap[color].bg} ${colorMap[color].text} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function BarChartIcon() {
  return <TrendingUp size={20} />;
}
