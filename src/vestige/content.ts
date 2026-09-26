export type Language = "es" | "en";
export type ThemePreference = "system" | "light" | "dark";
export type LocalizedText = Record<Language, string>;

export const privacyPath = "/vestige/privacy/";
export const contributePath = "/contribute/";

export const text = {
  es: {
    skip: "Saltar al contenido",
    product: "Galería",
    privacy: "Privacidad",
    credits: "Créditos",
    contribute: "Contribuir",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    language: "Idioma",
    back: "Volver a Vestige",
    eyebrow: "Gratis · Sin anuncios",
    title: "Vestige",
    lead: "Guarda un segundo de vídeo al día y crea una película con tus recuerdos.",
    readPrivacy: "Leer la política de privacidad",
    galleryTitle: "Galería",
    recallEyebrow: "Propósito",
    recallTitle: "Por qué deberías guardar un segundo al día",
    recallExplanation: "La memoria humana funciona mediante redes neuronales latentes. Un segundo de vídeo sirve como un ancla cognitiva que reactiva la experiencia entera: lo que sentías, lo que se dijo y lo que parecía perdido.",
    recallReflection: "Al reunir esos segundos, puedes verte desde fuera: a quién dedicas tus días, qué se repite y qué sigues posponiendo. Mirar atrás te hace consciente del tiempo que tienes y te invita a preguntarte si lo estás dedicando a la vida que quieres vivir.",
    privacyEyebrow: "Privacidad",
    privacyTitle: "Sin cuenta ni subidas",
    privacyIntro: "Vestige no tiene cuentas ni servidores propios: solo procesa, en tu teléfono, los archivos que tú eliges.",
    privacyLink: "Política de privacidad",
    storageTitle: "Archivos",
    storageBody: "Los clips se exportan como MP4 en la carpeta de Vestige; las fechas y los ajustes quedan en el espacio privado de la app.",
    networkTitle: "Sin seguimiento",
    networkBody: "Sin anuncios ni analítica de ningún tipo, ni identificadores publicitarios.",
    controlTitle: "Tú los borras",
    controlBody: "Bórralos desde Vestige o un gestor de archivos. Desinstalar la app no elimina los MP4.",
    creditsEyebrow: "Componentes de terceros",
    creditsTitle: "Librerías y licencias",
    contributeEyebrow: "Proyecto independiente",
    contributeTitle: "Apoya su desarrollo",
    contributeIntro: "Vestige nació como un proyecto personal, no con fines de lucro. Puedes usar todas sus funciones de forma 100% gratuita. Si aun así te gustaría apoyar el desarrollo, cualquier aportación me demuestra que la app es útil para más personas y me motiva a seguir mejorándola.",
    contributeLink: "Contribuir",
    verified: "Revisado el 19 de septiembre de 2026",
    footer: "Vestige · Diario de vídeo sin cuenta",
  },
  en: {
    skip: "Skip to content",
    product: "Gallery",
    privacy: "Privacy",
    credits: "Credits",
    contribute: "Contribute",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    back: "Back to Vestige",
    eyebrow: "Free · No ads",
    title: "Vestige",
    lead: "Save a second of video each day and create a film from your moments.",
    readPrivacy: "Read the privacy policy",
    galleryTitle: "Gallery",
    recallEyebrow: "Purpose",
    recallTitle: "Why you should save a second each day",
    recallExplanation: "Human memory relies on latent neural networks. A single second of video serves as a cognitive anchor that reactivates the entire experience: how you felt, what was said, and what seemed lost.",
    recallReflection: "Bringing those seconds together lets you see yourself from the outside: who you dedicate your days to, what patterns repeat, and what you keep putting off. Looking back makes you aware of the time you truly have, inviting you to ask yourself if you are spending it on the life you want to live.",
    privacyEyebrow: "Privacy",
    privacyTitle: "No account. No uploads.",
    privacyIntro: "Vestige has no accounts and no servers of its own: it only processes, on your phone, the files you choose.",
    privacyLink: "Privacy policy",
    storageTitle: "Files",
    storageBody: "Clips are exported as MP4s into Vestige's folder; dates and settings stay in the app's private storage.",
    networkTitle: "No tracking",
    networkBody: "No ads, no analytics of any kind, and no advertising identifiers.",
    controlTitle: "Delete your clips",
    controlBody: "Delete clips in Vestige or a file manager. Uninstalling the app doesn't remove the MP4s.",
    creditsEyebrow: "Third-party components",
    creditsTitle: "Libraries and licenses",
    contributeEyebrow: "Independent project",
    contributeTitle: "Support development",
    contributeIntro: "Vestige started as a personal project, not a business. All features are 100% free to use. If you'd still like to support its development, any contribution shows me the app is valuable to others and motivates me to keep improving it.",
    contributeLink: "Contribute",
    verified: "Reviewed September 19, 2026",
    footer: "Vestige · An offline video diary",
  },
} as const;

export const privacySections: Array<{
  title: LocalizedText;
  paragraphs: Record<Language, string[]>;
}> = [
  {
    title: { es: "1. Responsable y alcance", en: "1. Controller and scope" },
    paragraphs: {
      es: [
        "Esta política describe el tratamiento de datos de Vestige, desarrollado y publicado por anderbggo. No se aplica a los sitios o servicios externos que abras desde él.",
        "Vestige funciona sin registro ni cuenta de usuario.",
      ],
      en: [
        "This policy describes data handling in Vestige, developed and published by anderbggo. It does not apply to external sites or services opened from it.",
        "Vestige works without registration or a user account.",
      ],
    },
  },
  {
    title: { es: "2. Datos y archivos tratados en el dispositivo", en: "2. Data and files handled on the device" },
    paragraphs: {
      es: [
        "Cuando eliges una foto o un vídeo, Vestige accede exclusivamente al elemento seleccionado para recortarlo, convertirlo o añadir la fecha. Este tratamiento se realiza localmente en el dispositivo.",
        "Vestige guarda un índice local con la fecha asignada y la ubicación de cada clip, además de preferencias como idioma, apariencia, duración, formato y posición de fecha, y configuración del recordatorio diario.",
        "Vestige puede conservar copias temporales de trabajo en su caché privada hasta que el sistema o el propio Vestige las eliminen.",
      ],
      en: [
        "When you choose a photo or video, Vestige accesses only the selected item to trim it, convert it, or add the date. This processing happens locally on the device.",
        "Vestige stores a local index containing each assigned date and clip location, along with preferences such as language, appearance, duration, date format and position, and daily reminder settings.",
        "Vestige may retain temporary working copies in its private cache until the system or Vestige removes them.",
      ],
    },
  },
  {
    title: { es: "3. Recogida, transmisión y terceros", en: "3. Collection, transmission, and third parties" },
    paragraphs: {
      es: [
        "Vestige no recoge ni transmite datos personales a servidores del desarrollador. No vende ni comparte datos, y no contiene publicidad, analítica, telemetría, seguimiento ni identificadores publicitarios.",
        "Vestige no solicita acceso a internet. Si abres la página de información del proyecto, el sistema la entrega a tu navegador; desde ese momento se aplican las condiciones y la política del navegador y del sitio web.",
        "La distribución a través de tiendas o plataformas de terceros está sujeta al tratamiento independiente de cada proveedor. Ese tratamiento no forma parte de Vestige.",
      ],
      en: [
        "Vestige does not collect or transmit personal data to developer-operated servers. It does not sell or share data and contains no advertising, analytics, telemetry, tracking, or advertising identifiers.",
        "Vestige does not request internet access. If you open the project information page, the system hands it to your browser; the browser's and website's terms and privacy policy then apply.",
        "Distribution through third-party stores or platforms is subject to each provider's independent processing. That processing is not part of Vestige.",
      ],
    },
  },
  {
    title: { es: "4. Permisos", en: "4. Permissions" },
    paragraphs: {
      es: [
        "Las notificaciones son opcionales y se usan únicamente para programar el recordatorio diario en el dispositivo. Vestige puede volver a programarlo después de reiniciar el dispositivo.",
        "La selección de fotos, vídeos y carpetas se realiza mediante selectores del sistema iniciados por ti. Si autorizas una carpeta para recuperar clips, el sistema puede conceder a Vestige acceso persistente limitado a ella; puedes revocarlo desde sus ajustes.",
      ],
      en: [
        "Notifications are optional and are used only to schedule the daily on-device reminder. Vestige may schedule it again after the device restarts.",
        "Photo, video, and folder selection uses system pickers that you initiate. If you authorize a folder to recover clips, the system may grant Vestige persistent access limited to it; you can revoke that access in system settings.",
      ],
    },
  },
  {
    title: { es: "5. Conservación y eliminación", en: "5. Retention and deletion" },
    paragraphs: {
      es: [
        "Los clips exportados se guardan como MP4 en la carpeta dedicada de Vestige y permanecen allí hasta que los borres desde Vestige, desde la galería o desde un gestor de archivos. Se conservan deliberadamente al desinstalar para evitar la pérdida de recuerdos.",
        "Al desinstalar Vestige, el sistema elimina su índice, sus preferencias y su caché privados. También puedes borrar estos datos desde los ajustes del sistema. Vestige no conserva ninguna copia remota que debas solicitar eliminar.",
      ],
      en: [
        "Exported clips are stored as MP4 files in Vestige's dedicated folder and remain there until you delete them through Vestige, the gallery, or a file manager. They deliberately survive uninstalling to prevent memories from being lost.",
        "When Vestige is uninstalled, the system removes its private index, preferences, and cache. You can also clear this data through system settings. Vestige holds no remote copy that you need to request deletion of.",
      ],
    },
  },
  {
    title: { es: "6. Seguridad", en: "6. Security" },
    paragraphs: {
      es: [
        "Los datos privados de Vestige se almacenan en el espacio aislado que proporciona el sistema operativo. Los vídeos guardados fuera de ese espacio están sujetos a la seguridad, copias de respaldo y servicios con acceso al almacenamiento que configures en tu dispositivo.",
        "Ningún sistema local elimina por completo el riesgo de pérdida. Mantener copias de seguridad de tus vídeos importantes es responsabilidad del usuario.",
      ],
      en: [
        "Vestige's private data is stored in the isolated space provided by the operating system. Videos saved outside that space are subject to the security, backups, and storage access settings configured on your device.",
        "No local system can completely eliminate the risk of loss. Users are responsible for keeping backups of important videos.",
      ],
    },
  },
  {
    title: { es: "7. Menores", en: "7. Children" },
    paragraphs: {
      es: ["Vestige no está dirigida específicamente a menores y no recoge datos personales de usuarios de ninguna edad. Los adultos responsables deben supervisar el contenido que los menores guarden en el dispositivo."],
      en: ["Vestige is not specifically directed at children and does not collect personal data from users of any age. Responsible adults should supervise content that children store on the device."],
    },
  },
  {
    title: { es: "8. Cambios", en: "8. Changes" },
    paragraphs: {
      es: ["Esta política puede actualizarse cuando cambien las funciones o los requisitos legales. La fecha de revisión se mostrará siempre en esta página."],
      en: ["This policy may be updated when features or legal requirements change. The revision date will always appear on this page."],
    },
  },
];

export const libraries = [
  ["Flutter & Dart", "Interfaz y plataforma", "Interface and platform", "BSD 3-Clause", "https://github.com/flutter/flutter/blob/master/LICENSE"],
  ["video_player", "Reproducción local", "Local playback", "BSD 3-Clause", "https://pub.dev/packages/video_player/license"],
  ["path & path_provider", "Rutas y almacenamiento", "Paths and storage", "BSD 3-Clause", "https://pub.dev/packages/path_provider/license"],
  ["flutter_svg", "Gráficos vectoriales", "Vector graphics", "MIT", "https://pub.dev/packages/flutter_svg/license"],
  ["url_launcher", "Enlaces externos", "External links", "BSD 3-Clause", "https://pub.dev/packages/url_launcher/license"],
  ["Cupertino Icons", "Iconografía", "Iconography", "MIT", "https://pub.dev/packages/cupertino_icons/license"],
  ["AndroidX Media3", "Edición y exportación", "Editing and export", "Apache 2.0", "https://github.com/androidx/media/blob/release/LICENSE"],
  ["Manrope & Newsreader", "Tipografías", "Typefaces", "SIL OFL 1.1", "https://openfontlicense.org/"],
] as const;

export const screenshots = [
  ["calendar-dark.jpg", "Calendario anual de Vestige", "Vestige annual calendar", "Calendario anual", "Year calendar"],
  ["clip-detail-dark.jpg", "Detalle de un clip guardado", "Saved clip detail", "Reproduce tus clips por fecha", "Play clips by date"],
  ["trim-editor-dark.jpg", "Editor de recorte preciso", "Precise trim editor", "Recorta el inicio exacto", "Trim to the exact start"],
  ["compilation-creator-dark.jpg", "Creación de una compilación", "Compilation creation", "Crea tu compilación", "Create your compilation"],
  ["settings-light.jpg", "Ajustes en modo claro", "Settings in light mode", "Ajustes", "Settings"],
] as const;