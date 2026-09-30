"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, CheckCircle2, RefreshCw } from "lucide-react";
import { reviews, type Review } from "@/lib/data";
import { mergeReviews, readDecisions, readLocalReviews, REVIEW_UPDATED_EVENT } from "@/lib/review-state";

export default function Applications() {
  const [items, setItems] = useState<Review[]>(reviews);
  const [message, setMessage] = useState("");

  function load() {
    const merged = mergeReviews(reviews, readLocalReviews(), readDecisions());
    setItems(merged);
    const params = new URLSearchParams(window.location.search);
    const updated = params.get("updated");
    const decision = params.get("decision");
    if (updated) setMessage(`${updated} was ${decision === "Accepted" ? "accepted and recorded" : "rejected and recorded"}.`);
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

  return <div className="content"><div className="page-head"><div><div className="eyebrow">Work queue</div><h1>Applications</h1><p className="subtitle">All prototype reviews and their current status.</p></div><div className="toolbar-actions"><button className="btn" onClick={load}><RefreshCw size={15} />Refresh</button><Link href="/review/new" className="btn primary"><Plus size={16} />New review</Link></div></div>
    {message && <div className="success-panel queue-success"><CheckCircle2 size={18} /><div><strong>{message}</strong><p>The agent decision is stored locally and reflected across the prototype.</p></div></div>}
    <div className="card"><table className="table"><thead><tr><th>Application</th><th>Applicant</th><th>Beverage</th><th>Brand</th><th>Status</th><th></th></tr></thead><tbody>{items.map((review) => { const tone = review.status === "Accepted" || review.status === "Passed" ? "green" : review.status === "Issue" || review.status === "Mismatch" ? "red" : "amber"; return <tr key={review.id}><td><strong>{review.id}</strong></td><td>{review.applicant}</td><td>{review.beverage}</td><td>{review.brand}</td><td><span className={`badge ${tone}`}>{review.status}</span></td><td><Link href={`/review/${review.id}`} className="btn">Open</Link></td></tr>; })}</tbody></table></div>
  </div>;
}
