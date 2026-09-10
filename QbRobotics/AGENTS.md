# AGENTS.md - Dobot+ Plugin Template

This project is a **Dobot+ plugin**. Prefer the **`dobot-plus` Agent Skill** over ad-hoc coding.

## Prerequisites

```bash
npm install -g @dobot-plus/cli @dobot-plus/skill
```

Skill installs to `~/.agents/skills/dobot-plus/` (or `$DOBOT_SKILL_INSTALL_DIR/dobot-plus`).

## Generate plugin code

1. Fill root **`Requirements.md`** (protocol, slave/registers, bit fields, function list). See comments in that file.
2. In Chat, run: **`/dobot-plus`**
3. Skill parses requirements -> validates `function.json` -> runs scaffold scripts -> you implement Lua bodies + `ui/Main.tsx` -> `dpt build`.

## Why this is faster / more accurate

- Scaffold (HTTP, blocks, scripts, Modbus, daemon) is produced by **deterministic scripts**, not freeform LLM output.
- Agent only focuses on **device logic** and **UI wiring** against `function.json`.
- `.cursorignore` + project rules keep indexing away from i18n dumps and framework internals.

## Do not

- Create or rewrite `Requirements.md` during `/dobot-plus` if protocol data is missing - stop and ask the user to complete it.
- Bypass skill scripts by regenerating `httpAPI.lua` / configs by hand unless the user explicitly requests a one-off fix.