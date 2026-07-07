# AZ-900 · Azure Fundamentals Study Kit

A complete self-study kit for the **Microsoft Azure Fundamentals (AZ-900)** exam — a 14-day roadmap, exam-focused notes for every syllabus objective, and 600+ practice questions across 11 quizzes.

Built to take a beginner from zero to exam-ready, and to give a working engineer a night-before revision that fits on a plane ride.

## What's in the box

| Piece | File / folder | Purpose |
| ----- | ------------- | ------- |
| **14-day roadmap** | `roadmap.html` | Calendar-view study plan sequencing every objective into daily bites |
| **Domain notes** | `notes/` | 11 markdown files — one per official skill-outline objective, with ASCII diagrams |
| **Cheat sheet** | `notes/EXAM-CHEATSHEET.md` | Every anchor fact and gotcha on one page — night-before revision |
| **Practice quizzes** | `quizzes/` | 11 HTML quizzes, 601 questions total, three difficulty tiers, shuffled |

## Structure

```
AZ900/
├── README.md                                — you are here
├── roadmap.html                             — 14-day calendar plan
│
├── notes/
│   ├── README.md                            — notes index
│   ├── EXAM-CHEATSHEET.md                   — one-page density-max revision
│   ├── 01-cloud-concepts/                   — Domain 1  · 25–30% of exam
│   │   ├── 1.1-cloud-computing.md
│   │   ├── 1.2-cloud-benefits.md
│   │   └── 1.3-cloud-service-types.md
│   ├── 02-architecture-services/            — Domain 2  · 35–40% of exam
│   │   ├── 2.1-core-architecture.md
│   │   ├── 2.2-compute-networking.md
│   │   ├── 2.3-storage.md
│   │   └── 2.4-identity-access-security.md
│   └── 03-management-governance/            — Domain 3  · 30–35% of exam
│       ├── 3.1-cost-management.md
│       ├── 3.2-governance-compliance.md
│       ├── 3.3-deployment-management-tools.md
│       └── 3.4-monitoring-tools.md
│
└── quizzes/
    ├── index.html                           — quiz launcher / progress hub
    ├── quiz.js  ·  quiz.css                 — shared engine + styles
    └── 1.1 … 3.4 .html                      — one quiz per objective
```

## How to use it

1. **Days 1–11 — learn.** Follow `roadmap.html`. Each day pairs a notes file with its matching quiz.
2. **Days 12–13 — drill.** Re-run any quiz where you scored below 85 %. Re-read only the notes that failed you.
3. **Day 14 — cram.** Read `notes/EXAM-CHEATSHEET.md` end-to-end. Book the exam.

### Reading the notes

- **`Exam-hot`** callouts flag material that appears repeatedly in the question bank.
- **`Gotcha`** callouts flag distractor traps — near-synonyms, deprecated names, common misreads.
- Every ASCII diagram lives in a fenced code block, so the notes render identically in GitHub, VS Code, Cursor, and terminal viewers — no external assets, no rendering dependencies.
- Services are named with their **current, official** name (e.g. *Microsoft Entra ID*, not *Azure AD*).

### Taking the quizzes

- Open `quizzes/index.html` in any browser — no build step, no server.
- Every quiz shuffles questions and answer order on each attempt.
- Questions are tagged **Easy / Medium / Hard**; filter to drill weak spots.
- Progress is stored in `localStorage`; clear site data to reset.

## Coverage

Aligned to the current AZ-900 skills outline (2024–2026 blueprint):

| Domain | Weight | Objectives | Notes files | Quiz questions |
| ------ | :----: | :--------: | :---------: | :------------: |
| 1 · Cloud concepts | 25–30 % | 3 | 3 | 150+ |
| 2 · Azure architecture & services | 35–40 % | 4 | 4 | 215+ |
| 3 · Azure management & governance | 30–35 % | 4 | 4 | 200+ |
| **Total** | **100 %** | **11** | **11** | **601** |

## Verify against source

The Microsoft skills outline changes ~once a year. Before your exam, spot-check against the [official AZ-900 page](https://learn.microsoft.com/en-us/credentials/certifications/exams/az-900/).

## Licence

Personal study material. Reuse freely; verify facts against the official Microsoft documentation before relying on them in production or in an exam room.
