import type { Review, Status } from "./data";
import type { StoredReview } from "./review-engine";

export type DecisionStatus = "Accepted" | "Issue";
export type DecisionRecord = { status: DecisionStatus; at: string };
export type DecisionMap = Record<string, DecisionRecord>;

export const DECISIONS_KEY = "ttb-review-decisions";
export const LOCAL_REVIEWS_KEY = "ttb-local-reviews";
export const REVIEW_UPDATED_EVENT = "ttb-review-updated";

export function readDecisions(): DecisionMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(DECISIONS_KEY) || "{}") as DecisionMap;
  } catch {
    return {};
  }
}

export function readLocalReviews(): StoredReview[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_REVIEWS_KEY) || "[]") as StoredReview[];
  } catch {
    return [];
  }
}

export function applyDecision<T extends Review>(review: T, decisions: DecisionMap): T {
  const decision = decisions[review.id]?.status;
  if (decision === "Accepted") return { ...review, status: "Accepted" as Status };
  if (decision === "Issue") return { ...review, status: "Issue" as Status };
  return review;
}

export function mergeReviews(baseReviews: Review[], localReviews: StoredReview[], decisions: DecisionMap): Review[] {
  const byId = new Map<string, Review>();
  [...baseReviews, ...localReviews].forEach((review) => {
    byId.set(review.id, applyDecision(review, decisions));
  });
  return Array.from(byId.values());
}

export function saveDecision(id: string, status: DecisionStatus) {
  if (typeof window === "undefined") return;
  const decisions = readDecisions();
  const record: DecisionRecord = { status, at: new Date().toISOString() };
  localStorage.setItem(DECISIONS_KEY, JSON.stringify({ ...decisions, [id]: record }));

  const localReviews = readLocalReviews();
  const index = localReviews.findIndex((review) => review.id === id);
  if (index >= 0) {
    localReviews[index] = { ...localReviews[index], status };
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(localReviews));
  }

  const stored = localStorage.getItem(`ttb-review-${id}`);
  if (stored) {
    try {
      const review = JSON.parse(stored) as StoredReview;
      localStorage.setItem(`ttb-review-${id}`, JSON.stringify({ ...review, status }));
    } catch {
      // Keep the decision record even if an older stored review cannot be parsed.
    }
  }

  window.dispatchEvent(new CustomEvent(REVIEW_UPDATED_EVENT, { detail: { id, status } }));
}

export function getEffectiveStatus(review: Review): Status {
  return applyDecision(review, readDecisions()).status;
}
