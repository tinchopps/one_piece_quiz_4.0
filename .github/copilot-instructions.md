

# Copilot Instructions — OnePieceQuiz

## Big Picture & Architecture
- React Native + Expo (TypeScript, Expo Router v5). Web (Netlify) y mobile (Expo Go).
- Juego de preguntas por sagas, con dos modos: Historia (progresivo, desbloqueo) y Libre (personalizado, sin desbloqueo).
- Estado global en `context/GameContext.tsx` (sagas = historia, customSagas = libre, gameStats, helpers). No mezclar progresos.
- Almacenamiento local con AsyncStorage (`services/storage.ts`):
  - Clave `saga_progress` para historia, `custom_progress` para libre. Ambas se auto-actualizan si hay nuevas sagas.
- Preguntas: `services/questionsApi.ts` busca primero en Supabase (`supabase.from('questions')`), si falla o no hay datos, usa base local (`QUESTIONS_DB`).
  - Filtros: saga, dificultad, cantidad. Si es historia y amount=10, usa `getStoryModeQuestions` para distribución/orden.
  - Opciones pueden venir como string JSON (parsear). Logs: “❌ Error al obtener preguntas de Supabase...” o “📚 Usando base de datos local...”.
- Feedback: local (`services/feedback.ts`), remoto (`services/feedbackService.ts` a Supabase). UI en `components/FeedbackViewer.tsx`.
- Admin: screens en `app/admin/*` (gestión de preguntas, feedback, futuro ABM).

## Progreso por Modo (clave)
- Historia: actualizar solo con `updateSagaProgress` (unlock, completed, bestScore = max(prevBest, score)).
- Libre: actualizar solo con `updateCustomProgress` (NO unlock, NO completed, bestScore propio).
- UI de progreso libre debe leer `customSagas`, no `sagas`.
- No mezclar ni sobrescribir progresos entre modos.

## Workflows & Debug
- Dev: `npm run dev` (Expo local).
- Web build: `npm run build:web` (copia `_redirects` para SPA Netlify).
- Lint: `npm run lint`.
- CLI para analizar preguntas: `npx ts-node services/questionsDbOrdered.ts` o helpers en `services/questionsApi.ts`.
- Debug preguntas: mirá logs en consola Metro/devtools.
- Para forzar solo Supabase (sin fallback), lanzar error si no hay datos tras la query en `getQuestions`.

## Convenciones y Patrones
- TypeScript estricto, imports con alias `@/` (ver `tsconfig.json`).
- Lógica de negocio en servicios/contexto, no en UI. UI reutilizable en `components/ui/`.
- No mutar estado directo. Usar helpers de contexto.
- Mantener IDs de sagas estables (no romper progresos guardados).

## Integraciones
- Supabase: preguntas (`questions`), feedback (`feedback`). Cliente en `services/supabaseClient.ts`. Mantener keys en env para prod.
- Admin: screens en `app/admin/*` (feedback, preguntas, futuro ABM con roles/auth).

## Gotchas
- Si agregás sagas en `constants/sagas.ts`, los helpers de storage las acoplan al progreso guardado.
- No mezcles ni muestres progreso de historia en modo libre ni viceversa.
- En modo libre, nunca desbloquees ni marques completed en historia.
- Si ves “Usando base de datos local…” en logs, Supabase falló o no hay datos.

## Testing & Extensión
- Testeá tanto en web como mobile antes de mergear.
- Si agregás features (admin, auth, tests e2e), documentá el patrón acá.

## Key Files & Ejemplos
- Estado/juego: `context/GameContext.tsx`
- Storage: `services/storage.ts`
- Preguntas: `services/questionsApi.ts`, `services/questionsDbOrdered.ts`
- Sagas base: `constants/sagas.ts`, `constants/sagas.ts` (`SAGA_EMOJIS`)
- Quiz flow: `app/quiz.tsx`
- Admin: `app/admin/*`
- Feedback: `services/feedback.ts`, `services/feedbackService.ts`, `components/FeedbackViewer.tsx`

---
Si cambiás patrones, actualizá este documento. Si querés ampliar (admin, auth, tests, Supabase schema), pedilo.

---
Si cambias patrones, actualiza este documento. Dime qué sección te gustaría ampliar (tests, admin/ABM, Supabase auth) y la extendemos.
