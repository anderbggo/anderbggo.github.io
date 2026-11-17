import type { SiteLanguage } from "../sitePreferences";
import type { AlbumPhoto } from "./PhotoAlbum";

export type RokoCopy = {
  pageTitle: string;
  skip: string;
  languageLabel: string;
  themeLabel: string;
  musicLabel: string;
  light: string;
  dark: string;
  date: string;
  epitaph: string;
  daysSince: (days: string) => string;
  anniversary: (years: number) => string;
  progress: (count: string, lit: number) => string;
  writeLink: string;
  lightPrefix: { lantern: string; candle: string };
  rokoLabel: string;
  rokoPhrases: readonly string[];
  albumTitle: string;
  albumOpen: (description: string) => string;
  albumClose: string;
  albumPrevious: string;
  albumNext: string;
  photos: readonly AlbumPhoto[];
  lightTitle: string;
  lantern: string;
  candle: string;
  lanternHint: string;
  candleHint: string;
  addWords: string;
  optionalTag: string;
  addWordsHint: string;
  letterGreeting: string;
  messageLabel: string;
  messagePlaceholder: string;
  remaining: (count: number) => string;
  signed: string;
  nameLabel: string;
  namePlaceholder: string;
  submit: (kind: "lantern" | "candle", withWords: boolean) => string;
  sending: string;
  success: string;
  lookUp: string;
  error: string;
  cooldown: string;
  loading: string;
  loadError: string;
  retry: string;
};

export const copy: Record<SiteLanguage, RokoCopy> = {
  es: {
    pageTitle: "Roko",
    skip: "Saltar al contenido",
    languageLabel: "Idioma",
    themeLabel: "Tema",
    musicLabel: "Música",
    light: "Claro",
    dark: "Oscuro",
    date: "24 · Octubre · 2021",
    epitaph: "La muerte es el último viaje, el más largo y el mejor. Hasta siempre, amigo.",
    daysSince: (days) => `Lleva ${days} días persiguiendo pelotas por otro sitio.`,
    anniversary: (years) => `Hoy hace ${years} ${years === 1 ? "año" : "años"} que se fue. Enciéndele algo.`,
    progress: (count, lit) =>
      lit === 0 ? "Todavía no hay ninguna luz. ¿Enciendes la primera?" : `${count} ${lit === 1 ? "luz encendida" : "luces encendidas"} por él.`,
    writeLink: "Enciéndele una luz",
    lightPrefix: { lantern: "Farolillo", candle: "Vela" },
    rokoLabel: "Roko, sentado en la colina mirando el cielo",
    rokoPhrases: ["¿Galleta?", "¡Guau!", "¿Hay pelota?", "Lo sé, soy buen chico.", "¿Paseo?", "*ladea la cabeza*"],
    albumTitle: "Así era",
    albumOpen: (description) => `Ampliar foto: ${description}`,
    albumClose: "Cerrar",
    albumPrevious: "Foto anterior",
    albumNext: "Foto siguiente",
    photos: [
      {
        id: "posando",
        alt: "Roko sentado de perfil en casa, con la cabeza levantada y mirando hacia arriba.",
        caption: "Posando como quien sabe que es guapo.",
      },
      {
        id: "costa",
        alt: "Roko sonriendo con la lengua fuera sobre la hierba, con el mar de fondo.",
      },
      {
        id: "sonrisa",
        alt: "Roko tumbado en una terraza, con los ojos cerrados y la boca abierta, muy contento.",
      },
      {
        id: "manta",
        alt: "Roko tumbado en el suelo, tapado con una toalla de colores y una manta.",
      },
      {
        id: "gafas",
        alt: "Roko sentado con unas gafas de bucear en la cabeza.",
        caption: "Equipado por si tocaba bucear.",
      },
    ],
    lightTitle: "Enciéndele una luz",
    lantern: "Farolillo",
    candle: "Vela",
    lanternHint: "Sube al cielo con los demás.",
    candleHint: "Se queda en la colina, a su lado.",
    addWords: "Dejarle unas palabras",
    optionalTag: "Opcional",
    addWordsHint: "Lo que escribas se verá al pasar por encima de tu luz.",
    letterGreeting: "Querido Roko:",
    messageLabel: "Tu mensaje para Roko",
    messagePlaceholder: "el sofá está demasiado limpio sin tus pelos blancos…",
    remaining: (count) => `${count} letras`,
    signed: "Firmado:",
    nameLabel: "Tu nombre",
    namePlaceholder: "alguien que le quería",
    submit: (kind, withWords) =>
      `${withWords ? "Sellar y " : ""}${
        kind === "lantern" ? (withWords ? "soltar el farolillo" : "Soltar el farolillo") : withWords ? "encender la vela" : "Encender la vela"
      }`,
    sending: "Encendiendo…",
    success: "Hecho. Hay una luz nueva ahí arriba.",
    lookUp: "Mirar arriba",
    error: "No se ha podido enviar. Prueba otra vez en un momento.",
    cooldown: "Acabas de enviar una. Dale unos segundos.",
    loading: "Buscando luces…",
    loadError: "No se han podido cargar las luces.",
    retry: "Reintentar",
  },
  en: {
    pageTitle: "Roko",
    skip: "Skip to content",
    languageLabel: "Language",
    themeLabel: "Theme",
    musicLabel: "Music",
    light: "Light",
    dark: "Dark",
    date: "24 · October · 2021",
    epitaph: "Death is the last journey, the longest and the best. Farewell, my friend.",
    daysSince: (days) => `He has spent ${days} days chasing balls somewhere else.`,
    anniversary: (years) => `${years} ${years === 1 ? "year" : "years"} ago today. Light something for him.`,
    progress: (count, lit) =>
      lit === 0 ? "No lights yet. Will you light the first one?" : `${count} ${lit === 1 ? "light" : "lights"} lit for him.`,
    writeLink: "Light something for him",
    lightPrefix: { lantern: "Lantern", candle: "Candle" },
    rokoLabel: "Roko, sitting on the hill looking up at the sky",
    rokoPhrases: ["Treat?", "Woof!", "Is that a ball?", "I know, I'm a good boy.", "Walk?", "*tilts head*"],
    albumTitle: "This was him",
    albumOpen: (description) => `Enlarge photo: ${description}`,
    albumClose: "Close",
    albumPrevious: "Previous photo",
    albumNext: "Next photo",
    photos: [
      {
        id: "posando",
        alt: "Roko sitting in profile at home, head raised, looking up.",
        caption: "Posing like he knew he was handsome.",
      },
      {
        id: "costa",
        alt: "Roko smiling with his tongue out on the grass, the sea behind him.",
      },
      {
        id: "sonrisa",
        alt: "Roko lying on a terrace, eyes closed and mouth open, very happy.",
      },
      {
        id: "manta",
        alt: "Roko lying on the floor, tucked under a colourful towel and a blanket.",
      },
      {
        id: "gafas",
        alt: "Roko sitting with a pair of diving goggles on his head.",
        caption: "Fully equipped, in case there was diving to do.",
      },
    ],
    lightTitle: "Light something for him",
    lantern: "Lantern",
    candle: "Candle",
    lanternHint: "It rises to the sky with the others.",
    candleHint: "It stays on the hill, right next to him.",
    addWords: "Leave him a few words",
    optionalTag: "Optional",
    addWordsHint: "What you write will show when someone hovers over your light.",
    letterGreeting: "Dear Roko,",
    messageLabel: "Your message for Roko",
    messagePlaceholder: "the sofa is far too clean without your white hair…",
    remaining: (count) => `${count} characters`,
    signed: "Signed:",
    nameLabel: "Your name",
    namePlaceholder: "someone who loved him",
    submit: (kind, withWords) =>
      `${withWords ? "Seal and " : ""}${
        kind === "lantern" ? (withWords ? "release the lantern" : "Release the lantern") : withWords ? "light the candle" : "Light the candle"
      }`,
    sending: "Lighting…",
    success: "Done. There's a new light up there.",
    lookUp: "Look up",
    error: "It couldn't be sent. Please try again in a moment.",
    cooldown: "You just sent one. Give it a few seconds.",
    loading: "Looking for lights…",
    loadError: "The lights couldn't be loaded.",
    retry: "Retry",
  },
};
