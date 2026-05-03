import { ResumeAnalyzer } from "@/components/resume/ResumeAnalyzer";

export default function AnalyzerPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">Resume</span> Analyzer
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload your resume and get an instant AI-powered breakdown.
        </p>
      </div>
      <ResumeAnalyzer />
    </div>
  );
}
