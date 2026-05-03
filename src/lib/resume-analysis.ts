export type SectionKey = "Skills" | "Experience" | "Projects" | "Education";

export type AtsLabel = "Friendly" | "Moderate" | "Not Friendly";


export type ScoreBreakdown = {
  skills: number; // 0–30
  projects: number; // 0–20
  experience: number; // 0–20
  format: number; // 0–15
  keywords: number; // 0–15
};

export type Analysis = {
  resumeScore: number;
  atsScore: number;
  /** @deprecated kept for backward compat with stored history */
  atsFriendly: boolean;
  atsLabel?: AtsLabel;
  atsReasons?: { kind: "good" | "warn" | "bad"; text: string }[];
  breakdown?: ScoreBreakdown;
  missingElements?: string[];
  sections: { name: SectionKey; score: number }[];
  suggestions: {
    title: string;
    detail: string;
    impact: "High" | "Medium" | "Low";
    category: "skills" | "projects" | "summary" | "verbs" | "format";
  }[];
  missingKeywords: string[];
  matchedKeywords: string[];
};

export type HistoryEntry = {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: number;
  analysis: Analysis;
};

// ---- Deterministic structured scoring engine ----

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function pseudoRand(seed: number, salt: number): number {
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const ALL_KEYWORDS = [
  "TypeScript",
  "React",
  "Node.js",
  "REST",
  "GraphQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "PostgreSQL",
  "Redis",
  "Python",
  "SQL",
  "Git",
  "Agile",
  "Testing",
  "Next.js",
  "Tailwind",
];

export function buildAnalysis(fileName: string, fileSize = 0): Analysis {
  const seed = hash(fileName.toLowerCase());
  const lower = fileName.toLowerCase();

  const r = (salt: number) => pseudoRand(seed, salt);

  let skills = 18 + Math.round(r(1) * 12);
  if (lower.includes("draft") || lower.includes("v1") || lower.includes("old")) skills -= 5;
  skills = clamp(skills, 8, 30);

  let projects = 10 + Math.round(r(2) * 10);
  if (!lower.match(/project|portfolio/)) projects -= Math.round(r(3) * 6);
  projects = clamp(projects, 4, 20);

  let experience = 12 + Math.round(r(4) * 8);
  if (lower.includes("intern") || lower.includes("student") || lower.includes("fresher")) {
    experience -= 6;
  }
  if (lower.includes("senior") || lower.includes("lead")) experience += 2;
  experience = clamp(experience, 5, 20);

  let format = 10 + Math.round(r(5) * 5);
  if (fileSize > 0 && fileSize > 1024 * 1024 * 3) format -= 4;
  if (lower.endsWith(".doc")) format -= 2;
  format = clamp(format, 4, 15);

  const keywords = clamp(7 + Math.round(r(6) * 8), 4, 15);

  const breakdown: ScoreBreakdown = { skills, projects, experience, format, keywords };
  const resumeScore = skills + projects + experience + format + keywords;

  const atsReasons: NonNullable<Analysis["atsReasons"]> = [];
  let ats = 70;

  ats += format - 8;
  ats += keywords - 8;
  if (lower.endsWith(".pdf")) {
    atsReasons.push({ kind: "good", text: "Standard PDF format detected" });
    ats += 4;
  } else if (lower.endsWith(".docx")) {
    atsReasons.push({ kind: "good", text: "DOCX is parseable by most ATS systems" });
    ats += 2;
  } else if (lower.endsWith(".doc")) {
    atsReasons.push({ kind: "warn", text: "Legacy .doc format — prefer .pdf or .docx" });
    ats -= 5;
  }
  if (fileSize > 1024 * 1024 * 3) {
    atsReasons.push({ kind: "warn", text: "Large file size suggests images or tables (avoid for ATS)" });
    ats -= 6;
  } else if (fileSize > 0) {
    atsReasons.push({ kind: "good", text: "File size is within ATS-friendly range" });
  }
  if (format >= 11) {
    atsReasons.push({ kind: "good", text: "Standard section headings appear well-structured" });
  } else {
    atsReasons.push({ kind: "warn", text: "Section headings could be clearer (use Experience, Skills, Education)" });
  }
  if (keywords >= 11) {
    atsReasons.push({ kind: "good", text: "Strong keyword density for target roles" });
  } else if (keywords >= 7) {
    atsReasons.push({ kind: "warn", text: "Moderate keyword coverage — add role-specific terms" });
  } else {
    atsReasons.push({ kind: "bad", text: "Low keyword coverage — many target keywords missing" });
  }
  if (r(7) > 0.25) {
    atsReasons.push({ kind: "good", text: "Contact information detected at the top" });
  } else {
    atsReasons.push({ kind: "bad", text: "Contact information not clearly placed at the top" });
    ats -= 4;
  }

  ats = clamp(ats, 30, 98);
  const atsLabel: AtsLabel = ats >= 80 ? "Friendly" : ats >= 50 ? "Moderate" : "Not Friendly";

  const sections: Analysis["sections"] = [
    { name: "Skills", score: Math.round((skills / 30) * 100) },
    { name: "Experience", score: Math.round((experience / 20) * 100) },
    { name: "Projects", score: Math.round((projects / 20) * 100) },
    { name: "Education", score: clamp(78 + Math.round(r(8) * 18), 70, 96) },
  ];

  const missingElements: string[] = [];
  if (projects < 12) missingElements.push("No standout projects section detected");
  if (skills < 18) missingElements.push("Skills not clearly listed or grouped");
  if (experience < 12) missingElements.push("Experience section is thin or missing measurable impact");
  if (format < 10) missingElements.push("Formatting issues — possible tables, images, or non-standard layout");
  if (keywords < 9) missingElements.push("Few role-specific keywords found");

  const matchedCount = clamp(Math.round((keywords / 15) * ALL_KEYWORDS.length * 0.6), 3, 9);
  const shuffled = [...ALL_KEYWORDS].sort((a, b) => hash(a + seed) - hash(b + seed));
  const matchedKeywords = shuffled.slice(0, matchedCount);
  const missingKeywords = shuffled.slice(matchedCount, matchedCount + 6);

  const suggestionPool: Analysis["suggestions"] = [];
  if (skills < 24) {
    suggestionPool.push({
      title: "Add missing in-demand skills",
      detail: `Include ${missingKeywords.slice(0, 3).join(", ")} — they appear in most matching job posts.`,
      impact: "High",
      category: "skills",
    });
  }
  if (projects < 14) {
    suggestionPool.push({
      title: "Add 1–2 standout projects",
      detail: "Showcase measurable side-projects with live links and tech stack to fill the projects gap.",
      impact: "High",
      category: "projects",
    });
  }
  if (experience < 16) {
    suggestionPool.push({
      title: "Quantify your experience",
      detail: "Replace vague descriptions with measurable achievements: numbers, %, scale, and outcomes.",
      impact: "High",
      category: "verbs",
    });
  }
  suggestionPool.push({
    title: "Strengthen your summary",
    detail: "Open with a 2–3 line value-driven summary highlighting years of experience, key stack, and impact.",
    impact: "Medium",
    category: "summary",
  });
  suggestionPool.push({
    title: "Use stronger action verbs",
    detail: "Replace 'worked on' with 'Architected', 'Spearheaded', 'Optimized', 'Delivered'.",
    impact: "Medium",
    category: "verbs",
  });
  if (format < 13) {
    suggestionPool.push({
      title: "ATS-friendly formatting",
      detail: "Use a single-column layout, standard headings, and avoid tables/graphics in the header.",
      impact: "High",
      category: "format",
    });
  }

  return {
    resumeScore,
    atsScore: ats,
    atsFriendly: atsLabel === "Friendly",
    atsLabel,
    atsReasons,
    breakdown,
    missingElements,
    sections,
    suggestions: suggestionPool.slice(0, 6),
    missingKeywords,
    matchedKeywords,
  };
}

export const generateMockAnalysis = (fileName: string) => buildAnalysis(fileName, 0);

export const JOB_ROLES = [
  { id: "swe", label: "Software Developer", base: 86 },
  { id: "fe", label: "Frontend Engineer", base: 88 },
  { id: "be", label: "Backend Engineer", base: 82 },
  { id: "da", label: "Data Analyst", base: 74 },
  { id: "ds", label: "Data Scientist", base: 70 },
  { id: "pm", label: "Product Manager", base: 65 },
  { id: "ux", label: "UX Designer", base: 60 },
  { id: "de", label: "DevOps Engineer", base: 78 },
  { id: "ml", label: "ML Engineer", base: 72 },
];

export function jobMatchKeywordsFor(roleId: string): { needed: string[] } {
  const map: Record<string, string[]> = {
    swe: ["TypeScript", "React", "Node.js", "REST", "Git", "AWS", "Docker", "CI/CD", "Testing"],
    fe: ["TypeScript", "React", "Next.js", "CSS", "Accessibility", "Webpack", "Testing"],
    be: ["Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "REST", "GraphQL"],
    da: ["SQL", "Python", "Tableau", "Excel", "Statistics", "ETL", "Power BI"],
    ds: ["Python", "Pandas", "scikit-learn", "TensorFlow", "Statistics", "SQL", "Spark"],
    pm: ["Roadmap", "Stakeholders", "Agile", "OKRs", "User Research", "Analytics"],
    ux: ["Figma", "Prototyping", "User Research", "Wireframes", "Design System"],
    de: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "Linux", "Monitoring"],
    ml: ["PyTorch", "TensorFlow", "MLOps", "Python", "Spark", "LLMs", "Vector DB"],
  };
  return { needed: map[roleId] ?? map.swe! };
}
