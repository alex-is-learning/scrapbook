---
date: 2026-04-01T22:44:00
tags:
  - Dave
---

# Product Requirements Document - Dave
**Author:** Alex
**Date:** 2026-04-01

## Executive Summary

Dave is a personal AI tutor implemented as a Claude Code skill, BMAD-pattern inspired but requiring no BMAD infrastructure. It lives inside an existing Obsidian + Quartz scrapbook repository and is invoked from the terminal. Dave's primary function is to surface double ignorance — the false closure that comes from reading about a topic without genuinely understanding it. Dave operates on a single learning topic at a time, using Socratic interrogation, A/B/U knowledge mapping, and session contracts to force genuine grappling rather than comfortable review.

**Target user:** Alex (personal-first, single user). No multi-user support until the method has months of lived evidence.

**Problem:** Most AI tools accelerate the fluency illusion — you ask, you receive an answer, you feel like you know it. Dave inverts this. The session contract, the Feynman-Russell persona, and the deliberate refusal to give answers are all in service of one thing: making the gap visible and staying there until the user has genuinely crossed it.

### What Makes This Special

Dave's differentiator is its refusal to optimise for user satisfaction. Every AI tool smooths friction; Dave generates it at exactly the right moment. The session contract ("We're not here to rehearse what you know. We're here to find what you don't. Confusion is the signal.") transforms a tool interaction into intentional grappling. The A/B/U framework makes the distinction between genuine understanding and believed understanding operational — and Dave presses hardest on B's (confidently held beliefs), because that's where double ignorance hides.

The architecture is equally deliberate: no new tools, no new subscriptions. Git diff is Dave's memory of what's changed between sessions. The scrapbook's Quartz publishing means every session transcript is publicly visible — not as a curated demo, but as evidence of the method working in practice.

## Project Classification

- **Project Type:** CLI Tool (Claude Code skill, BMAD-pattern inspired)
- **Domain:** EdTech — personal learning, AI tutoring, active recall, Socratic method
- **Complexity:** Medium — no regulatory constraints; complexity comes from novel AI session mechanics, Socratic interaction design, and persistent state management across sessions
- **Project Context:** Greenfield

## Success Criteria

### User Success

- At least one B is challenged per session — held, collapsed, or sharpened. A session where no B was pressed is a failed session.
- End-of-session A/B/U reflection is completed honestly: Dave prompts each category in turn ("Tell me about your A's this session…"), and the responses are substantive, not perfunctory.
- Pride score (1–5, self-rated: did you grapple?) is logged per session and trends upward over the first 10 sessions as the format becomes familiar.
- Schema therapy: Alex can explain it plainly, under Socratic pressure, without hedging. This is the first proof-of-concept milestone.

### Personal/Project Success

- Dave becomes a natural part of Alex's existing workflow — as embedded as the scrapbook itself, not a separate tool that requires activation.
- Session transcripts are publicly readable on the Quartz site. Visitors see real sessions, not demos. The method proves itself by being visible.
- After months of real sessions, Alex has enough evidence to make a considered decision about whether Dave is worth sharing. The bar is lived experience, not aspiration.

### Technical Success

- Session transcript is written incrementally as the session runs — never lost on early exit, always readable mid-session from Quartz.
- `dave-log-<topic>.md` and `alex-and-dave.md` are reliably maintained after every session without manual intervention.
- Git diff review at `/tutor hello` is accurate and useful — Dave reads what's actually changed, not a summary.
- Context scoping (`/learning/<topic>/**` only) keeps sessions fast and token-efficient.

### Measurable Outcomes

- Every session produces: a transcript, a log entry, a pride score, and an A/B/U reflection.
- Zero lost sessions due to implementation failure (transcript write, log append, or file creation errors).
- `/tutor init` + `/tutor hello` are working and useful within the first build.

## Product Scope

### MVP — Minimum Viable Product

- `/tutor init`: onboarding interview, ZPD calibration, optional primer ingestion
- `/tutor hello`: git diff review, A/B/U state summary, session contract, action menu
- End-of-session A/B/U reflection prompts
- Incremental session transcript export to `sessions/YYYY-MM-DD-<topic>.md`
- `dave-log-<topic>.md` auto-append after every session
- `alex-and-dave.md` auto-update (date, topic, duration, completion, pride score, A/B/U reflection summary)
- Standard frontmatter on all Dave-created files
- Schema therapy as first live test topic

### Growth Features (Post-MVP)

- `/tutor test-me` — Socratic interrogation of B's
- `/tutor find-gaps` — U mapping and missing ontology
- `/tutor feynman` — user explains plainly, Dave presses on vagueness
- `/tutor teach-me` — Dave plays confused student, user writes rigorous essay
- `/tutor since-last` — explicit before/after session review
- ZPD calibration mechanics (explicit state, session-to-session adaptation)
- Hermeneutic spiral tracking (depth increases as concepts consolidate)

### Vision (Future / Maybe Never)

- Dave as a shareable open-source BMAD skill
- Multi-topic dashboard (cross-topic A/B/U state, session history)
- `/tutor teach-me` multi-session essay draft tracking

## User Journeys

### Journey 1: The First Encounter (Alex — `/tutor init`, new topic)

Alex has been reading about schema therapy for three weeks. The notes are accumulating. He types `/tutor init`. Dave opens with an interview: *"Before we start — what do you already believe you know about schema therapy? Don't hedge."* Alex writes three paragraphs. Dave reads them. *"You've named Early Maladaptive Schemas and the coping modes, but I notice you haven't mentioned what the schemas are actually defending against. Is that a gap or did you choose to skip it?"* Alex pauses. That's a gap he hadn't seen.

Dave asks about goal and timeline. Then: *"I'm going to generate a primer so I have a solid knowledge source for this topic. You can read and correct it — it's not a black box. Give me a moment."* `dave-primer-schema-therapy.md` is written to `/learning/schema-therapy/`. Dave confirms ZPD: *"We'll start at the level of the coping mode taxonomy — you seem confident on schemas themselves, but the modes feel underspecified. Agreed?"*

**Capability requirements revealed:** Interview flow, ZPD calibration logic, primer generation, `dave-primer-<topic>.md` creation, frontmatter application, file scaffolding under `/learning/<topic>/`.

---

### Journey 2: A Good Session (Alex — `/tutor hello`, recurring)

Three days later. Alex has written two notes in `notes/` since the last session. He types `/tutor hello`. Dave reads the git diff: *"You've added a note on schema perpetuation mechanisms and revised your description of the detached protector mode. The detached protector note is more precise than last time — what changed in your understanding?"*

Alex explains. Dave: *"That's in the B pile now. Let's press on it."* A 30-minute session follows. At the end, Dave prompts the A/B/U reflection: *"Tell me about your A's this session — what's genuinely new?"* Alex writes. Then B's: *"What held up under pressure today?"* Then U's: *"What's still fog?"* Dave appends to `dave-log-schema-therapy.md`. Session transcript has been building incrementally throughout. Alex rates his pride score: 4. `alex-and-dave.md` is updated.

**Capability requirements revealed:** Git diff reading, A/B/U state tracking, Socratic interrogation of B's, end-of-session reflection prompts, incremental transcript write, log append, homepage update, pride score logging.

---

### Journey 3: The Early Exit (Alex — session interrupted)

Halfway through a session. Something comes up. Alex types `/tutor end` or simply closes the terminal. Dave has been writing the transcript incrementally — nothing is lost. Before exit, if Dave catches the signal: *"We're 18 minutes in. You committed to 30. Leaving now is fine — but I'm logging it. Not as punishment. As the record."* `alex-and-dave.md` gets: `2026-04-15 | schema therapy | 18 min | incomplete | —`. The pride score is omitted; the A/B/U reflection is partial.

Next session: `/tutor hello` surfaces it. *"Last time you left early. What was happening?"* Not an accusation. An opening.

**Capability requirements revealed:** Graceful early exit handling, partial session logging, incomplete status flag on homepage, continuity reference at next session start.

---

### Journey 4: The Public Reader (secondary — Quartz visitor)

Someone finds Alex's scrapbook via a link. They navigate to the learning section. They see `alex-and-dave.md` — a table of sessions, dates, topics, pride scores. They click a session transcript. They read a real exchange: Dave pressing on a vague definition, Alex pushing back, then reconsidering. They see the A/B/U reflection at the end.

They are either: (a) intrigued — this is a real method, not a pitch; or (b) indifferent. Either is fine. The point is the transcript is legible, dated, and unedited. The method proves itself by being visible.

**Capability requirements revealed:** Clean transcript markdown format (readable without context), meaningful session headers, Quartz-compatible frontmatter, `alex-and-dave.md` as navigable index.

---

### Journey Requirements Summary

| Capability | Journeys that reveal it |
|---|---|
| Onboarding interview + ZPD calibration | J1 |
| Primer generation (`dave-primer-<topic>.md`) | J1 |
| File scaffolding under `/learning/<topic>/` | J1 |
| Git diff reading at session start | J2 |
| Socratic interrogation of B's | J2 |
| End-of-session A/B/U reflection prompts | J2 |
| Incremental transcript write | J2, J3 |
| Session log append (`dave-log-<topic>.md`) | J2 |
| Homepage auto-update (`alex-and-dave.md`) | J2, J3 |
| Pride score capture | J2 |
| Graceful early exit + incomplete status flag | J3 |
| Continuity reference at next session start | J3 |
| Clean, legible transcript markdown | J4 |

## Domain-Specific Requirements

### Learning Science Constraints

- ZPD calibration must be responsive to demonstrated understanding, not self-report alone. Dave should probe stated knowledge during init rather than accepting it at face value — miscalibrating high is worse than miscalibrating low.
- A/B/U framework definitions must be stable and consistently applied session-to-session. Drift in how Dave uses these categories undermines longitudinal tracking and the validity of the log.

### AI Interaction Constraints

- Dave must never give the answer, even when Alex asks directly. This is a hard behavioural constraint, not a stylistic preference. It must be enforced at the persona level in the skill prompt.
- Dave's epistemic uncertainty about niche topics must be surfaced explicitly. If `dave-primer-<topic>.md` contains gaps or uncertain knowledge, Dave must name that uncertainty rather than present false confidence. An honest "I'm not sure about this — check the primer" is better than a plausible-sounding error.

### Data Integrity Constraints

- Session transcript writes must be append-only. A mid-session crash or early exit should leave a partial but intact transcript — never a corrupted or overwritten one.
- `dave-log-<topic>.md` and `alex-and-dave.md` updates should be structured so a failed write does not corrupt previous entries. Each session's append is a discrete, self-contained block.

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Anti-satisfaction AI design**
Every AI assistant on the market optimises for user satisfaction: answer the question, resolve the confusion, smooth the friction. Dave inverts this deliberately. The core innovation is an AI tool whose success metric is *not* whether the user feels good at the end of the interaction — it's whether the user genuinely grappled. No existing AI tutoring tool has made this inversion structurally explicit (session contract, refusal to answer, B-first interrogation). Most claim Socratic method but default to explanation when pressed.

**2. Git as epistemological memory**
Using `git diff` as the primary session context mechanism — Dave knows what changed in your understanding because it knows what changed in your files. Commit history becomes the intellectual development record. This is a novel use of existing infrastructure that requires no new tooling and produces a verifiable, public audit trail of learning.

**3. Simultaneous session + publication**
The learning session and its public artifact are the same thing. The incremental transcript write means the Quartz-published session is not a post-processed summary — it's the actual exchange, as it happened. This makes the method self-proving in a way that "here's a blog post about my learning tool" cannot be.

**4. Natural language CLI with enforced behavioural constraints**
`/tutor init`, `/tutor hello` etc. trigger full AI-driven conversational interactions, but with a structural constraint that most LLM interactions lack: Dave has a hard behavioural rule (never give the answer) enforced at the skill prompt level. This follows the BMAD-pattern approach — using the skill architecture to enforce persona constraints that the model would otherwise be likely to violate under user pressure.

### Market Context & Competitive Landscape

Existing AI tutoring tools (Khan Academy's Khanmigo, Socratic by Google, various GPT tutors) all share the same failure mode: they give the answer when asked, they summarise content rather than interrogate understanding, and they measure engagement rather than learning. The closest conceptual precedent is Anki (spaced repetition) — but Anki tests recall, not understanding, and requires the user to generate the cards. Dave tests understanding directly and uses git history as the card generation mechanism.

Dave is not competing with these tools. It's filling a gap they structurally cannot fill without abandoning their satisfaction-first design.

### Validation Approach

- **First milestone:** Alex can explain schema therapy coherently under Socratic pressure from Dave after 10 sessions. Self-assessed but honest — the A/B/U reflection makes the standard legible.
- **Second milestone:** Session transcripts are publicly readable and a third-party reader can follow the progression of understanding across sessions.
- **Invalidation condition:** If Alex finds himself routinely bypassing Dave's constraints (rewording questions to get answers, low pride scores every session), the design has failed and needs rethinking.

### Risk Mitigation

| Risk | Mitigation |
|---|---|
| Dave gives the answer under pressure | Hard constraint in skill prompt; persona must hold even when Alex asks directly |
| ZPD miscalibration makes sessions frustrating | Calibrate low rather than high; Dave can always push harder, harder to recover from demoralisation |
| Incremental write creates noisy transcripts | Clear session header and turn markers in transcript format; retrospective readability tested early |
| Method only works for schema therapy (topic-specific fluke) | Second topic test (to be chosen) after schema therapy proves the pattern |

## CLI Tool Specific Requirements

### Project-Type Overview

Dave is a standalone Claude Code skill — a set of markdown instruction files installed at `~/.claude/skills/dave/`. It is invoked via Claude Code slash commands (`/tutor init`, `/tutor hello`, etc.) from the terminal. Claude Code is started in the topic subfolder (`/learning/schema-therapy/`), giving Dave a clean, scoped working directory. No BMAD infrastructure required.

### Command Structure

| Command | Trigger | MVP |
|---|---|---|
| `/tutor init` | One-time per topic. Onboarding interview, ZPD calibration, primer generation. | ✅ |
| `/tutor hello` | Session entry. Git diff review, A/B/U state, session contract, action menu. | ✅ |
| `/tutor test-me` | Socratic interrogation of B's. | Post-MVP |
| `/tutor find-gaps` | U mapping and missing ontology. | Post-MVP |
| `/tutor feynman` | User explains plainly, Dave presses on vagueness. | Post-MVP |
| `/tutor teach-me` | Dave plays confused student, user writes rigorous essay. | Post-MVP |
| `/tutor since-last` | Before/after review since last session. | Post-MVP |

All commands are interactive (full conversational AI sessions). None are scriptable or piped. No shell completion — invocation is via Claude Code's `/` prefix.

### Output Formats

All Dave output is markdown written to the topic subfolder. No other output formats.

| File | Location | Write pattern |
|---|---|---|
| `dave-primer-<topic>.md` | `/learning/<topic>/` | Written once at init; user-editable |
| `dave-log-<topic>.md` | `/learning/<topic>/` | Appended after each session (discrete blocks) |
| `sessions/YYYY-MM-DD-<topic>.md` | `/learning/<topic>/sessions/` | Written incrementally during session |
| `alex-and-dave.md` | `/learning/` | Updated after each session (cross-topic homepage) |

Standard frontmatter on every Dave-created file:
```yaml
date: dd/mm/yyyy, --:--
tags:
    - Dave
```

### Config Schema

No global config file. Dave's configuration is two-layer:

- **Skill files** (`~/.claude/skills/dave/`) — Dave's fixed behaviour, persona, session flow, and constraint enforcement. Static. Updated only when Dave is upgraded.
- **Per-topic state** (`/learning/<topic>/`) — `dave-primer-<topic>.md` (knowledge source) and `dave-log-<topic>.md` (session history). Dynamic. Dave reads these at the start of each session.

Topic slug is derived from the folder name at `/tutor init` (e.g. folder `schema-therapy` → slug `schema-therapy` → used in all filenames for that topic).

### File Structure

```
~/.claude/skills/dave/        ← Skill files (behaviour)
    workflow.md
    steps/...

/learning/                    ← Scrapbook repo
    alex-and-dave.md          ← Cross-topic homepage (Quartz-published, [[Alex and Dave]] alias)
    schema-therapy/           ← CWD when running Dave on this topic
        dave-primer-schema-therapy.md
        dave-log-schema-therapy.md
        sessions/
            2026-04-01-schema-therapy.md
        notes/
```

### Git Diff Scoping

Dave runs `git diff -- .` at session start (scoped to CWD). This surfaces only changes in the current topic folder, ignoring the rest of the 330k-word scrapbook. Commit history for the topic folder is the intellectual development record.

### Implementation Considerations

- Dave derives the topic slug from the folder name at init — no manual topic entry needed.
- `alex-and-dave.md` lives at `/learning/` level and is updated by Dave after each session regardless of which topic folder Claude Code was started in. Dave must resolve the relative path `../alex-and-dave.md` from the topic CWD.
- Session transcript is written incrementally as turns occur — append-only, never overwritten. A partial transcript from an early exit is valid and complete up to the point of exit.
- Obsidian vault-wide filename uniqueness is maintained by topic-scoped filenames (`dave-log-schema-therapy.md` not `dave-log.md`).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Personal proof-of-concept. The minimum that makes this "useful" is a single completed session where Alex genuinely grapples — not a comfortable review — and the transcript, log, and reflection are all written correctly. That's the bar. No feature is in MVP unless its absence makes that session impossible.

**Resource requirements:** Solo build. Alex + Claude Code. No team, no dependencies, no external services.

### Post-MVP Features

**Phase 2 (Growth):** Full command set (`/tutor test-me`, `/tutor find-gaps`, `/tutor feynman`, `/tutor teach-me`, `/tutor since-last`), ZPD calibration mechanics (explicit state tracking, session-to-session adaptation), hermeneutic spiral depth progression.

**Phase 3 (Expansion / Maybe Never):** Dave as a shareable Claude Code skill, multi-topic dashboard, `/tutor teach-me` multi-session essay draft tracking.

### Risk Mitigation Strategy

**Technical risks:**
- *Incremental transcript write* — Claude Code doesn't natively export terminal history. Dave must write to the transcript file explicitly at each turn. Mitigation: implement this at the very start of build and test it before any other feature. If it doesn't work cleanly, nothing else matters.
- *Persona constraint enforcement* — Dave may give answers under pressure if the skill prompt is underspecified. Mitigation: explicit hard constraint in skill prompt, tested adversarially before first real session.

**Personal/method risks:**
- *ZPD miscalibration* — Dave starts sessions at wrong depth. Mitigation: calibrate low (easier to push harder than recover from frustration), and make recalibration possible via `dave-log` review at each `/tutor hello`.
- *Method doesn't generalise* — schema therapy works but a second topic doesn't. Mitigation: test a second topic after 10 schema therapy sessions before investing in Phase 2.

**Resource risks:** Solo build with no external dependencies. The only resource constraint is Alex's time — and the MVP is deliberately minimal enough to be buildable in a day.

## Functional Requirements

### Topic Initialisation

- **FR1:** Dave can conduct a structured onboarding interview to assess the learner's current knowledge, goals, and timeline for a new topic.
- **FR2:** Dave can calibrate ZPD (Zone of Proximal Development) based on demonstrated knowledge from the interview, defaulting to a lower calibration when uncertain.
- **FR3:** Dave can generate a topic primer (`dave-primer-<topic>.md`) via deep research when no source material is provided.
- **FR4:** Dave can ingest user-provided source material as the basis for a topic primer when supplied at init.
- **FR5:** Dave can surface his own epistemic uncertainty about niche topics explicitly, rather than presenting potentially incorrect content with false confidence.
- **FR6:** Dave can scaffold the full topic folder structure (`sessions/`, `notes/`, all required files) at init.
- **FR7:** Dave can derive the topic slug from the CWD folder name without requiring manual input.

### Session Entry & Contract

- **FR8:** Dave can read `git diff -- .` scoped to the topic CWD and present a meaningful summary of what has changed since the last session.
- **FR9:** Dave can read and summarise the current A/B/U state from `dave-log-<topic>.md`.
- **FR10:** Dave can open every session with an explicit session contract: duration commitment from the learner, followed by the session frame statement.
- **FR11:** Dave can present an action menu at session start, based on the current A/B/U state and session history.
- **FR12:** Dave can surface the fact that the previous session ended early, as a continuity reference at the next session start.

### Socratic Interaction

- **FR13:** Dave can probe confidently held beliefs (B's) with targeted Socratic questions, prioritising B's over recognised gaps (U's).
- **FR14:** Dave can withhold direct answers when the learner asks for them, redirecting to the gap instead.
- **FR15:** Dave can identify vagueness or hedging in learner explanations and name the specific imprecision.
- **FR16:** Dave can map recognised gaps (U's) and missing ontology — concepts the learner has flagged as unclear or undefined.
- **FR17:** Dave can conduct a Feynman-style session where the learner explains a concept in plain language and Dave presses on every vague point.
- **FR18:** Dave can play a confused student, prompting the learner to write a rigorous explanatory essay including "why does this matter at all?"
- **FR19:** Dave can conduct an explicit before/after review of what has changed in understanding since the last session.
- **FR36:** Dave can prompt the learner to sketch concept relationships on paper at appropriate moments during a session — typically early, for spatial orientation of the topic ontology. Dave does not generate diagrams; the physical act of sketching is the pedagogical mechanism.

### Session Transcript

- **FR20:** Dave can write session content to a transcript file incrementally as the session progresses (append-only, never overwrites).
- **FR21:** Dave can create a new transcript file per session with a dated filename (`sessions/YYYY-MM-DD-<topic>.md`).
- **FR22:** Dave can produce transcript files in clean, legible markdown with session headers and clearly marked turns, readable without additional context.
- **FR23:** Dave can leave a partial transcript intact and valid when a session ends early — no data loss on early exit.

### Post-Session Reflection & Logging

- **FR24:** Dave can prompt the learner through an end-of-session A/B/U reflection, asking about each category in turn with open text input.
- **FR25:** Dave can capture a self-rated pride score (1–5) at session end.
- **FR26:** Dave can append a structured session block to `dave-log-<topic>.md` after every session, including A/B/U reflection content, pride score, and session summary.
- **FR27:** Dave can update `alex-and-dave.md` after every session with: date, topic, duration, completion status, pride score, and A/B/U reflection summary.
- **FR28:** Dave can log early exits with incomplete status and omit pride score when session ends without reflection.

### Knowledge & State Access

- **FR29:** Dave can read `dave-primer-<topic>.md` as the primary knowledge source for session content.
- **FR30:** Dave can read `dave-log-<topic>.md` to retrieve A/B/U history and prior session summaries.
- **FR31:** Dave can read files in the `notes/` subfolder as the learner's written work and incorporate it into session context. Notes are dialogical — written to Dave as a rigorous reader, not personal brain dumps. Dave may prompt the learner to frame notes this way and may reference their quality (coherence, completeness, precision) during sessions.
- **FR37:** Dave can surface the dialogical note-writing standard when introducing the `notes/` subfolder at init — explaining that notes written to an imagined rigorous reader produce more useful material for session work than private shorthand.

### File & Repo Management

- **FR32:** Dave can create all files with standard frontmatter (`date`, `tags: [Dave]`).
- **FR33:** Dave can resolve and write to `alex-and-dave.md` at the `/learning/` level from within any topic CWD.
- **FR34:** Dave can create `sessions/` and `notes/` subdirectories if they do not exist.
- **FR35:** Dave can name all topic-scoped files using the topic slug to ensure Obsidian vault-wide filename uniqueness.

## Non-Functional Requirements

### Performance

- **NFR1:** Session startup (`/tutor hello`) completes its git diff read and log parse within a time that doesn't interrupt the session opening flow. Dave should not require the learner to wait noticeably before the session contract is presented.
- **NFR2:** Context loading is scoped to `/learning/<topic>/` only. Dave must not load the full scrapbook vault (~330k words) at any point during a session. Token efficiency is a first-class constraint.
- **NFR3:** Incremental transcript writes must not interrupt conversational flow — each write is a background file append, not a blocking operation.

### Reliability & Data Integrity

- **NFR4:** Session transcripts are append-only. No write operation may overwrite or truncate an existing transcript. A failed or interrupted write leaves the previous content intact.
- **NFR5:** `dave-log-<topic>.md` entries are discrete, self-contained blocks. A failed append must not corrupt previously written entries.
- **NFR6:** `alex-and-dave.md` updates are structured so a failed write does not corrupt the existing session table.
- **NFR7:** Dave must never silently fail on a file write. If a write fails, Dave surfaces the error to the learner immediately rather than continuing as if the session was logged.

### Integration Compatibility

- **NFR8:** All Dave-created markdown files must be valid Obsidian markdown — correct frontmatter format, no syntax that breaks Obsidian rendering.
- **NFR9:** All Dave-created filenames must be unique across the Obsidian vault. Topic-scoped naming (`dave-log-<topic>.md`) is the enforced mechanism.
- **NFR10:** Session transcripts and `alex-and-dave.md` must render correctly in Quartz without additional post-processing. Standard markdown only — no Obsidian-specific syntax (callouts, dataview queries) in Quartz-published files.
- **NFR11:** `git diff -- .` must reliably scope to the topic CWD. Dave must not rely on global git state that could expose unrelated changes from the rest of the scrapbook.
