- ![[1779884638053.webp]]
# What I've built
## Software
- **ExA (Executive Assistant automation stack)** (see [[Executive Assistant automation (n8n)]]) 
	- n8n + Claude + Telegram bot I built in a weekend
	- morning briefing (Gmail + Calendar + priorities → synthesised brief)
	- always-on inbound router (text/voice → Whisper transcription → Claude classifies intent → routes to correct tool)
	- evening recap (Toggl + GitHub commits + Todoist + Calendar → narrative summary), 
	- weekly review (writes structured reflection to Obsidian vault)
- Websites:
	- Landing page (www.alexislearning.me), [co-thinking](https://cothinker-website.vercel.app/) site, etc
- **Flow** — open-loops task manager (session mode, loop graph, plain JSON)
- **Ithaca** — personal work + income tracker (static HTML, File System Access API)
- **Schemagotchi** — schema therapy tracker, tamagotchi-style progression across 18 schemas
- Quick thing → web-scraping to find job listings
	- This cost ~$2 in tokens and saved me a bunch of time, & surfaced what job listing sites are scrape-able (e.g. LinkedIn) and which aren't
	- ![[1779895635209.webp]]
- **Gymnasiarch** — daily practice tool (fitness + philosophy, ancient Greek model, local-first)
## How I build
- [BMAD](bmad-code-org/BMAD-METHOD: Breakthrough Method for Agile Ai Driven Development) — agile framework + skill suite for AI-driven development; used for all of the above
## Setup & workflow
- **Warp** — preferred terminal for Claude Code (see below)
- **Superwhisper** — dictate to Claude instead of typing
- **MCP connections** — Google Calendar, Google Drive, Zoom (see below)
- **Custom skills** — written my own + installed from GitHub
- **CLAUDE.md config** — per-project + global instructions that shape Claude's behaviour
- **Handover documents** — structured context files so Claude picks up mid-task cleanly
- **Remote trigger** — can kick off Claude workflows away from my desk
## Advanced
- Sub-agents — spawn parallel agents for complex multi-step tasks
- Parallel Warp tabs — multiple Claude instances running simultaneously
- Web scraping — automated data collection

---

# Tool stack
## Claude Code
- I've paid for Google Gemini, ChatGPT, and Claude, over the past ~1 year
- I'm currently a big fan of Claude (although I do miss Gemini's Deep Research)
- I'm currently paying for Claude Max, but planning to downgrade now that my initial month of vibe-coding is behind me!
![[Pasted image 20260518141626.png]]
## Warp terminal app
- Prefer this over the vanilla Mac terminal app or Claude Desktop app
- ![[Pasted image 20260518141835.png]]
## My own software
- I paid for the £200 Claude tier a month ago and used it + the [BMAD](bmad-code-org/BMAD-METHOD: Breakthrough Method for Agile Ai Driven Development)  skill suite to create 5+ software tools that I use weekly, including published websites, a thinking suite, a learning suite, a to-do-list app, a finance tracker
- My Github:
- ![[Pasted image 20260518142000.png]]
## MCP connections
- Super simple way to connect Claude to things
- ![[Pasted image 20260518141921.png]]
- The fact that Claude can make Google Calendar events for me (e.g. timeboxes) makes me very very happy. I also have the Google Drive MCP and the Zoom MCP - the Zoom MCP can grab the transcript of a Zoom meeting and plonk it in my notetaking app
