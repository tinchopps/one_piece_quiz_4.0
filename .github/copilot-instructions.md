
# Copilot Instructions for OnePieceQuiz

## Project Overview
- **Type:** React Native + Expo (TypeScript, Expo Router v5)
- **Purpose:** One Piece quiz game with saga progression, feedback, and web/mobile deploy
- **Deploy:** Netlify (web), Expo Go (mobile)

## Key Architectural Patterns
- **Routing:** All screens in `app/` (Expo Router). SPA routing for Netlify handled by `_redirects` file (copied postbuild).
- **State:** Global game state via `GameContext` (`context/GameContext.tsx`).
- **Feedback System:**
  - Core logic in `services/feedback.ts` (local, AsyncStorage)
  - Remote feedback sent to Supabase via `services/feedbackService.ts`
  - Types in `types/game.ts` (`QuestionFeedback`, `FeedbackCategory`, etc.)
  - UI in `components/FeedbackViewer.tsx` (view, copy, clear feedback)
- **UI Components:** All reusable UI in `components/ui/`
- **Data:** Questions fetched via `services/questionsApi.ts`. Local storage via `services/storage.ts`.
- **Supabase Integration:**
  - Feedback is sent to Supabase table `feedback` using REST API (`feedbackService.ts`).
  - Future: Admin panel (ABM) and question management will use Supabase for authentication, roles, and CRUD.

## Coding Conventions
- **TypeScript strict mode:** Always type props, state, and function signatures.
- **Imports:** Use `@/` alias for root imports (configured in `tsconfig.json`).
- **Components:** Functional components with hooks. Use `useGame()` for game state.
- **Async:** Use async/await for all async logic. Handle errors with try/catch and user feedback.
- **UI:** Use `LinearGradient` for backgrounds, `Card` for content blocks, and `Button` for actions.
- **Feedback:** Always persist feedback using `FeedbackService.saveFeedback` (local) and send to Supabase (remote). Use categories and comments for detailed analysis.

## Workflows
- **Add a new screen:**
  1. Create file in `app/` (or `app/(tabs)/` for tab screens)
  2. Add to router if needed in `app/_layout.tsx`
- **Add a new feedback type:**
  1. Update `FeedbackCategory` in `types/game.ts`
  2. Update translations in `FeedbackService.getCategoryTranslation`
  3. Update UI in `FeedbackViewer` if needed
- **Export feedback for analysis:** Use `FeedbackViewer` “copy” button (calls `FeedbackService.generateExportData`)
- **SPA routing for Netlify:** Ensure `_redirects` is present in `dist/` after build (see postbuild script in `package.json`)
- **Verify question counts (CLI):**
  - Run CLI utilities in `services/questionsApi.ts` and `services/questionsDbOrdered.ts` to check question distribution by saga/difficulty. Use `npx ts-node` for execution.
- **Supabase feedback flow:**
  - All user feedback is sent to Supabase via `sendFeedback` in `feedbackService.ts`.
  - For new admin features, use Supabase for authentication, role-based access, and CRUD (see Roadmap).

## Best Practices
- **No direct state mutation.**
- **No logic in UI components that belongs in services.**
- **Keep feedback system extensible and user-friendly.**
- **Always update types and translations together.**
- **Test on both web and mobile before merging.**
- **Keep Supabase keys secure and use environment variables for production.**

## Roadmap / Admin Panel (ABM)
- **Planned:**
  - Admin panel for question management (CRUD) with authentication and roles (Supabase Auth)
  - All questions and feedback to be managed via Supabase tables
  - Role-based access: only admins can edit/add/delete questions
  - UI: React/Expo, protected routes, user management
  - Sync local and remote DB for offline/online support

## References
- `README.md`: Project intro, scripts, deploy info
- `types/game.ts`: All core types/interfaces
- `services/feedback.ts`: Feedback logic (local)
- `services/feedbackService.ts`: Feedback logic (Supabase/remote)
- `components/FeedbackViewer.tsx`: Feedback UI
- `app/_layout.tsx`: Router config
- `package.json`: Scripts, postbuild
- `services/questionsApi.ts`, `services/questionsDbOrdered.ts`: Question DBs and CLI utilities

---
For any new features, follow the above conventions and update this file if project patterns change.
