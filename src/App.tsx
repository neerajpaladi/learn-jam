import { useState } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/ui/Sidebar";
import { TopBar } from "@/components/ui/TopBar";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AssessmentPage } from "@/pages/AssessmentPage";
import { PerformancePage } from "@/pages/PerformancePage";
import { SkillGapsPage } from "@/pages/SkillGapsPage";
import { RecommendationsPage } from "@/pages/RecommendationsPage";
import { LearningPathPage } from "@/pages/LearningPathPage";
import { ProgressPage } from "@/pages/ProgressPage";

function AppContent() {
  const { currentPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "profile":
        return <ProfilePage />;
      case "assessment":
        return <AssessmentPage />;
      case "performance":
        return <PerformancePage />;
      case "skillgaps":
        return <SkillGapsPage />;
      case "recommendations":
        return <RecommendationsPage />;
      case "learningpath":
        return <LearningPathPage />;
      case "progress":
        return <ProgressPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} currentPage={currentPage} />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
