import type { Check, Review, Status } from "./data";

export const REQUIRED_WARNING =
  "GOVERNMENT WARNING: (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems.";

export type Scenario = "pass" | "mismatch" | "warning" | "brand";

export type StoredReview = Review & {
  imageData?: string;
  fileName?: string;
  source?: "sample" | "upload";
  scenario?: Scenario;
  createdAt?: string;
};

export type StoredBatch = {
  id: string;
  createdAt: string;
  items: string[];
};

export function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizeAbv(value: string) {
  const match = value.replace(",", ".").match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? Number(match[1]) : null;
}

export function checkField(
  name: string,
  application: string,
  label: string,
  detailPassed: string,
  detailMismatch: string,
  tolerance = 0
): Check {
  if (name === "Alcohol Content") {
    const app = normalizeAbv(application);
    const detected = normalizeAbv(label);
    if (app !== null && detected !== null && Math.abs(app - detected) <= tolerance) {
      return { name, status: "Passed", application, label, detail: detailPassed };
    }
  } else if (normalizeText(application) === normalizeText(label)) {
    return { name, status: "Passed", application, label, detail: detailPassed };
  }
  return { name, status: "Mismatch", application, label, detail: detailMismatch };
}

export function warningCheck(application: string, label: string, malformed = false): Check {
  const exact = normalizeText(label) === normalizeText(REQUIRED_WARNING);
  if (exact && !malformed) {
    return {
      name: "Government Warning",
      status: "Passed",
      application,
      label: "GOVERNMENT WARNING: Required warning text detected",
      detail: "Required warning wording detected; heading formatting appears compliant."
    };
  }

  return {
    name: "Government Warning",
    status: "Needs Review",
    application,
    label: malformed ? "Government Warning: ..." : label || "Not detected",
    detail: malformed
      ? "The warning heading is not detected in the required all-caps format. Agent review required."
      : "The required warning text could not be verified from the prototype extraction. Agent review required."
  };
}

export function buildChecks(input: {
  brand: string;
  classType: string;
  alcohol: string;
  netContents: string;
  warning: string;
  scenario: Scenario;
}): Check[] {
  const detectedBrand = input.scenario === "brand" ? input.brand.toLowerCase() : input.brand;
  const detectedAlcohol = input.scenario === "mismatch" ? "40% Alc./Vol." : `${input.alcohol} Alc./Vol.`;
  const detectedClass = input.classType;
  const detectedNet = input.netContents;

  return [
    checkField(
      "Brand Name",
      input.brand,
      detectedBrand,
      "Normalized text matches exactly.",
      "The label brand differs after normalization."
    ),
    checkField(
      "Class / Type",
      input.classType,
      detectedClass,
      "Label and application agree.",
      "The class/type designation differs."
    ),
    checkField(
      "Alcohol Content",
      input.alcohol,
      detectedAlcohol,
      "ABV value matches after unit normalization.",
      "The numeric alcohol content differs.",
      0.3
    ),
    checkField(
      "Net Contents",
      input.netContents,
      detectedNet,
      "Declared net contents match.",
      "The declared net contents differ."
    ),
    warningCheck(input.warning, input.scenario === "warning" ? "Government Warning: ..." : REQUIRED_WARNING, input.scenario === "warning")
  ];
}

export function statusFromChecks(checks: Check[]): Status {
  if (checks.some((check) => check.status === "Mismatch")) return "Mismatch";
  if (checks.some((check) => check.status === "Needs Review")) return "Needs Review";
  return "Passed";
}

export function createReviewRecord(input: {
  id: string;
  applicant: string;
  beverage: string;
  brand: string;
  classType: string;
  alcohol: string;
  netContents: string;
  warning: string;
  imageData?: string;
  fileName?: string;
  scenario: Scenario;
}): StoredReview {
  const checks = buildChecks(input);
  return {
    id: input.id,
    applicant: input.applicant,
    brand: input.brand,
    beverage: input.beverage,
    submitted: "Just now",
    status: statusFromChecks(checks),
    checks,
    imageData: input.imageData,
    fileName: input.fileName,
    source: input.imageData ? "upload" : "sample",
    scenario: input.scenario,
    createdAt: new Date().toISOString()
  };
}

export function makeId(prefix = "COLA") {
  const suffix = Math.floor(1000 + Math.random() * 8999);
  return `${prefix}-${suffix}`;
}
