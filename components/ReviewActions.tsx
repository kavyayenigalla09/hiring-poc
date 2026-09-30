"use client";

import { useState } from "react";
import { CheckCircle2, Flag, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveDecision, type DecisionStatus } from "@/lib/review-state";

export default function ReviewActions({ id }: { id: string }) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function decide(status: DecisionStatus) {
    setSaving(true);
    saveDecision(id, status);
    await new Promise((resolve) => setTimeout(resolve, 350));
    router.push(`/applications?updated=${id}&decision=${status}`);
  }

  if (saving) return <button className="btn primary" disabled><Loader2 size={15} className="spin" />Saving…</button>;
  return <div className="toolbar-actions">
    <button className="btn" onClick={() => decide("Issue")}><Flag size={15} />Reject review</button>
    <button className="btn primary" onClick={() => decide("Accepted")}><CheckCircle2 size={15} />Accept review</button>
  </div>;
}
