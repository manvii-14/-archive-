# 🦄 Recruitment Portal 2026 — Development Report

**Date:** September 8, 2026
**Focus:** Authentication Architecture, UX Optimization, and UI Overhaul

---

## 🎀 Executive Summary

This development cycle focused on finalizing the core authentication flow, resolving backend routing and configuration issues, and upgrading the user interface. The headline change is a **"Lazy Registration" flow**: candidates can now read and fill out the entire application form before ever being asked to sign in — Google authentication is only triggered at the moment of submission, and the user's answers are carried through automatically so nothing has to be re-typed. This removes what was previously a hard wall between "land on the page" and "start applying," which is where most drop-off happens.

**Status:** Core flow (routing, sign-in, lazy registration, UI pass) is functionally complete. **Not yet cleared for production** — see [Known Issues](#-known-issues--before-production) below for the items that should be closed first, the admin data-exposure issue in particular.

---

## 🌈 Key Improvements & Fixes

### 1. Authentication & Backend Infrastructure

- **Next.js catch-all auth routing:** Established the App Router catch-all endpoint (`app/api/auth/[...all]/route.js`) that Better Auth requires. Its absence was the root cause of infinite loading states and 404s during social sign-in.
- **Social sign-in via Better Auth client:** Sign-in now goes through `authClient.signIn.social({ provider: "google", ... })` rather than a raw redirect link, so the flow is driven by Better Auth's own session/token handling instead of an unmanaged browser navigation.
- **Firebase Admin SDK env fix:** Fixed a server crash caused by `FIREBASE_PRIVATE_KEY` losing its newline characters when stored as a plain `.env` string; the key is now parsed with the `\n`-literal replacement Firebase Admin expects.
- **Surfaced silent auth errors:** Auth error states that previously left the UI stuck on "Processing..." now surface a real error to the user instead of hanging silently.

### 2. "Lazy Registration" — Sign-In-at-Submit Flow ⭐

This was the core piece of work this cycle, touching `app/(pages)/join/[...joinIds]/page.jsx` and `components/FormComp.jsx`.

- **Removed the pre-auth gate.** The join page previously rendered a blocking "Authentication Required" screen and refused to mount the form at all until `authClient.useSession()` resolved to a signed-in user. That gate is gone — the form now always renders, whether or not a session exists.
- **Email field now editable pre-sign-in.** The Email input was hardcoded `readOnly`, which meant it could only ever be populated from an existing session — there was no way to fill it out while signed out. It's now editable when signed out and locked/pre-filled from the session once signed in, with proper `zod` email-format validation added (`Email: z.string().min(1).email()` — previously just an unvalidated `z.string()`).
- **Answers are staged before the sign-in redirect.** On submit, if there's no session yet, the form's already-validated values (React Hook Form only calls this path once client-side validation passes) are written to `localStorage` under a key scoped to the specific department combination (`recruitment-pending-submission:<departments>`), and the user is sent to Google via `authClient.signIn.social` with `callbackURL` pointed back at the same join page.
- **Automatic resume and submit after sign-in.** A `useEffect` watches for the user landing back on the page authenticated, picks up the staged answers, restores them into the form with `form.reset()` (filling in the now-known session email), shows a "Signed in! Submitting your application..." toast, and calls the submission function automatically — no re-entry of data, no second manual submit click.
- **Two implementation bugs caught and fixed during this change:**
  - The resume `useEffect` initially ended up positioned after an early `return` in the component, which violates React's Rules of Hooks (hooks can't be called conditionally). Moved it up alongside the component's other effects, before any early return.
  - The `localStorage` key used by that effect was originally referenced in its dependency array before being declared further down the file — a temporal-dead-zone bug that would throw at render time. Moved the key's declaration to the top of the component, before any effect that depends on it.
- **No backend changes required for this piece.** `/api/submit-form` already rejects unauthenticated requests server-side and derives the applicant's email from the verified session rather than trusting the client-submitted value, so deferring the sign-in prompt client-side didn't require loosening anything on the server.

### 3. UI/UX Overhaul — "Glassmorphism" Design ✨

- **Form redesign:** Rebuilt the application form as a responsive glass-panel card (`backdrop-blur-2xl`, `bg-black/40`) with subtle glow accents, matching the site's dark-mode aesthetic.
- **Layout/spacing fixes:** Removed excess vertical whitespace on the landing page (`Hero` component padding tightened from `pt-16` to `pt-4`); removed unstyled raw HTML that was rendering above the fold from legacy `PopupComp`/`NavBar` layout issues.
- **Asset fixes:** Replaced a broken department SVG with the correct Cloud & DevOps icon (`cloud.svg`); added `lucide-react` icons (`Sparkles`, `Info`) for visual hierarchy in a few places that were plain text before.

### 4. Code Cleanup & Technical Debt

- Removed redundant components and consolidated duplicated layout logic.
- Confirmed the 2-application-per-user limit (enforced via `/api/check-applications`) still holds correctly through the new sign-in handoff — a staged submission still counts against the same cap once it lands.
- Cleaned up now-unused state/imports left behind by the auth-gate removal in `page.jsx` and `FormComp.jsx`.

---

## 🍭 How to Run This Project

1. `npm install` — pulls in the platform-correct build tooling; don't reuse a `node_modules` folder copied from a different OS/architecture.
2. `cp .env.example .env.local` and fill in real values: Firebase service account credentials, `BETTER_AUTH_SECRET`, Google OAuth `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, and (optional, only for the admin "email applicants" feature) `EMAIL_USERNAME`/`EMAIL_PASSWORD`.
3. In Google Cloud Console, confirm the OAuth client's **Authorized redirect URI** includes `http://localhost:3000/api/auth/callback/google` (and your production URL once deployed).
4. `npm run dev`, then open `http://localhost:3000`.

## 🧁 Environment & Secrets

- `.env` and `.env*.local` are already covered by `.gitignore` — only `.env.example` (placeholder values, no real secrets) is meant to be committed.
- Before making the repo public, double-check `.env` was never committed in an earlier commit: `git log --all --full-history -- .env`. If it ever was, treat every value in it as compromised — rotate the Google OAuth client secret, the Firebase service account key, and `BETTER_AUTH_SECRET` — regardless of whether the file is removed now, since old commits keep it in history until it's explicitly scrubbed.

---

## ⚠️ Known Issues — Before Production

Found during this cycle's review; not yet fixed. Flagging clearly rather than letting "core flow complete" imply these are closed too.

| Priority | Issue | Where | Risk |
|---|---|---|---|
| **High** | `GET /api/admin/applicants` and `PATCH /api/shortlist/[id]` have no session/role check at all — any unauthenticated request can read every applicant's PII or change shortlist status. | `app/api/admin/applicants/route.js`, `app/api/shortlist/[id]/route.js` | Data exposure / unauthorized writes |
| **Medium** | The `/admin` page's server component fetches all applicant data unconditionally and passes it to the client before any auth check happens — access control is effectively client-side only. | `app/(pages)/admin/page.jsx` | Data exposure to unauthenticated visitors |
| **Low** | Application deadline is hardcoded to a fixed date in `app/api/submit-form/route.js` rather than pulled from config — will need a code change (not just a config change) whenever the deadline shifts. | `app/api/submit-form/route.js` | Submissions silently rejected once date passes |
| **Low** | `app/_error.js` is a Pages Router convention and does nothing in the App Router; the app has no real global error boundary (`app/error.jsx`). | `app/_error.js` | Unhandled errors render Next.js's default screen instead of app UI |

Recommend closing the two admin-route items before any real applicant data goes through this again.

---

## 📁 Files Touched This Cycle

- `app/(pages)/join/[...joinIds]/page.jsx` — removed auth gate
- `components/FormComp.jsx` — lazy-registration submit flow, email field/validation changes
- `app/api/auth/[...all]/route.js` — Better Auth catch-all route
- `.env` — Firebase private key formatting (value only; file itself is gitignored)
- `components/Hero.jsx` (or wherever the landing page hero lives) — spacing fixes
- Department icon assets — `cloud.svg` fix

---

## 🎀 Submission Checklist

- [ ] `.env` confirmed absent from `git log --all --full-history -- .env` (or secrets rotated if it ever appeared)
- [ ] `WORK.md` present at repo root
- [ ] `README.md` present with setup instructions (see *How to Run This Project* above)

- [ ] `node_modules/`, `.next/`, `coverage/` excluded via `.gitignore`
- [ ] Repo visibility (public/private) set as instructed
- [ ] High-priority item from Known Issues addressed, or explicitly called out as outstanding in the submission

## 🌟 Suggested Next Steps

1. Add auth/role checks to the two admin API routes and gate the `/admin` page server-side before fetching data.
2. Move the submission deadline to an environment variable.
3. Add `app/error.jsx` (and optionally `app/global-error.jsx`) as a proper App Router error boundary.
4. Run a full local `npm install && npm run build` pass — this cycle's changes were reviewed statically; a real build/dev run is still worth doing before merging.