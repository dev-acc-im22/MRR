# TrueMRR Troubleshooting Log (`fix.md`)

## Purpose
Use this file as a running memory of project issues and proven fixes.
Keep entries short, practical, and testable.

## Update Rule (Always Follow)
1. Add one new row for every new issue found.
2. Write in crisp words: symptom, cause, fix, verify.
3. Do not delete old rows; mark status as `Resolved` or `Open`.
4. If a fix changes code/config, mention the exact file.

## Problems and Solutions

| Date | Problem (Symptom) | Root Cause | Solution (Crisp) | Verify | Status |
|---|---|---|---|---|---|
| 2026-03-14 | Vite JSX error: "Expected corresponding JSX closing tag" in `src/App.jsx` | Duplicate/partial navbar markup left inside home hero after refactor, leading to unbalanced tags | Removed stray navbar block from hero; use shared `TopNav` component only | `npm run build` succeeds; app loads without JSX parse error | Resolved |
| 2026-03-14 | Vite error: `Unexpected token` in `src/App.jsx` (dev server fails) | Malformed JSX tag from template-literal className missing closing `>` after edits | Fixed the opening `<div>` tag to close properly and corrected template literal; updated `src/App.jsx` | Vite dev server renders home without error | Resolved |
| 2026-03-04 | Blank page on `http://127.0.0.1:5500/` | VS Code Live Server served raw React JSX (`/src/main.jsx`) instead of Vite-transformed modules | Run app with Vite, not Live Server. Use `npm run dev`. | Page source contains `/@vite/client`; UI renders | Resolved |
| 2026-03-04 | `npm run dev` failed: `Port 5500 is already in use` | Live Server occupied port `5500` (`Code.exe`) | Stop `Go Live` first, then start Vite | `Get-NetTCPConnection -LocalPort 5500` shows `node` (vite), not `Code.exe` | Resolved |
| 2026-03-04 | Same URL worked once, then fallback page returned | Live Server was started again and took over `5500` | Keep single owner for port `5500`: Vite only | `netstat -ano | findstr :5500` maps to Vite node process | Resolved |
| 2026-03-04 | Fallback guidance showed old Vite default (`5173`) | Message text was outdated after port was pinned to `5500` | Updated fallback text in `index.html` to say stop Live Server and open `http://127.0.0.1:5500/` | Fallback message shows correct URL and steps | Resolved |

## Stable Project Run Mode
- Dev server config: `vite.config.js`
- Required settings:
  - `server.host = "127.0.0.1"`
  - `server.port = 5500`
  - `server.strictPort = true`
- Start command: `npm run dev`
- Do not use: VS Code `Go Live`

## Quick Triage Commands
```powershell
# Who owns port 5500?
Get-NetTCPConnection -LocalPort 5500 -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess

# Identify process details
Get-Process -Id <PID> | Select-Object Id,ProcessName,Path

# Confirm server response type
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5500/).Content
```

## Next Entry Template
```md
| YYYY-MM-DD | <symptom> | <root cause> | <solution> | <verification> | Open/Resolved |
```