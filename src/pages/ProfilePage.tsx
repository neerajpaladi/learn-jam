import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  educationLevels,
  branches,
  years,
  learningGoals,
  skillLevels,
  learningStyles,
  interestAreas,
} from "@/data/demoData";
import type { StudentProfile } from "@/types";
import {
  UserCircle,
  GraduationCap,
  BookOpen,
  Target,
  Lightbulb,
  BarChart2,
  Eye,
  Clock,
  Check,
  Save,
} from "lucide-react";

export function ProfilePage() {
  const { profile, setProfile, setHasProfile } = useApp();
  const [form, setForm] = useState<StudentProfile>(profile);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      areasOfInterest: prev.areasOfInterest.includes(interest)
        ? prev.areasOfInterest.filter((i) => i !== interest)
        : [...prev.areasOfInterest, interest],
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setProfile(form);
    setHasProfile(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader
          title="Student Profile"
          subtitle="Tell the AI agent about yourself to get personalized recommendations"
          icon={<UserCircle size={20} />}
        />
        <CardBody className="space-y-6">
          {/* Name */}
          <Field label="Full Name" icon={<UserCircle size={16} />}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </Field>

          {/* Education Level & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Education Level" icon={<GraduationCap size={16} />}>
              <Select value={form.educationLevel} onChange={(v) => update("educationLevel", v)} options={educationLevels} />
            </Field>
            <Field label="Branch" icon={<BookOpen size={16} />}>
              <Select value={form.branch} onChange={(v) => update("branch", v)} options={branches} />
            </Field>
          </div>

          {/* Year */}
          <Field label="Year" icon={<GraduationCap size={16} />}>
            <Select value={form.year} onChange={(v) => update("year", v)} options={years} />
          </Field>

          {/* Learning Goal */}
          <Field label="Learning Goal" icon={<Target size={16} />}>
            <Select value={form.learningGoal} onChange={(v) => update("learningGoal", v)} options={learningGoals} />
          </Field>

          {/* Areas of Interest */}
          <Field label="Areas of Interest" icon={<Lightbulb size={16} />}>
            <div className="flex flex-wrap gap-2">
              {interestAreas.map((interest) => {
                const selected = form.areasOfInterest.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "bg-white text-slate-600 border border-slate-300 hover:border-blue-400"
                    }`}
                  >
                    {selected && <Check size={14} className="inline mr-1" />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Current Skill Level */}
          <Field label="Current Skill Level" icon={<BarChart2 size={16} />}>
            <Select value={form.currentSkillLevel} onChange={(v) => update("currentSkillLevel", v)} options={skillLevels} />
          </Field>

          {/* Preferred Learning Style */}
          <Field label="Preferred Learning Style" icon={<Eye size={16} />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {learningStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => update("preferredLearningStyle", style)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    form.preferredLearningStyle === style
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-slate-300 text-slate-600 hover:border-blue-400"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </Field>

          {/* Study Hours */}
          <Field label="Available Study Hours Per Day" icon={<Clock size={16} />}>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={form.studyHoursPerDay}
                  onChange={(e) => update("studyHoursPerDay", Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <div className="flex items-center gap-1 w-20 justify-end">
                  <span className="text-2xl font-bold text-slate-900">{form.studyHoursPerDay}</span>
                  <span className="text-sm text-slate-500">hrs</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>1 hr</span>
                <span>4 hrs</span>
                <span>8 hrs</span>
              </div>
            </div>
          </Field>

          {/* Save button */}
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} size="lg">
              {saved ? (
                <><Check size={18} /> Profile Saved!</>
              ) : (
                <><Save size={18} /> Save Profile</>
              )}
            </Button>
            {saved && (
              <Badge variant="green">AI agent updated with your profile</Badge>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
