"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Download, Flag, Sparkles } from "lucide-react";
import { reviews, type Check, type Review } from "@/lib/data";
import { type StoredReview } from "@/lib/review-engine";
import { applyDecision, readDecisions, REVIEW_UPDATED_EVENT } from "@/lib/review-state";
import ReviewActions from "@/components/ReviewActions";

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    function load() {
      const stored = localStorage.getItem(`ttb-review-${params.id}`);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredReview;
        setReview(applyDecision(parsed, readDecisions()));
        setImage(parsed.imageData ?? null);
        setFileName(parsed.fileName ?? null);
        return;
      }
      const base = reviews.find((item) => item.id === params.id) ?? reviews[0];
      setReview(applyDecision(base, readDecisions()));
    }
    load();
    window.addEventListener(REVIEW_UPDATED_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(REVIEW_UPDATED_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [params.id]);

  if (!review) return <div className="content"><div className="empty">Loading review…</div></div>;

  return <div className="content">
    <div className="review-toolbar"><Link href="/applications" className="btn ghost"><ArrowLeft size={15} />Applications</Link><div className="toolbar-actions"><button className="btn"><Download size={15} />Export review</button><ReviewActions id={review.id} /></div></div>
    <div className="eyebrow">Application {review.id}</div><h1>{review.brand}</h1><p className="subtitle">{review.applicant} · {review.beverage} · Submitted {review.submitted}</p>
    <div style={{ marginBottom: 16 }}><StatusBadge status={review.status} /></div>
    {fileName && <div className="file-context"><Sparkles size={14} /><span>Uploaded artwork: <strong>{fileName}</strong></span><span className="badge gray">Prototype extraction</span></div>}
    <div className="review-layout review-detail-layout">
      <div className="panel"><div className="panel-head"><span className="panel-title">Label artwork</span><span className="badge gray">{image ? "Uploaded image" : "Prototype image"}</span></div><div className="label-stage">{image ? <img className="uploaded-review-image" src={image} alt="Uploaded label artwork" /> : <DemoLabel review={review} />}</div></div>
      <div className="panel"><div className="panel-head"><span className="panel-title">Compliance checks</span><StatusBadge status={review.status} /></div><div className="panel-body"><div className="check-list">{review.checks.map((check) => <CheckCard key={check.name} check={check} />)}</div><div className="human-note"><strong>Agent decision required</strong><span>Automated checks are advisory. Review the evidence and record the final disposition above.</span></div></div></div>
    </div>
  </div>;
}

function DemoLabel({ review }: { review: Review }) { return <div className="label-art"><div><div className="label-brand">{review.brand}</div></div><div className="label-class">{review.checks[1]?.label}</div><div className="label-abv">{review.checks[2]?.label}</div><div className="warning">GOVERNMENT WARNING: This product contains alcohol. For demonstration only.</div></div>; }
function CheckCard({ check }: { check: Check }) { const tone = check.status === "Passed" ? "green" : check.status === "Mismatch" ? "red" : "amber"; return <div className="check"><div className="check-top"><span className="check-name">{check.name}</span><span className={`badge ${tone}`}>{check.status === "Passed" ? <CheckCircle2 size={13} /> : <Flag size={13} />}{check.status === "Passed" ? "Pass" : check.status === "Mismatch" ? "Mismatch" : "Needs review"}</span></div><div className="check-values"><div className="value-box"><div className="value-label">Application</div><div className="value">{check.application}</div></div><div className="value-box"><div className="value-label">Label</div><div className="value">{check.label}</div></div></div><div className="check-detail">{check.detail}</div></div>; }
function StatusBadge({ status }: { status: string }) { const tone = status === "Passed" || status === "Accepted" ? "green" : status === "Mismatch" || status === "Issue" ? "red" : "amber"; return <span className={`badge ${tone}`}>{status}</span>; }
