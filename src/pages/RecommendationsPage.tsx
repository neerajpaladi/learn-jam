import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  BookOpen,
  Video,
  FileText,
  Code2,
  HelpCircle,
  FolderGit2,
  ExternalLink,
  Brain,
  Zap,
  Lightbulb,
  Target,
  Clock,
  Award,
  AlertTriangle,
} from "lucide-react";
import type { Resource } from "@/types";

const resourceIcons: Record<Resource["type"], React.ReactNode> = {
  Tutorial: <BookOpen size={18} />,
  Video: <Video size={18} />,
  Documentation: <FileText size={18} />,
  Practice: <Code2 size={18} />,
  Quiz: <HelpCircle size={18} />,
  Project: <FolderGit2 size={18} />,
};

const insightIcons: Record<string, React.ReactNode> = {
  Award: <Award size={20} />,
  AlertTriangle: <AlertTriangle size={20} />,
  Target: <Target size={20} />,
  Sparkles: <Sparkles size={20} />,
  Clock: <Clock size={20} />,
};

export function RecommendationsPage() {
  const { recommendations, aiInsights, profile } = useApp();

  return (
    <div className="space-y-6">
      {/* AI Agent banner */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Brain size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">AI Recommendation Engine</h3>
            <p className="text-sm text-blue-50">
              The system analyzed your profile, assessment scores, learning goal, skill gaps, and
              learning preferences to generate these personalized recommendations. Difficulty
              levels adapt automatically based on your performance.
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-blue-500" />
          AI Insights & Explanations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {aiInsights.map((insight, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  insight.type === "strength" ? "bg-emerald-50 text-emerald-600" :
                  insight.type === "weakness" ? "bg-rose-50 text-rose-600" :
                  insight.type === "plan" ? "bg-blue-50 text-blue-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  {insightIcons[insight.icon] || <Sparkles size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">{insight.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Resource recommendations */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-500" />
          Recommended Learning Resources
        </h3>
        {recommendations.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-slate-500">No recommendations yet. Complete an assessment to get personalized resources.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec) => (
              <Card key={rec.skill}>
                <CardHeader
                  title={rec.skill}
                  subtitle={`${rec.resources.length} resources at ${rec.difficulty} level`}
                  icon={<BookOpen size={20} />}
                  action={<DifficultyBadge level={rec.difficulty} />}
                />
                <CardBody>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rec.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                            {resourceIcons[resource.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="slate">{resource.type}</Badge>
                              <span className="text-xs text-slate-400">{resource.duration}</span>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                              {resource.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-2">
                              {resource.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>{resource.provider}</span>
                              <ExternalLink size={12} />
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty adaptation explanation */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-1">How Difficulty Adapts</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              The system automatically adjusts resource difficulty based on your assessment scores:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 mb-1">
                  <DifficultyBadge level="Beginner" />
                  <span className="text-xs text-slate-500">0-49%</span>
                </div>
                <p className="text-xs text-slate-600">Foundational resources for building core concepts</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <DifficultyBadge level="Intermediate" />
                  <span className="text-xs text-slate-500">50-74%</span>
                </div>
                <p className="text-xs text-slate-600">Deeper dives and practical application</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <div className="flex items-center gap-2 mb-1">
                  <DifficultyBadge level="Advanced" />
                  <span className="text-xs text-slate-500">75-100%</span>
                </div>
                <p className="text-xs text-slate-600">Complex projects and specialization</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
