const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface ApiProfile {
  id: string;
  user_id: string;
  target_goals: string[];
  preferred_format: string;
  learning_pace: string;
  ability_score: number;
  mastery_map: Record<string, number>;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

export interface ApiAssessmentResult {
  is_correct: boolean;
  correct_option_index: number;
  previous_theta: number;
  new_theta: number;
  previous_mastery: number;
  new_mastery: number;
  concept_id: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(body?.detail ?? `API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ id: string; email: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: async (email: string, password: string) => {
    const result = await request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("learn-jam-token", result.access_token);
    return result.access_token;
  },

  logout: () => localStorage.removeItem("learn-jam-token"),

  getToken: () => localStorage.getItem("learn-jam-token"),

  getProfile: (token: string) => request<ApiProfile>("/profile/me", {}, token),

  updateProfile: (token: string, profile: {
    target_goals: string[];
    preferred_format: string;
    learning_pace: string;
  }) => request<ApiProfile>("/profile/me", {
    method: "PUT",
    body: JSON.stringify(profile),
  }, token),

  submitAnswer: (token: string, answer: {
    question_id: string;
    concept_id: string;
    selected_option_index: number;
    correct_option_index: number;
    difficulty: number;
    discrimination: number;
  }) => request<ApiAssessmentResult>("/learning/submit-answer", {
    method: "POST",
    body: JSON.stringify(answer),
  }, token),
};
