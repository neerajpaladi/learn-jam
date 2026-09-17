import type { SkillCategory, DifficultyLevel } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "green" | "amber" | "red" | "slate" | "purple";
}

const variantMap = {
  default: "bg-slate-100 text-slate-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-rose-100 text-rose-700",
  slate: "bg-slate-100 text-slate-600",
  purple: "bg-violet-100 text-violet-700",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${variantMap[variant]}`}
    >
      {children}
    </span>
  );
}

export function SkillBadge({ category }: { category: SkillCategory }) {
  const variant = category === "Strong" ? "green" : category === "Moderate" ? "amber" : "red";
  return <Badge variant={variant}>{category}</Badge>;
}

export function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const variant = level === "Beginner" ? "green" : level === "Intermediate" ? "amber" : "red";
  return <Badge variant={variant}>{level}</Badge>;
}
