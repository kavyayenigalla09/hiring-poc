"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Flag, Play, RefreshCw } from "lucide-react";
import { reviews, type Review } from "@/lib/data";
import { applyDecision, readDecisions, REVIEW_UPDATED_EVENT } from "@/lib/review-state";

export default function Batch() {
  const params = useParams<{ id: string }>();
  const [id, setId] = useState(params.id || "");
  const [items, setItems] = useState<Review[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    function load() {
      const nextId = params.id;
      if (!nextId) return;
      setId(nextId);
      const decisions = readDecisions();
      const raw = localStorage.getItem(`ttb-batch-${nextId}`);
      if (!raw) {
        setItems(Array.from(new Map(reviews.map((item) => [item.id, applyDecision(item, decisions)])).values()));
        return;
      }
      const batch = JSON.parse(raw) as { items?: string[] };
      const reviewIds = Array.from(new Set(batch.items ?? []));
      const loaded = reviewIds.map((reviewId) => JSON.parse(localStorage.getItem(`ttb-review-${reviewId}`) || "null")).filter(Boolean) as Review[];
      const unique = Array.from(new Map(loaded.map((item) => [item.id, applyDecision(item, decisions)])).values());
      setItems(unique);
    }
    load();
    window.addEventListener(REVIEW_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(REVIEW_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [params.id]);

  const counts = useMemo(() => ({
    passed: items.filter((r) => r.status === "Passed" || r.status === "Accepted").length,
    review: items.filter((r) => r.status === "Needs Review").length,
    mismatch: items.filter((r) => r.status === "Mismatch" || r.status === "Issue").length,
    accepted: items.filter((r) => r.status === "Accepted").length,
    rejected: items.filter((r) => r.status === "Issue").length,
  }), [items]);
  const complete = items.length ? Math.round((counts.passed / items.length) * 100) : 0;

  async function processRemaining() { setProcessing(true); await new Promise((resolve) => setTimeout(resolve, 900)); setProcessing(false); }

  return <div className="content"><div className="page-head"><div><Link href="/" className="btn ghost"><ArrowLeft size={14} />Dashboard</Link><div className="eyebrow" style={{ marginTop: 20 }}>Batch review</div><h1>Importer batch #{id}</h1><p className="subtitle">{items.length} applications · {counts.passed} passed/accepted · {counts.review + counts.mismatch} require attention</p></div><button className="btn primary" onClick={processRemaining} disabled={processing}>{processing ? <><RefreshCw size={15} className="spin" />Processing…</> : <><Play size={15} />Process remaining</>}</button></div>
    <div className="card"><div className="batch-bar"><div><strong>Batch progress</strong><div className="subtitle" style={{ marginTop: 4 }}>{complete}% of applications are passed or accepted</div></div><div style={{ width: 300 }}><div className="progress"><span style={{ width: `${complete}%` }} /></div></div></div><div className="batch-summary"><div><CheckCircle2 size={17} /><strong>{counts.passed}</strong><span>Passed / accepted</span></div><div><Flag size={17} /><strong>{counts.review}</strong><span>Needs review</span></div><div><Flag size={17} /><strong>{counts.mismatch}</strong><span>Mismatch / rejected</span></div></div><table className="table"><thead><tr><th>Application</th><th>Brand</th><th>Status</th><th>Checks</th><th></th></tr></thead><tbody>{items.map((r, index) => <tr key={`batch-row-${r.id}-${index}`}><td><strong>{r.id}</strong></td><td>{r.brand}</td><td><span className={`badge ${r.status === "Passed" || r.status === "Accepted" ? "green" : r.status === "Mismatch" || r.status === "Issue" ? "red" : "amber"}`}>{r.status}</span></td><td>{r.checks.filter((c) => c.status !== "Passed").length ? `${r.checks.filter((c) => c.status !== "Passed").length} flag` : "5 / 5 pass"}</td><td><Link href={`/review/${r.id}`} className="btn">Review</Link></td></tr>)}</tbody></table></div>
  </div>;
}
