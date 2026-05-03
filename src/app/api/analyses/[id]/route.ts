import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json({ error: "userEmail required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", id)
      .eq("user_email", userEmail);

    if (error) {
      console.error("Supabase DELETE by ID error:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/analyses/[id] error:", error);
    return NextResponse.json({ ok: true }); // Graceful failure
  }
}
