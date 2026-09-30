# TTB Label Compliance Assistant — Prototype

A standalone proof-of-concept for assisting TTB label compliance agents with fast, explainable field matching and batch review.

## Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Prototype approach

The current version intentionally avoids external ML/API dependencies so it can run in restricted government-network environments. The review engine is represented with deterministic sample extraction/results and focuses on the agent workflow:

1. Capture application values.
2. Attach label artwork.
3. Compare normalized fields.
4. Flag mismatches and warning-format issues.
5. Present evidence to the agent.
6. Allow the agent to accept or mark an issue.
7. Surface batch progress and prioritize flagged applications.

## Assumptions / trade-offs

- This is a UX/engineering prototype, not a production compliance determination system.
- No COLA integration, authentication, PII storage, cloud OCR, or production persistence is included.
- Real OCR/computer vision can replace the deterministic sample extraction layer later.
- Final compliance decisions remain with a human agent.
- The sample warning and label content is illustrative. Production rules should be mapped to the applicable TTB regulations and beverage-specific requirements.

## Key design decisions

- Single primary action per screen.
- Plain-language explanations for every flag.
- Normalized comparison allows harmless case/punctuation differences while preserving original text for review.
- Exact warning checks are treated more strictly than ordinary brand-name matching.
- Batch review jumps agents to exceptions rather than requiring one-by-one inspection.


## TTB reference sources used by the prototype

The compliance checks are intentionally limited to a small prototype rule set. They are informed by current TTB guidance for distilled spirits: mandatory brand/class-type/alcohol content, alcohol-content formatting, net contents, and the government health warning. The prototype is not a legal-compliance engine and all results require agent review.

- https://www.ttb.gov/regulated-commodities/beverage-alcohol/distilled-spirits/ds-labeling-home/ds-brand-label
- https://www.ttb.gov/regulated-commodities/beverage-alcohol/distilled-spirits/ds-labeling-home/ds-alcohol-content
- https://www.ttb.gov/regulated-commodities/beverage-alcohol/distilled-spirits/ds-labeling-home/ds-net-contents
- https://www.ttb.gov/regulated-commodities/beverage-alcohol/distilled-spirits/ds-labeling-home/ds-health-warning
