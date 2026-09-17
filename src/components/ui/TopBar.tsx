import type { PageKey } from "@/types";
import { Menu, Brain } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
  currentPage: PageKey;
}

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Your personalized learning overview" },
  profile: { title: "Student Profile", subtitle: "Manage your learning profile" },
  assessment: { title: "Skill Assessment", subtitle: "Test your knowledge and get scored" },
  performance: { title: "Performance Analysis", subtitle: "Detailed breakdown of your skills" },
  skillgaps: { title: "Skill Gap Identification", subtitle: "AI-identified gaps and priorities" },
  recommendations: { title: "AI Recommendations", subtitle: "Personalized learning resources" },
  learningpath: { title: "Personalized Learning Path", subtitle: "Your visual roadmap to mastery" },
  progress: { title: "Progress Tracking", subtitle: "Track your learning journey over time" },
};

export function TopBar({ onMenuClick, currentPage }: TopBarProps) {
  const { title, subtitle } = pageTitles[currentPage];

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 hidden sm:block">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
            <Brain size={16} />
            AI Agent Active
          </div>
        </div>
      </div>
    </header>
  );
}
