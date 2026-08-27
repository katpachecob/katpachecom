# Portfolio — Creative Technologist

Portfolio bilingüe (ES/EN) con un hero interactivo: MediaPipe Hand Landmarker trackea tu mano en cámara y reacciona un campo de partículas sobre un render 3D (orbe glossy en Three.js). Debajo del hero, scroll normal por Sobre mí y Portfolio; el footer cierra con la frase firma "Ideas can be real".

## Stack

- React + TypeScript + Vite
- react-router-dom (`/` y `/lab`)
- CSS Modules + custom properties para el sistema de tokens (`src/styles/tokens.css`)
- i18n hecho a mano (`src/i18n`) — Context + JSON, sin librería
- Three.js + @react-three/fiber + @react-three/drei (orbe, partículas, Lab)
- @mediapipe/tasks-vision (Hand Landmarker, todo el procesamiento corre client-side)
- Framer Motion (transiciones)

## Correr en local

```bash
npm install
npm run dev
```

## Estructura

```
src/
  pages/               Home.tsx, Lab.tsx, ProjectDetail.tsx — componen las rutas
  sections/            Hero, About, Portfolio, Contact, Footer
  components/          Reveal, CameraBadge, ParticleText, DisclaimerModal — reusables entre secciones
  data/                projects.ts — modelo de datos de los proyectos (bilingüe)
  three/                HandTrail, PortfolioCarousel, LabScene
  lib/mediapipe/        useHandTracking — hook de cámara + Hand Landmarker
  lib/audio/           useHandSynth — sintetizador Web Audio controlado por mano
  lib/                  prefersReducedMotion
  i18n/                LanguageContext + diccionarios es/en
  styles/              tokens.css (paleta, tipografía, spacing) + global.css
```

### Hand tracking

`useHandTracking` (`src/lib/mediapipe/`) pide cámara, corre `@mediapipe/tasks-vision` Hand Landmarker en modo VIDEO y expone la posición de la palma vía un `ref` (no state — evita re-render en cada frame). El wasm y el modelo se cargan on-demand desde el CDN oficial de Google la primera vez que una sección con cámara se monta; ningún frame de video sale del navegador. Si se deniega el permiso o el navegador no soporta `getUserMedia`, todo cae a un modo ambiente/idle sin romper nada (partículas a la deriva en el Hero, drag manual en el Lab).

## Paleta

`space-indigo` `violet-twilight` `hyper-magenta` `orchid-mist` `pastel-petal` — definidos como custom properties en `src/styles/tokens.css`.

## Tipografía

- Display: **Space Grotesk** (títulos, hero)
- Body: **Instrument Sans** (texto largo, bios, case studies)
- Utility/mono: **Space Mono** (labels, tags, data readouts de landmarks)

## Roadmap de fases

- [x] **Phase 0** — Setup: scaffold, routing, tokens, i18n, secciones placeholder
- [x] **Phase 1** — Sitio base con contenido placeholder pulido visualmente (sin cámara)
- [x] **Phase 2** — Hero interactivo: orbe + partículas reaccionando a la mano vía MediaPipe
- [x] **Phase 3** — Lab: rotación de objeto 3D con la mano (+ fallback de drag) + footer con partículas reales formando "Ideas can be real" en scroll
- [ ] **Phase 4** — Contenido real (tu nombre, bio, los 4 proyectos, imágenes) reemplazando placeholders — **pendiente de tu contenido**
- [ ] **Phase 5** — Accesibilidad/performance ya cubiertos en el camino (reduced motion, focus-visible, lazy-loading de Three.js/MediaPipe por ruta, `sr-only` en el texto de partículas). **Deploy a Vercel pendiente** — falta conectar GitHub/Vercel

## Proyectos

Los 4 proyectos viven en `src/data/projects.ts` (`title`, `slug`, `tag`, `colors`, `summary`, `context`, `role`, `tools`, `process`, todo bilingüe). El grid/carousel (`Portfolio.tsx`) y la página de detalle (`/portfolio/:slug`, `pages/ProjectDetail.tsx`) leen del mismo array. Solo "Anatomías Inexistentes" tiene contenido real; los otros 3 quedan con placeholders hasta tener el material.

## Future improvements

- **Galería por proyecto**: `ProjectDetail` hoy es solo texto (contexto/rol/herramientas/proceso). Si hay fotos/video de las performances, sumar un campo `gallery` al modelo de datos y un bloque de medios en la página de detalle.
