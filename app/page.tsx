"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, UploadCloud } from "lucide-react";
import { reviews, type Review } from "@/lib/data";
import { mergeReviews, readDecisions, readLocalReviews, REVIEW_UPDATED_EVENT } from "@/lib/review-state";

export default function Dashboard() {
  const [items, setItems] = useState<Review[]>(reviews);

  function load() {
    setItems(mergeReviews(reviews, readLocalReviews(), readDecisions()));
  }

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("storage", handler);
    window.addEventListener(REVIEW_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(REVIEW_UPDATED_EVENT, handler);
    };
  }, []);

  const counts = useMemo(() => ({
    awaiting: items.filter((r) => r.status === "Needs Review" || r.status === "Mismatch").length,
    passed: items.filter((r) => r.status === "Passed" || r.status === "Accepted").length,
    attention: items.filter((r) => r.status === "Needs Review" || r.status === "Mismatch" || r.status === "Issue").length,
    accepted: items.filter((r) => r.status === "Accepted").length,
    rejected: items.filter((r) => r.status === "Issue").length,
  }), [items]);

  return <div className="content"><div className="page-head"><div><div className="eyebrow">Compliance Operations</div><h1>Good morning, Jamie</h1><p className="subtitle">Review label applications with clear, explainable checks.</p></div><Link className="btn primary" href="/review/new"><UploadCloud size={16}/>New review</Link></div>
    <div className="grid-4"><div className="card stat"><div className="stat-label">Awaiting review</div><div className="stat-value">{counts.awaiting}</div><div className="stat-meta">Open discrepancies</div></div><div className="card stat"><div className="stat-label">Processed today</div><div className="stat-value">{86 + counts.accepted + counts.rejected}</div><div className="stat-meta">Includes recorded agent decisions</div></div><div className="card stat"><div className="stat-label">Passed automatically</div><div className="stat-value">{counts.passed + 68}</div><div className="stat-meta">Accepted decisions included</div></div><div className="card stat"><div className="stat-label">Needs attention</div><div className="stat-value">{counts.attention}</div><div className="stat-meta">Unresolved flags + rejected reviews</div></div></div>
    <section className="section"><div className="section-head"><div className="section-title">Recent applications</div><Link href="/applications" className="btn">View all <ArrowRight size={14}/></Link></div><div className="card"><table className="table"><thead><tr><th>Application</th><th>Applicant</th><th>Brand</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>{items.map(r=><tr key={r.id}><td><strong>{r.id}</strong></td><td>{r.applicant}</td><td>{r.brand}</td><td>{r.submitted}</td><td><span className={`badge ${r.status==="Passed"||r.status==="Accepted"?"green":r.status==="Mismatch"||r.status==="Issue"?"red":"amber"}`}>{r.status}</span></td><td><Link href={`/review/${r.id}`} className="btn">Review</Link></td></tr>)}</tbody></table></div></section>
    <section className="section"><div className="section-head"><div className="section-title">Batch review</div></div><div className="card"><div className="batch-bar"><div><strong>Importer batch #1042</strong><div className="subtitle" style={{marginTop:4}}>12 applications · agent decisions sync automatically</div></div><div style={{width:180}}><div className="progress"><span style={{width:`${Math.min(100, Math.round((counts.passed / Math.max(items.length, 1)) * 100))}%`}}/></div></div><Link href="/batch/1042" className="btn">Open batch</Link></div></div></section>
  </div>;
}
