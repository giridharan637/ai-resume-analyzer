import { buildAnalysis, jobMatchKeywordsFor } from "./resume-analysis";

describe("buildAnalysis", () => {
  test("breakdown sums to resumeScore", () => {
    const a = buildAnalysis("john_doe_resume.pdf", 200_000);
    const b = a.breakdown!;
    expect(b.skills + b.projects + b.experience + b.format + b.keywords).toBe(a.resumeScore);
  });

  test("respects sub-score weight caps", () => {
    const a = buildAnalysis("john_doe_resume.pdf", 200_000);
    const b = a.breakdown!;
    expect(b.skills).toBeLessThanOrEqual(30);
    expect(b.projects).toBeLessThanOrEqual(20);
    expect(b.experience).toBeLessThanOrEqual(20);
    expect(b.format).toBeLessThanOrEqual(15);
    expect(b.keywords).toBeLessThanOrEqual(15);
    expect(b.skills).toBeGreaterThanOrEqual(0);
  });

  test("assigns the right ATS label tier", () => {
    const a = buildAnalysis("strong_resume.pdf", 200_000);
    if (a.atsScore >= 80) expect(a.atsLabel).toBe("Friendly");
    else if (a.atsScore >= 50) expect(a.atsLabel).toBe("Moderate");
    else expect(a.atsLabel).toBe("Not Friendly");
  });

  test("is deterministic for the same inputs", () => {
    const a = buildAnalysis("alex_cv.pdf", 100_000);
    const b = buildAnalysis("alex_cv.pdf", 100_000);
    expect(a.resumeScore).toBe(b.resumeScore);
    expect(a.atsScore).toBe(b.atsScore);
    expect(a.matchedKeywords).toEqual(b.matchedKeywords);
  });

  test("flags legacy .doc format as a warning", () => {
    const a = buildAnalysis("old_resume.doc", 100_000);
    const reasons = a.atsReasons ?? [];
    expect(reasons.some((r) => r.kind === "warn" && /\.doc/i.test(r.text))).toBe(true);
  });

  test("flags very large files as a warning", () => {
    const a = buildAnalysis("resume.pdf", 5 * 1024 * 1024);
    const reasons = a.atsReasons ?? [];
    expect(reasons.some((r) => r.kind === "warn" && /large/i.test(r.text))).toBe(true);
  });

  test("missingElements only contains real issues", () => {
    const a = buildAnalysis("resume.pdf", 200_000);
    for (const m of a.missingElements ?? []) {
      expect(typeof m).toBe("string");
      expect(m.length).toBeGreaterThan(5);
    }
  });

  test("section bars are 0-100", () => {
    const a = buildAnalysis("resume.pdf", 200_000);
    for (const s of a.sections) {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });
});

describe("jobMatchKeywordsFor", () => {
  test("returns role keywords", () => {
    expect(jobMatchKeywordsFor("swe").needed).toContain("TypeScript");
    expect(jobMatchKeywordsFor("da").needed).toContain("SQL");
  });

  test("falls back to swe for unknown roles", () => {
    expect(jobMatchKeywordsFor("nonexistent").needed.length).toBeGreaterThan(0);
  });
});
