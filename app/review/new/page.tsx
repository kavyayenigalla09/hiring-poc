"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileImage, Images, Loader2, Sparkles, UploadCloud, X } from "lucide-react";
import { buildChecks, createReviewRecord, makeId, type Scenario } from "@/lib/review-engine";

const SAMPLE_PROFILES = {
  pass: { label: "Passing sample", applicant: "Old Tom Distillery LLC", beverage: "Distilled Spirits", brand: "OLD TOM DISTILLERY", classType: "Kentucky Straight Bourbon Whiskey", alcohol: "45%", netContents: "750 mL", warning: "Required warning" },
  mismatch: { label: "ABV mismatch", applicant: "Blue Ridge Beverage Co.", beverage: "Distilled Spirits", brand: "STONE'S THROW", classType: "Straight Bourbon Whiskey", alcohol: "45%", netContents: "750 mL", warning: "Required warning" },
  warning: { label: "Warning formatting", applicant: "Harbor Peak Imports", beverage: "Distilled Spirits", brand: "NORTH STAR GIN", classType: "Gin", alcohol: "42%", netContents: "750 mL", warning: "Required warning" },
  brand: { label: "Case normalization", applicant: "Red River Spirits", beverage: "Distilled Spirits", brand: "STONE'S THROW", classType: "Bourbon Whiskey", alcohol: "45%", netContents: "750 mL", warning: "Required warning" }
} as const;

type ProfileKey = keyof typeof SAMPLE_PROFILES;
type FormState = { applicant: string; beverage: string; brand: string; classType: string; alcohol: string; netContents: string; warning: string };
type UploadItem = { file: File; preview: string };

export default function NewReview() {
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [form, setForm] = useState<FormState>({ ...SAMPLE_PROFILES.pass });
  const [scenario, setScenario] = useState<ProfileKey>("pass");
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const profileData = useMemo(() => SAMPLE_PROFILES[scenario], [scenario]);

  function update(field: keyof FormState, value: string) { setForm((current) => ({ ...current, [field]: value })); setComplete(false); }

  function selectProfile(key: ProfileKey) {
    const next = SAMPLE_PROFILES[key];
    setScenario(key); setForm({ ...next }); setComplete(false); setError("");
  }

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    setError("");
    const allowed = selected.filter((file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024);
    if (allowed.length !== selected.length) setError("Only image files up to 10 MB each can be added.");
    const max = mode === "batch" ? 300 : 1;
    const newItems = allowed.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    const nextFiles = mode === "batch" ? [...files, ...newItems].slice(0, max) : newItems.slice(0, 1);
    setFiles(nextFiles);
    setComplete(false);
  }

  function removeFile(index: number) { setFiles((current) => current.filter((_, i) => i !== index)); setComplete(false); }

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function runCheck() {
    setError("");
    if (!files.length) { setError("Attach at least one label image before running the check."); return; }
    setProcessing(true); setProgress(5);
    for (const value of [24, 48, 70, 88, 100]) { await new Promise((resolve) => setTimeout(resolve, 220)); setProgress(value); }

    try {
      const dataUrls = await Promise.all(files.map((item) => fileToDataUrl(item.file)));
      if (mode === "single") {
        const id = makeId();
        const record = createReviewRecord({ id, ...form, scenario: scenario as Scenario, imageData: dataUrls[0], fileName: files[0].file.name });
        localStorage.setItem(`ttb-review-${id}`, JSON.stringify(record));
        const existing = JSON.parse(localStorage.getItem("ttb-local-reviews") || "[]");
        localStorage.setItem("ttb-local-reviews", JSON.stringify([record, ...existing.filter((item: { id: string }) => item.id !== id)]));
        localStorage.setItem("ttb-review-last", id);
      } else {
        const ids: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const id = makeId(); ids.push(id);
          const record = createReviewRecord({ id, ...form, scenario: (i % 3 === 1 ? "mismatch" : i % 3 === 2 ? "warning" : "pass"), imageData: dataUrls[i], fileName: files[i].file.name });
          localStorage.setItem(`ttb-review-${id}`, JSON.stringify(record));
        }
        const batchId = String(Date.now()).slice(-6);
        localStorage.setItem(`ttb-batch-${batchId}`, JSON.stringify({ id: batchId, createdAt: new Date().toISOString(), items: ids }));
        localStorage.setItem("ttb-batch-last", batchId);
        localStorage.setItem("ttb-local-reviews", JSON.stringify([...ids.map((id) => JSON.parse(localStorage.getItem(`ttb-review-${id}`) || "{}")), ...JSON.parse(localStorage.getItem("ttb-local-reviews") || "[]")].slice(0, 50)));
        window.location.href = `/batch/${batchId}`;
        return;
      }
      setProcessing(false); setProgress(100); setComplete(true);
    } catch { setProcessing(false); setError("The browser could not read one of the images. Try a smaller image."); }
  }

  return <div className="content">
    <div className="page-head"><div><Link href="/" className="btn ghost"><ArrowLeft size={14} />Dashboard</Link><div className="eyebrow" style={{ marginTop: 20 }}>New review</div><h1>Start a label review</h1><p className="subtitle">Upload artwork, confirm the application values, and run an explainable compliance check.</p></div><span className="badge gray"><Sparkles size={13} />Prototype mode</span></div>

    <div className="mode-tabs"><button className={mode === "single" ? "active" : ""} onClick={() => { setMode("single"); setFiles([]); setComplete(false); }}>Single review</button><button className={mode === "batch" ? "active" : ""} onClick={() => { setMode("batch"); setFiles([]); setComplete(false); }}><Images size={15} />Batch upload</button></div>

    <div className="sample-strip"><div><strong>Try a test scenario</strong><span>These samples make the prototype deterministic while preserving the uploaded artwork.</span></div><div className="sample-actions">{(Object.keys(SAMPLE_PROFILES) as ProfileKey[]).map((key) => <button key={key} className={`btn ${scenario === key ? "primary" : ""}`} onClick={() => selectProfile(key)}>{SAMPLE_PROFILES[key].label}</button>)}</div></div>

    <div className="review-layout">
      <div className="panel"><div className="panel-head"><span className="panel-title">Application information</span><span className="badge gray">Reference data</span></div><div className="panel-body"><div className="form-grid">
        <Field label="Applicant" value={form.applicant} onChange={(v) => update("applicant", v)} /><div className="field"><label>Beverage type</label><select value={form.beverage} onChange={(e) => update("beverage", e.target.value)}><option>Distilled Spirits</option><option>Wine</option><option>Malt Beverage</option></select></div>
        <Field label="Brand name" value={form.brand} onChange={(v) => update("brand", v)} /><Field label="Class / type" value={form.classType} onChange={(v) => update("classType", v)} /><Field label="Alcohol content" value={form.alcohol} onChange={(v) => update("alcohol", v)} /><Field label="Net contents" value={form.netContents} onChange={(v) => update("netContents", v)} /><Field full label="Government warning" value={form.warning} onChange={(v) => update("warning", v)} />
      </div></div></div>

      <div className="panel"><div className="panel-head"><span className="panel-title">Label artwork</span><span className="badge gray">{mode === "batch" ? `${files.length}/300 selected` : "1 image"}</span></div><div className="panel-body">
        <label className="upload upload-clickable"><UploadCloud size={30} style={{ margin: "0 auto" }} /><strong>{mode === "batch" ? "Drop label images here" : "Drop a label image here"}</strong><p>PNG, JPG, JPEG or WEBP · up to 10 MB each</p><span className="btn">Choose image{mode === "batch" ? "s" : ""}</span><input type="file" accept="image/png,image/jpeg,image/webp" multiple={mode === "batch"} onChange={addFiles} hidden /></label>
        {files.length > 0 && <div className="upload-list">{files.map((item, index) => <div className="upload-item" key={`${item.file.name}-${index}`}><img src={item.preview} alt="Label preview" /><div><strong>{item.file.name}</strong><span>{Math.round(item.file.size / 1024)} KB · ready to analyze</span></div><button className="remove-file inline" onClick={() => removeFile(index)} aria-label="Remove image"><X size={15} /></button></div>)}</div>}
        {error && <div className="alert red-alert">{error}</div>}
        <div className="extraction-note"><div className="note-icon"><Sparkles size={15} /></div><div><strong>Fast prototype extraction</strong><p>The POC keeps extraction local and deterministic for speed. The uploaded artwork is preserved, while the test scenario supplies the extracted values used by the rule engine.</p></div></div>
        <button className="btn primary run-button" disabled={processing} onClick={runCheck}>{processing ? <><Loader2 size={16} className="spin" />Analyzing {mode === "batch" ? `${files.length} labels` : "label"}… {progress}%</> : <><Sparkles size={16} />Run compliance check</>}</button>{processing && <div className="progress progress-large"><span style={{ width: `${progress}%` }} /></div>}
        {complete && <div className="success-panel"><CheckCircle2 size={19} /><div><strong>Check complete</strong><p>{profileData.label} is ready for agent review.</p></div><Link href={`/review/${typeof window !== "undefined" ? localStorage.getItem("ttb-review-last") : ""}`} className="btn primary">View results</Link></div>}
      </div></div>
    </div>
  </div>;
}

function Field({ label, value, onChange, full = false }: { label: string; value: string; onChange: (value: string) => void; full?: boolean }) { return <div className={`field ${full ? "full" : ""}`}><label>{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
