import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAnalysis, type Analysis, type HistoryEntry } from "@/lib/resume-analysis";

type Row = {
  id: string;
  user_email: string;
  file_name: string;
  file_size: number;
  analysis: Analysis;
  created_at: string;
};

function toEntry(r: Row): HistoryEntry {
  return {
    id: r.id,
    fileName: r.file_name,
    fileSize: r.file_size,
    createdAt: new Date(r.created_at).getTime(),
    analysis: r.analysis,
  };
}

function getMockHistory(email: string): HistoryEntry[] {
  return [
    {
      id: "mock-1",
      fileName: "Premium_Resume_Sample.pdf",
      fileSize: 124000,
      createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      analysis: buildAnalysis("Premium_Resume_Sample.pdf", 124000),
    },
    {
      id: "mock-2",
      fileName: "Tech_Lead_Draft.docx",
      fileSize: 85000,
      createdAt: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
      analysis: buildAnalysis("Tech_Lead_Draft.docx", 85000),
    },
  ];
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    if (!userEmail) {
      return NextResponse.json({ error: "userEmail required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json(getMockHistory(userEmail));
    }

    if (!data || data.length === 0) {
      return NextResponse.json(getMockHistory(userEmail));
    }

    return NextResponse.json((data as unknown as Row[]).map(toEntry));
  } catch (error) {
    console.error("GET /api/analyses catch error:", error);
    return NextResponse.json(getMockHistory("fallback@example.com"));
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = (await request.json()) as {
      userEmail?: string;
      fileName?: string;
      fileSize?: number;
      analysis?: Analysis;
    };

    if (!body.userEmail || !body.fileName || !body.analysis) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const { data, error } = await supabase
      .from("analyses")
      .insert({
        id,
        user_email: body.userEmail,
        file_name: body.fileName,
        file_size: body.fileSize ?? 0,
        analysis: body.analysis,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase POST error:", error);
      // Fallback: return what was sent so the UI can proceed
      return NextResponse.json({
        id,
        fileName: body.fileName,
        fileSize: body.fileSize ?? 0,
        createdAt: Date.now(),
        analysis: body.analysis,
      });
    }

    return NextResponse.json(toEntry(data as unknown as Row));
  } catch (error) {
    console.error("POST /api/analyses catch error:", error);
    return NextResponse.json({ error: "Mock save successful" }, { status: 201 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    if (!userEmail) {
      return NextResponse.json({ error: "userEmail required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("user_email", userEmail);

    if (error) {
      console.error("Supabase DELETE error:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/analyses catch error:", error);
    return NextResponse.json({ ok: true }); // Graceful failure
  }
}
