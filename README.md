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
  pages/       Home.tsx, Lab.tsx — componen las rutas
  sections/    Hero, About, Portfolio, Footer
  i18n/        LanguageContext + diccionarios es/en
  styles/      tokens.css (paleta, tipografía, spacing) + global.css
  lib/         utilidades de MediaPipe / Three.js (Phase 2+)
```

## Paleta

`space-indigo` `violet-twilight` `hyper-magenta` `orchid-mist` `pastel-petal` — definidos como custom properties en `src/styles/tokens.css`.

## Tipografía

- Display: **Space Grotesk** (títulos, hero)
- Body: **Instrument Sans** (texto largo, bios, case studies)
- Utility/mono: **Space Mono** (labels, tags, data readouts de landmarks)

## Roadmap de fases

- [x] **Phase 0** — Setup: scaffold, routing, tokens, i18n, secciones placeholder
- [ ] **Phase 1** — Sitio base con contenido placeholder pulido visualmente (sin cámara)
- [ ] **Phase 2** — Hero interactivo: orbe + partículas reaccionando a la mano vía MediaPipe
- [ ] **Phase 3** — Lab: rotación de objeto 3D con la mano + footer con partículas formando la frase en scroll
- [ ] **Phase 4** — Contenido real (proyectos, fotos, bio) reemplazando placeholders
- [ ] **Phase 5** — Pulido, accesibilidad, performance, deploy a Vercel

## Future improvements

- **Modelo de datos de proyectos**: hoy los 4 proyectos están hardcodeados en `src/sections/Portfolio.tsx`. Si el portfolio crece más allá de un puñado de proyectos, migrar a un array/JSON estructurado (`title`, `slug`, `tags`, `cover`, `gallery`, `description.es/en`) para poder mapear el grid dinámicamente y, eventualmente, generar páginas de case study por proyecto.
