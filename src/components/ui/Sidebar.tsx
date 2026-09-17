import type { PageKey } from "@/types";
import {
  LayoutDashboard,
  UserCircle,
  ClipboardList,
  BarChart3,
  SplitSquareVertical,
  Sparkles,
  Route,
  TrendingUp,
  Brain,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { key: "profile", label: "Profile", icon: <UserCircle size={20} /> },
  { key: "assessment", label: "Assessment", icon: <ClipboardList size={20} /> },
  { key: "performance", label: "Performance", icon: <BarChart3 size={20} /> },
  { key: "skillgaps", label: "Skill Gaps", icon: <SplitSquareVertical size={20} /> },
  { key: "recommendations", label: "AI Recommendations", icon: <Sparkles size={20} /> },
  { key: "learningpath", label: "Learning Path", icon: <Route size={20} /> },
  { key: "progress", label: "Progress", icon: <TrendingUp size={20} /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { currentPage, setCurrentPage, profile, overallProgress } = useApp();

  const handleNav = (page: PageKey) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 z-40 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight">
                PersonalLearn
              </h1>
              <p className="text-xs text-slate-500 font-medium">AI Learning Agent</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile summary */}
        <div className="px-3 py-4 border-t border-slate-200">
          <div className="px-3 py-3 rounded-xl bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                {profile.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {profile.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Goal: {profile.learningGoal}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 font-medium">Overall Progress</span>
              <span className="font-semibold text-slate-900">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
