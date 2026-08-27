// Shared project model — the Portfolio carousel and the /portfolio/:slug detail
// page both read from this list. See README "Future improvements" for the
// original placeholder-array note this replaced.

interface Localized {
  es: string
  en: string
}

export interface Project {
  slug: string
  title: string
  tag: string
  colors: [string, string]
  cover?: string
  gallery?: string[]
  video?: string
  repo?: string
  summary: Localized
  context: Localized
  role: Localized
  tools: string[]
  process: Localized
}

export const projects: Project[] = [
  {
    slug: 'anatomias-inexistentes',
    title: 'Anatomías [in]existentes',
    tag: 'Interactive',
    colors: ['#e8632a', '#ffb37a'],
    cover: '/projects/anatomias-inexistentes.webp',
    video: 'https://www.youtube.com/watch?v=jbuk6Jg4tFg',
    summary: {
      es: 'Performance interactiva que traduce el movimiento y el sonido de un clarinete en visuales generativas en tiempo real.',
      en: 'An interactive performance that translates a clarinetist\'s movement and sound into real-time generative visuals.',
    },
    context: {
      es: 'Explora cómo la tecnología aplicada puede convertir un instrumento acústico en una interfaz para controlar imagen y sonido en vivo. El concepto imagina estructuras orgánicas (raíces, venas) creciendo del clarinete: anatomías que no existen, generadas en tiempo real a partir del propio gesto del intérprete.',
      en: 'Explores how applied technology can turn an acoustic instrument into a live interface for controlling image and sound. The concept imagines organic structures, roots, veins, growing out of the clarinet: nonexistent anatomies generated in real time from the performer\'s own gesture.',
    },
    role: {
      es: 'Investigación, diseño de interacción y desarrollo técnico de punta a punta.',
      en: 'End-to-end research, interaction design, and technical development.',
    },
    tools: ['TouchDesigner', 'Gyroscope', 'MediaPipe', 'Teachable Machine', 'Ableton Live'],
    process: {
      es: 'TouchDesigner corre como motor principal. Un giroscopio captura los movimientos naturales del clarinetista, MediaPipe trackea su posición en cámara, un modelo entrenado en Teachable Machine reconoce las escalas del clarinete y dispara los cambios visuales, y Ableton Live maneja el diseño sonoro.',
      en: 'TouchDesigner runs as the main engine. A gyroscope captures the clarinetist\'s natural movement, MediaPipe tracks their position on camera, a model trained in Teachable Machine recognizes the clarinet scales and triggers the visual changes, and Ableton Live handles the sound design.',
    },
  },
  {
    slug: 'disco-magico',
    title: 'Disco Mágico',
    tag: 'Installation',
    colors: ['#e8632a', '#ffd8a8'],
    cover: '/projects/disco-magico.webp',
    summary: {
      es: 'Instalación informativa que narra la historia de una escultura mexicana memorable, atravesada por el momento histórico y sangriento que vivía el país durante los Juegos Olímpicos México 1968.',
      en: 'An informative installation tracing the story of a memorable Mexican sculpture, set against the bloody historical moment the country was living through during the 1968 Mexico City Olympics.',
    },
    context: {
      es: 'El proyecto retoma la historia de una escultura emblemática de México y la entreteje con el contexto que atravesaba el país en esas fechas: los Juegos Olímpicos México 1968, marcados también por un episodio histórico y sangriento. A través de mapping de video sobre la pieza y un conjunto de pantallas, la instalación invita a reconstruir esa memoria colectiva.',
      en: 'The project revisits the story of an emblematic Mexican sculpture and weaves it together with what the country was going through at the time: the 1968 Mexico City Olympics, also marked by a bloody historical episode. Through video mapping onto the piece and a set of screens, the installation invites viewers to reconstruct that collective memory.',
    },
    role: {
      es: 'Concepto, diseño y desarrollo técnico de punta a punta.',
      en: 'End-to-end concept, design, and technical development.',
    },
    tools: ['Arduino', 'Resolume Arena', 'After Effects', 'Ableton Live'],
    process: {
      es: 'Un Arduino dispara la secuencia de la experiencia, Resolume Arena maneja el mapping de video sobre la escultura y las pantallas, After Effects se usó para crear y editar el material audiovisual proyectado, y Ableton Live maneja el diseño sonoro de la pieza.',
      en: "An Arduino triggers the sequence of the experience, Resolume Arena handles the video mapping onto the sculpture and the screens, After Effects was used to create and edit the projected audiovisual material, and Ableton Live handles the piece's sound design.",
    },
  },
  {
    slug: '3xr',
    title: '3XR',
    tag: 'Interactive',
    colors: ['#ff7e3d', '#e8632a'],
    cover: '/projects/3xr-1.webp',
    gallery: ['/projects/3xr-2.webp', '/projects/3xr-3.webp', '/projects/3xr-4.webp'],
    repo: 'https://github.com/katpachecob/3xr',
    summary: {
      es: 'Experiencia audiovisual interactiva que promueve el cuidado del medio ambiente a través de tres pasos: reducir, reciclar y reutilizar.',
      en: 'An interactive audiovisual experience promoting environmental care through three steps: reduce, reuse, recycle.',
    },
    context: {
      es: '3XR invita al público a asumir compromisos concretos con el medio ambiente. Cada paso (reducir, reciclar, reutilizar) se traduce en un cambio de luz, sonido e imagen generativa, convirtiendo el mensaje ambiental en una experiencia física y sensorial.',
      en: '3XR invites the audience to take concrete commitments toward the environment. Each step, reduce, reuse, recycle, translates into a shift in light, sound, and generative imagery, turning the environmental message into a physical, sensory experience.',
    },
    role: {
      es: 'Concepto, diseño y desarrollo del sistema audiovisual: programación de las visuales, mapeo de la interacción gestual y diseño de sonido.',
      en: 'Concept, design, and development of the audiovisual system: visual programming, gesture-interaction mapping, and sound design.',
    },
    tools: ['TouchDesigner', 'MediaPipe', 'Ableton Live', 'Adobe Premiere'],
    process: {
      es: 'TouchDesigner genera y proyecta las visuales que responden a cada compromiso. MediaPipe trackea el movimiento del participante para disparar los pasos de la experiencia, Ableton Live maneja el diseño sonoro, y Premiere se usó para editar el registro final de la performance.',
      en: 'TouchDesigner generates and projects the visuals that respond to each commitment. MediaPipe tracks the participant\'s movement to trigger the steps of the experience, Ableton Live handles the sound design, and Premiere was used to edit the final performance recording.',
    },
  },
  {
    slug: 'tu-huella',
    title: 'Tu Huella',
    tag: 'Installation',
    colors: ['#ffb37a', '#ffd8a8'],
    cover: '/projects/tu-huella-1.webp',
    gallery: [
      '/projects/tu-huella-2.webp',
      '/projects/tu-huella-3.webp',
      '/projects/tu-huella-4.webp',
    ],
    summary: {
      es: 'Instalación con Arduino que, al acercar la mano, recorre la historia de una huella: primero hermosa, luego progresivamente destruida.',
      en: 'An Arduino-driven installation where a hand reaching toward the sensor triggers a journey through a footprint\'s history: beautiful at first, then gradually destroyed.',
    },
    context: {
      es: 'Al acercar la mano a un Arduino equipado con un sensor de movimiento, se dispara una serie de videos que narran "tu huella" a lo largo de la historia. El recorrido comienza mostrando algo lindo y armonioso, que poco a poco se va destruyendo, invitando a reflexionar sobre el impacto humano con el paso del tiempo.',
      en: 'As a hand approaches an Arduino fitted with a motion sensor, it triggers a series of videos narrating "your footprint" throughout history. The journey starts out beautiful and harmonious, then gradually falls apart, inviting reflection on human impact over time.',
    },
    role: {
      es: 'Concepto, diseño y desarrollo técnico de punta a punta.',
      en: 'End-to-end concept, design, and technical development.',
    },
    tools: ['Arduino', 'TouchDesigner'],
    process: {
      es: 'Un sensor de movimiento conectado a Arduino detecta la cercanía de la mano y envía la señal por serial a TouchDesigner, que dispara y reproduce la secuencia de videos correspondiente al recorrido histórico de la huella.',
      en: 'A motion sensor wired to Arduino detects the hand\'s proximity and sends the signal over serial to TouchDesigner, which triggers and plays back the video sequence tracing the footprint\'s history.',
    },
  },
  {
    slug: 'museo-anamorfosis',
    title: 'Museo de Anamorfosis',
    tag: 'Interactive',
    colors: ['#ff7e3d', '#ffb37a'],
    cover: '/projects/museo-anamorfosis-1.webp',
    repo: 'https://github.com/katpachecob/anamorfosis',
    gallery: [
      '/projects/museo-anamorfosis-2.webp',
      '/projects/museo-anamorfosis-3.webp',
      '/projects/museo-anamorfosis-4.webp',
    ],
    summary: {
      es: 'La realidad cambia según desde dónde la mires: un dispositivo interactivo que bifurca la lectura de una misma obra según el movimiento del espectador.',
      en: 'Reality changes depending on where you look from: an interactive device that forks the reading of a single piece based on the viewer\'s movement.',
    },
    context: {
      es: 'La obra se presenta como un dispositivo interactivo que propone una experiencia de recorrido dividida en dos ejes: uno histórico y otro emocional. A partir del movimiento del espectador hacia la izquierda o la derecha, se accede a dos lecturas distintas de una misma obra, generando una bifurcación constante en la forma de percibir.',
      en: 'The piece takes the form of an interactive device that proposes a journey split across two axes: one historical and one emotional. As the viewer moves left or right, they access two distinct readings of the same work, generating a constant fork in how it is perceived.',
    },
    role: {
      es: 'Participación exclusiva en la programación: desarrollo de la experiencia interactiva en TouchDesigner y creación de un plugin propio para el manejo genérico de DMX.',
      en: 'Involved exclusively in the programming: developed the interactive experience in TouchDesigner and built a custom plugin for generic DMX control.',
    },
    tools: ['TouchDesigner', 'DMX'],
    process: {
      es: 'TouchDesigner maneja la lógica de la bifurcación y las visuales del recorrido según el movimiento del espectador. Para el control de iluminación se desarrolló un plugin propio que permite manejar dispositivos DMX de forma genérica directamente desde TouchDesigner.',
      en: 'TouchDesigner drives the branching logic and the visuals for the journey based on the viewer\'s movement. For lighting control, a custom plugin was built to handle generic DMX devices directly from TouchDesigner.',
    },
  },
]
