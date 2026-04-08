export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  location: string;
  maxDistanceKm: number;
  availability: string;
  languages: string[];
}

export interface Need {
  id: string;
  rawReport: string;
  title: string;
  category: string;
  location: string;
  urgency: number; // 1–5
  requiredSkills: string[];
  peopleNeeded: number;
  status: "open" | "matched" | "closed";
}

export interface MatchResult {
  needId: string;
  volunteerId: string;
  score: number;
  reason: string;
}