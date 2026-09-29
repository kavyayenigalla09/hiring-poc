"use client";

import { useEffect, useState } from "react";

const jobs = [
  { id: 1, title: "Senior Product Designer", dept: "Product & Design", location: "Remote · US", type: "Full-time", apps: 12, salary: "$140k–$175k" },
  { id: 2, title: "Frontend Engineer", dept: "Engineering", location: "Remote · US", type: "Full-time", apps: 8, salary: "$135k–$165k" },
  { id: 3, title: "Product Manager", dept: "Product", location: "New York · Hybrid", type: "Full-time", apps: 17, salary: "$150k–$190k" },
];

const initialCandidates = [
  { name: "Maya Chen", role: "Senior Product Designer", stage: "Interview", initials: "MC", experience: "8 years", location: "San Francisco, CA", match: "Strong", skills: ["Product design", "Figma", "Design systems"] },
  { name: "Jordan Williams", role: "Senior Product Designer", stage: "Review", initials: "JW", experience: "6 years", location: "Austin, TX", match: "Strong", skills: ["UX research", "Figma", "Prototyping"] },
  { name: "Alex Rivera", role: "Senior Product Designer", stage: "Applied", initials: "AR", experience: "5 years", location: "New York, NY", match: "Good", skills: ["UI design", "Figma", "Web"] },
  { name: "Priya Shah", role: "Senior Product Designer", stage: "Offer", initials: "PS", experience: "9 years", location: "Boston, MA", match: "Strong", skills: ["Product strategy", "Figma", "Leadership"] },
];

export default function Home() {
  const [persona, setPersona] = useState<"applicant" | "manager">("applicant");
  const [screen, setScreen] = useState("jobs");
  const [jobsList, setJobsList] = useState(jobs);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Product");
  const [newLocation, setNewLocation] = useState("Remote · US");
  useEffect(() => {
    const savedJobs = window.localStorage.getItem("hireflow-jobs");
    if (savedJobs) {
      try {
        setJobsList(JSON.parse(savedJobs));
      } catch {
        setJobsList(jobs);
      }
    }
    setJobsLoaded(true);
  }, []);

  useEffect(() => {
    if (jobsLoaded) {
      window.localStorage.setItem("hireflow-jobs", JSON.stringify(jobsList));
    }
  }, [jobsList, jobsLoaded]);
  const [applied, setApplied] = useState(false);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState(initialCandidates[0]);

  const openJob = (job: typeof jobs[number]) => {
    setSelectedJob(job);
    setScreen("job");
  };

  const switchPersona = (next: "applicant" | "manager") => {
    setPersona(next);
    setScreen(next === "applicant" ? "jobs" : "dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => setScreen(persona === "applicant" ? "jobs" : "dashboard")} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">H</div>
            <span className="text-lg font-bold tracking-tight">HireFlow</span>
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
            <button onClick={() => switchPersona("applicant")} className={`rounded-lg px-4 py-2 text-sm font-medium ${persona === "applicant" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}>
              Applicant
            </button>
            <button onClick={() => switchPersona("manager")} className={`rounded-lg px-4 py-2 text-sm font-medium ${persona === "manager" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}>
              Hiring manager
            </button>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
            {persona === "applicant" ? "JD" : "KM"}
          </div>
        </div>
      </header>

      {persona === "applicant" && (
        <div className="mx-auto max-w-7xl px-6 py-10">
          {screen === "jobs" && (
            <>
              <div className="rounded-2xl bg-indigo-700 px-8 py-12 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200">Find your next opportunity</p>
                <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">Work somewhere you can do your best work.</h1>
                <p className="mt-4 max-w-xl text-indigo-100">Explore open roles and apply in minutes. HireFlow keeps you updated throughout the process.</p>
                <div className="mt-8 flex max-w-2xl gap-3">
                  <input placeholder="Search roles..." className="flex-1 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" />
                  <button className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-indigo-700">Search</button>
                </div>
              </div>

              <div className="mt-10 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Open positions</h2>
                  <p className="mt-1 text-sm text-slate-500">Find a role that matches your experience.</p>
                </div>
                <span className="text-sm text-slate-500">{jobsList.length} roles</span>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {jobsList.map(job => (
                  <button key={job.id} onClick={() => openJob(job)} className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{job.dept}</span>
                      <span className="text-xs text-slate-400">{job.type}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{job.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{job.location}</p>
                    <p className="mt-5 text-sm font-medium text-slate-700">{job.salary}</p>
                    <p className="mt-4 text-sm font-semibold text-indigo-600">View role →</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {screen === "job" && (
            <div className="mx-auto max-w-3xl">
              <button onClick={() => setScreen("jobs")} className="text-sm font-medium text-indigo-600">← Back to jobs</button>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{selectedJob.dept}</span>
                <h1 className="mt-5 text-3xl font-bold">{selectedJob.title}</h1>
                <p className="mt-3 text-slate-500">{selectedJob.location} · {selectedJob.type} · {selectedJob.salary}</p>
                <div className="my-8 h-px bg-slate-200" />
                <h2 className="text-lg font-bold">About the role</h2>
                <p className="mt-3 leading-7 text-slate-600">We’re looking for a thoughtful, collaborative person to help shape products used by thousands of customers. You’ll work closely with product, engineering, and leadership to turn ambiguous problems into simple experiences.</p>
                <h2 className="mt-8 text-lg font-bold">What you’ll do</h2>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li>• Own projects from discovery through launch.</li>
                  <li>• Collaborate with product and engineering partners.</li>
                  <li>• Use customer insight to make informed decisions.</li>
                </ul>
                <button onClick={() => { setApplied(true); setScreen("status"); }} className="mt-8 w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
                  Apply for this role
                </button>
              </div>
            </div>
          )}

          {screen === "status" && (
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
                <h1 className="mt-5 text-2xl font-bold">Application submitted</h1>
                <p className="mt-2 text-slate-500">Your application for {selectedJob.title} has been received.</p>
                <div className="mt-8 rounded-xl bg-slate-50 p-5 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Application status</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold">Application received</span>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">In review</span>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-slate-200"><div className="h-2 w-1/3 rounded-full bg-indigo-600" /></div>
                  <div className="mt-3 flex justify-between text-xs text-slate-400"><span>Applied</span><span>Interview</span><span>Decision</span></div>
                </div>
                <button onClick={() => setScreen("jobs")} className="mt-7 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold">Browse more roles</button>
              </div>
            </div>
          )}
        </div>
      )}

      {persona === "manager" && (
        <div className="mx-auto max-w-7xl px-6 py-10">
          {screen === "dashboard" && (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-indigo-600">Hiring workspace</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight">Good morning, hiring team</h1>
                  <p className="mt-2 text-slate-500">See what needs your attention across open roles.</p>
                </div>
                <button onClick={() => setScreen("create")} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">+ Create position</button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[["Open positions", String(jobsList.length)], ["Total applications", String(jobsList.reduce((sum, job) => sum + job.apps, 0))], ["Candidates to review", String(candidates.filter(candidate => candidate.stage === "Applied" || candidate.stage === "Review").length)]].map(([label,value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-bold">Open positions</h2>
                <p className="mt-1 text-sm text-slate-500">Review candidates and move them through your hiring process.</p>
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {jobsList.map((job, i) => (
                    <div key={job.id} className={`flex items-center justify-between p-6 ${i < jobsList.length - 1 ? "border-b border-slate-200" : ""}`}>
                      <div>
                        <div className="flex items-center gap-3"><h3 className="font-semibold">{job.title}</h3><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Open</span></div>
                        <p className="mt-1 text-sm text-slate-500">{job.dept} · {job.location}</p>
                        <p className="mt-3 text-sm font-medium text-slate-700">{job.apps} applications</p>
                      </div>
                      <button onClick={() => { setSelectedJob(job); setScreen("candidates"); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">View candidates</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {screen === "create" && (
            <div className="mx-auto max-w-2xl">
              <button onClick={() => setScreen("dashboard")} className="text-sm font-medium text-indigo-600">← Back to dashboard</button>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-indigo-600">New position</p>
                <h1 className="mt-2 text-3xl font-bold">Create a position</h1>
                <p className="mt-2 text-slate-500">Add the basics and publish the role for applicants.</p>

                <div className="mt-8 space-y-5">
                  <div>
                    <label className="text-sm font-semibold">Job title</label>
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Senior Product Manager"
                      className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Department</label>
                    <select
                      value={newDept}
                      onChange={e => setNewDept(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                    >
                      <option>Product</option>
                      <option>Engineering</option>
                      <option>Product & Design</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Location</label>
                    <select
                      value={newLocation}
                      onChange={e => setNewLocation(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                    >
                      <option>Remote · US</option>
                      <option>New York · Hybrid</option>
                      <option>San Francisco · Hybrid</option>
                      <option>Austin · Hybrid</option>
                    </select>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold">What happens next?</p>
                    <p className="mt-1 text-sm text-slate-500">Once published, applicants can discover the role and apply.</p>
                  </div>

                  <button
                    onClick={() => {
                      if (!newTitle.trim()) return;
                      const newJob = {
                        id: Date.now(),
                        title: newTitle.trim(),
                        dept: newDept,
                        location: newLocation,
                        type: "Full-time",
                        apps: 0,
                        salary: "Compensation discussed"
                      };
                      setJobsList(prev => [newJob, ...prev]);
                      setNewTitle("");
                      setScreen("dashboard");
                    }}
                    className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                  >
                    Publish position
                  </button>
                </div>
              </div>
            </div>
          )}
          {screen === "candidates" && (
            <>
              <button onClick={() => setScreen("dashboard")} className="text-sm font-medium text-indigo-600">← Back to dashboard</button>
              <div className="mt-5 flex items-end justify-between">
                <div><h1 className="text-3xl font-bold">{selectedJob.title}</h1><p className="mt-2 text-slate-500">{selectedJob.apps} applicants · Hiring pipeline</p></div>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold">Position details</button>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-4">
                {["Applied","Review","Interview","Offer"].map(stage => (
                  <div key={stage} className="rounded-xl bg-slate-100 p-3">
                    <div className="mb-3 flex items-center justify-between px-2"><h3 className="text-sm font-bold">{stage}</h3><span className="text-xs text-slate-400">{candidates.filter(c => c.stage === stage).length}</span></div>
                    <div className="space-y-3">
                      {candidates.filter(c => c.stage === stage).map(candidate => (
                        <button key={candidate.name} onClick={() => { setSelectedCandidate(candidate); setScreen("candidate"); }} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-indigo-300">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{candidate.initials}</div>
                            <div><p className="font-semibold">{candidate.name}</p><p className="text-xs text-slate-500">{candidate.experience} · {candidate.location}</p></div>
                          </div>
                          <div className="mt-4 flex items-center justify-between"><span className="text-xs text-slate-500">Match</span><span className="text-xs font-bold text-emerald-600">{candidate.match}</span></div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {screen === "candidate" && (
            <div className="mx-auto max-w-3xl">
              <button onClick={() => setScreen("candidates")} className="text-sm font-medium text-indigo-600">← Back to candidates</button>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">{selectedCandidate.initials}</div>
                    <div><h1 className="text-2xl font-bold">{selectedCandidate.name}</h1><p className="mt-1 text-slate-500">{selectedCandidate.role}</p></div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{selectedCandidate.match} match</span>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-5">
                  <div><p className="text-xs uppercase tracking-wider text-slate-400">Experience</p><p className="mt-1 font-semibold">{selectedCandidate.experience}</p></div>
                  <div><p className="text-xs uppercase tracking-wider text-slate-400">Location</p><p className="mt-1 font-semibold">{selectedCandidate.location}</p></div>
                </div>
                <h2 className="mt-8 font-bold">Skills</h2>
                <div className="mt-3 flex flex-wrap gap-2">{selectedCandidate.skills.map(skill => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">{skill}</span>)}</div>
                <h2 className="mt-8 font-bold">Application summary</h2>
                <p className="mt-3 leading-7 text-slate-600">Strong experience shipping customer-facing products and working cross-functionally with engineering and product. The candidate’s portfolio demonstrates clear product thinking and attention to interaction detail.</p>
                <div className="mt-8 flex gap-3">
                  <button onClick={() => setScreen("candidates")} className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">Back to pipeline</button>
                  <button
                    onClick={() => {
                      const stages = ["Applied", "Review", "Interview", "Offer"];
                      const currentIndex = stages.indexOf(selectedCandidate.stage);
                      if (currentIndex < stages.length - 1) {
                        const nextStage = stages[currentIndex + 1];
                        setCandidates(prev => prev.map(candidate =>
                          candidate.name === selectedCandidate.name
                            ? { ...candidate, stage: nextStage }
                            : candidate
                        ));
                        setSelectedCandidate({ ...selectedCandidate, stage: nextStage });
                        setScreen("candidates");
                      }
                    }}
                    disabled={selectedCandidate.stage === "Offer"}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {selectedCandidate.stage === "Offer" ? "At offer stage" : "Move to next stage →"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
