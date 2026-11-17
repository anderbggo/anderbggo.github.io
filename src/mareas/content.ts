import type { SiteLanguage } from "../sitePreferences";

export const homePath = "/mareasES/";
export const privacyPath = "/mareasES/privacy/";
export const contributePath = "/contribute/";
export const authorUrl = "https://github.com/anderbggo";

export const text = {
  es: {
    skip: "Saltar al contenido",
    features: "Funciones",
    gallery: "Capturas",
    privacy: "Privacidad",
    credits: "Créditos",
    language: "Idioma",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    eyebrow: "Gratis · Sin anuncios · Sin conexión",
    title: "Mareas España",
    lead: "Horas y alturas de pleamar y bajamar de 4.484 playas y calas de España, calculadas en el móvil y sin conexión.",
    store: "Próximamente en Google Play",
    heroAlt: "Ficha de la Praia das Catedrais con el nivel de marea actual, la semana y las mareas del día.",
    featuresTitle: "Funciones",
    featureList: [
      { title: "Marea ahora mismo", body: "Nivel actual, si sube o baja y cuánto falta para la próxima pleamar o bajamar." },
      { title: "Curva del día", body: "Desliza entre días, mantén pulsado para ver cualquier hora y consulta hasta diez años hacia delante o atrás." },
      { title: "Mapa de toda la costa", body: "Busca por nombre, filtra por provincia o explora el mapa agrupado por zonas." },
      { title: "Sol y luna", body: "Amanecer, atardecer y fase lunar, con aviso de mareas vivas en luna nueva y llena." },
      { title: "Favoritas y playa principal", body: "Guarda tus playas y elige una para que se abra directamente al iniciar la app." },
      { title: "Ajustes", body: "Tema claro u oscuro, español o inglés, y alturas en metros o pies." },
    ],
    galleryTitle: "Capturas",
    galleryNote: "Se muestran en el idioma y el tema elegidos en esta web.",
    methodTitle: "Cómo se calcula",
    methodBody: [
      "Cada estación de referencia describe su marea como una suma de ondas armónicas (M2, S2, K1, O1…) con su amplitud y su fase. La app combina esas ondas con la posición del Sol y la Luna para cualquier fecha, el mismo método que usan los anuarios de mareas.",
      "Cada playa usa la más cercana de 61 estaciones. La app muestra esa distancia y una confianza alta, media o baja.",
    ],
    disclaimerTitle: "Solo orientativo",
    disclaimer: "Las predicciones son astronómicas: no incluyen viento, presión atmosférica ni oleaje, y las alturas se dan respecto al nivel medio del mar. No uses Mareas España para navegar ni para decisiones de seguridad; consulta siempre las fuentes oficiales.",
    privacyTitle: "Privacidad",
    privacyLink: "Política de privacidad",
    principles: [
      { title: "Datos en el móvil", body: "Favoritas, playa principal y preferencias se guardan solo en el almacenamiento privado de la app." },
      { title: "Ubicación opcional", body: "Solo sirve para mostrar tu posición en el mapa. No se guarda ni se envía." },
      { title: "Sin cuenta ni analítica", body: "No hay registro, publicidad ni telemetría. Internet solo se usa para cargar el mapa." },
    ],
    creditsTitle: "Créditos y licencias",
    dataTitle: "Fuentes de datos",
    librariesTitle: "Librerías y tipografía",
    nonCommercial: "Por la licencia no comercial de 43 estaciones, la app no puede venderse ni llevar anuncios.",
    contributeTitle: "Apoyar el proyecto",
    contributeIntro: "Mareas España es gratuita. Si quieres apoyar su desarrollo, puedes hacer una aportación.",
    contributeLink: "Contribuir",
    back: "Volver a Mareas España",
    policyTitle: "Política de privacidad",
    policyIntro: "Qué datos usa Mareas España, dónde se guardan y con qué servicios se conecta.",
    contents: "Contenido",
    updated: "Revisado el 12 de octubre de 2026",
    footer: "Mareas España",
    independent: "Proyecto independiente, sin relación con Puertos del Estado ni con el Instituto Hidrográfico de la Marina.",
  },
  en: {
    skip: "Skip to content",
    features: "Features",
    gallery: "Screenshots",
    privacy: "Privacy",
    credits: "Credits",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    eyebrow: "Free · No ads · Offline",
    title: "Mareas España",
    lead: "High and low tide times and heights for 4,484 beaches and coves in Spain, computed on your phone and offline.",
    store: "Coming soon to Google Play",
    heroAlt: "Praia das Catedrais detail screen showing the current tide level, the week and the day's tides.",
    featuresTitle: "Features",
    featureList: [
      { title: "Tide right now", body: "Current level, whether it's rising or falling, and time to the next high or low tide." },
      { title: "Daily curve", body: "Swipe between days, long-press to preview any time, and browse up to ten years ahead or back." },
      { title: "Map of the whole coast", body: "Search by name, filter by province or explore the clustered map." },
      { title: "Sun and moon", body: "Sunrise, sunset and moon phase, with a spring-tide hint at new and full moon." },
      { title: "Favorites and main beach", body: "Save your beaches and pick one to open straight away when the app starts." },
      { title: "Settings", body: "Light or dark theme, Spanish or English, and heights in metres or feet." },
    ],
    galleryTitle: "Screenshots",
    galleryNote: "Shown in the language and theme selected on this website.",
    methodTitle: "How it's computed",
    methodBody: [
      "Each reference station describes its tide as a sum of harmonic waves (M2, S2, K1, O1…) with their amplitude and phase. The app combines those waves with the positions of the Sun and Moon for any date, the same method used in published tide tables.",
      "Each beach uses the nearest of 61 stations. The app shows that distance and a high, medium or low confidence.",
    ],
    disclaimerTitle: "For guidance only",
    disclaimer: "Predictions are astronomical: they don't include wind, air pressure or swell, and heights are relative to mean sea level. Don't use Mareas España for navigation or safety decisions; always check official sources.",
    privacyTitle: "Privacy",
    privacyLink: "Privacy policy",
    principles: [
      { title: "Data on your phone", body: "Favorites, main beach and preferences are stored only in the app's private storage." },
      { title: "Optional location", body: "Only used to show where you are on the map. It isn't stored or sent." },
      { title: "No account or analytics", body: "No sign-up, ads or telemetry. The internet is only used to load the map." },
    ],
    creditsTitle: "Credits and licenses",
    dataTitle: "Data sources",
    librariesTitle: "Libraries and typeface",
    nonCommercial: "Because 43 stations use a non-commercial license, the app can't be sold or show ads.",
    contributeTitle: "Support the project",
    contributeIntro: "Mareas España is free. If you'd like to support its development, you can make a contribution.",
    contributeLink: "Contribute",
    back: "Back to Mareas España",
    policyTitle: "Privacy policy",
    policyIntro: "Which data Mareas España uses, where it's stored and which services it connects to.",
    contents: "Contents",
    updated: "Reviewed October 12, 2026",
    footer: "Mareas España",
    independent: "Independent project, not affiliated with Puertos del Estado or the Spanish Navy Hydrographic Institute.",
  },
} as const;

export const screenshots = [
  { key: "detail", es: ["Ficha de playa con el nivel actual, la semana y las mareas del día", "La marea de hoy"], en: ["Beach detail with the current level, the week and the day's tides", "Today's tide"] },
  { key: "chart", es: ["Curva de marea del día con la hora actual y las noches sombreadas", "Curva del día"], en: ["Daily tide curve with the current time and shaded nights", "Daily curve"] },
  { key: "map", es: ["Mapa de España con las playas agrupadas por zonas", "Mapa de la costa"], en: ["Map of Spain with beaches clustered by area", "Coastal map"] },
  { key: "list", es: ["Lista de playas con el nivel y la próxima marea de cada una", "Lista de playas"], en: ["Beach list with each beach's level and next tide", "Beach list"] },
  { key: "settings", es: ["Ajustes de tema, idioma, unidades y playa principal", "Ajustes"], en: ["Theme, language, units and main beach settings", "Settings"] },
] as const;

export const dataSources: ReadonlyArray<{
  name: string;
  role: Record<SiteLanguage, string>;
  license: string;
  links: ReadonlyArray<{ label: string; url: string }>;
}> = [
  {
    name: "OpenStreetMap",
    role: {
      es: "Nombres y coordenadas de las playas (©\u00a0colaboradores de OpenStreetMap)",
      en: "Beach names and coordinates (©\u00a0OpenStreetMap contributors)",
    },
    license: "ODbL 1.0",
    links: [
      { label: "openstreetmap.org/copyright", url: "https://www.openstreetmap.org/copyright" },
      { label: "ODbL", url: "https://opendatacommons.org/licenses/odbl/" },
    ],
  },
  {
    name: "TICON-4 · Neaps Tide Database",
    role: {
      es: "Constantes armónicas de las 61 estaciones de marea: 18 bajo CC BY 4.0 y 43 bajo CC BY-NC 4.0",
      en: "Harmonic constants for the 61 tide stations: 18 under CC BY 4.0 and 43 under CC BY-NC 4.0",
    },
    license: "CC BY / CC BY-NC 4.0",
    links: [
      { label: "Neaps Tide Database", url: "https://github.com/openwatersio/tide-database" },
      { label: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
      { label: "CC BY-NC 4.0", url: "https://creativecommons.org/licenses/by-nc/4.0/" },
    ],
  },
  {
    name: "OpenStreetMap Foundation",
    role: {
      es: "Teselas del mapa base, servidas por tile.openstreetmap.org",
      en: "Base map tiles, served by tile.openstreetmap.org",
    },
    license: "ODbL 1.0",
    links: [
      { label: "Tile usage policy", url: "https://operations.osmfoundation.org/policies/tiles/" },
    ],
  },
];

export const libraries = [
  ["Flutter & Dart", "Interfaz y plataforma", "Interface and platform", "BSD 3-Clause", "https://github.com/flutter/flutter/blob/master/LICENSE"],
  ["flutter_map", "Mapa", "Map", "BSD 3-Clause", "https://pub.dev/packages/flutter_map/license"],
  ["flutter_map_marker_cluster", "Agrupación de playas en el mapa", "Map marker clustering", "BSD 3-Clause", "https://pub.dev/packages/flutter_map_marker_cluster/license"],
  ["flutter_map_animations", "Animaciones del mapa", "Map animations", "MIT", "https://pub.dev/packages/flutter_map_animations/license"],
  ["latlong2", "Coordenadas y distancias", "Coordinates and distances", "Apache 2.0", "https://pub.dev/packages/latlong2/license"],
  ["geolocator", "Ubicación en el mapa", "Location on the map", "MIT", "https://pub.dev/packages/geolocator/license"],
  ["flutter_riverpod", "Gestión del estado", "State management", "MIT", "https://pub.dev/packages/flutter_riverpod/license"],
  ["shared_preferences", "Preferencias locales", "Local preferences", "BSD 3-Clause", "https://pub.dev/packages/shared_preferences/license"],
  ["url_launcher", "Enlace a esta web", "Link to this website", "BSD 3-Clause", "https://pub.dev/packages/url_launcher/license"],
  ["Manrope", "Tipografía (incluida en la app)", "Typeface (bundled)", "SIL OFL 1.1", "https://openfontlicense.org/"],
] as const;

type PrivacySection = {
  title: string;
  paragraphs: readonly string[];
  links?: ReadonlyArray<{ label: string; url: string }>;
};

export const privacySections: Record<SiteLanguage, readonly PrivacySection[]> = {
  es: [
    {
      title: "1. Responsable y alcance",
      paragraphs: [
        "Esta política describe el tratamiento de datos de la app Mareas España y de esta página web, desarrolladas y publicadas por anderbggo. No se aplica a los sitios o servicios externos que abras desde ellas.",
        "Mareas España funciona sin registro ni cuenta de usuario. Es un proyecto independiente, sin relación con Puertos del Estado, el Instituto Hidrográfico de la Marina ni ningún organismo oficial.",
      ],
    },
    {
      title: "2. Datos guardados en el dispositivo",
      paragraphs: [
        "La app guarda en su almacenamiento privado tus playas favoritas, tu playa principal, el tema, el idioma, las unidades de altura y si ya has visto el consejo de uso inicial.",
        "Las mareas, el sol y la luna se calculan en el propio teléfono a partir de los datos incluidos en la app. Ninguno de estos datos se envía al desarrollador ni a terceros.",
      ],
    },
    {
      title: "3. Ubicación",
      paragraphs: [
        "El permiso de ubicación es opcional y solo se solicita mientras usas la app. Se utiliza únicamente para mostrar tu posición en el mapa y centrarlo en ella.",
        "Tu ubicación se procesa en el dispositivo: no se guarda, no se envía al desarrollador y no se comparte con terceros. Si deniegas el permiso, la app funciona igual sin el punto de posición. Puedes revocarlo cuando quieras desde los ajustes del sistema.",
      ],
    },
    {
      title: "4. Conexiones a internet",
      paragraphs: [
        "Las predicciones y la tipografía están incluidas en la app y no necesitan conexión. La app solo se conecta a internet para cargar el mapa.",
        "Las imágenes del mapa (teselas) se descargan de los servidores de la OpenStreetMap Foundation. Como en cualquier petición web, esos servidores reciben tu dirección IP, el identificador de la app y qué teselas se piden, lo que refleja la zona del mapa que estás viendo. No se envía tu ubicación.",
        "La OpenStreetMap Foundation trata esa información conforme a su propia política de privacidad.",
      ],
      links: [
        { label: "Privacidad de la OpenStreetMap Foundation", url: "https://osmfoundation.org/wiki/Privacy_Policy" },
      ],
    },
    {
      title: "5. Lo que la app no hace",
      paragraphs: [
        "Mareas España no contiene publicidad, analítica, telemetría, informes de errores automáticos, seguimiento ni identificadores publicitarios. No vende ni comparte datos personales.",
        "La distribución a través de Google Play u otras tiendas está sujeta al tratamiento independiente de cada proveedor. Ese tratamiento no forma parte de la app.",
      ],
    },
    {
      title: "6. Conservación y eliminación",
      paragraphs: [
        "Los datos se conservan en tu dispositivo hasta que los cambies en la app. Para borrarlos, elimina los datos de la app desde los ajustes del sistema o desinstálala. No existe ninguna copia remota cuya eliminación debas solicitar.",
      ],
    },
    {
      title: "7. Menores",
      paragraphs: [
        "La app no está dirigida específicamente a menores y no recoge datos personales de usuarios de ninguna edad.",
      ],
    },
    {
      title: "8. Esta página web",
      paragraphs: [
        "Esta web usa el almacenamiento local del navegador para recordar tu idioma y tu tema, compartidos con las demás páginas de anderbggo.github.io. No incluye analítica, anuncios ni cookies de seguimiento. Las tipografías y las imágenes se sirven desde la propia web.",
        "La web se aloja en GitHub Pages. GitHub puede tratar información técnica de las visitas, como la dirección IP, conforme a su propia política de privacidad.",
      ],
      links: [
        { label: "Privacidad de GitHub", url: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" },
      ],
    },
    {
      title: "9. Contacto y cambios",
      paragraphs: [
        "Puedes contactar con el desarrollador a través de su perfil de GitHub. Esta política puede actualizarse cuando cambien las funciones de la app o los requisitos legales; la fecha de revisión aparece siempre al principio de esta página.",
      ],
      links: [{ label: "anderbggo en GitHub", url: authorUrl }],
    },
  ],
  en: [
    {
      title: "1. Controller and scope",
      paragraphs: [
        "This policy describes data handling in the Mareas España app and this website, developed and published by anderbggo. It does not apply to external sites or services opened from them.",
        "Mareas España works without registration or a user account. It is an independent project, not affiliated with Puertos del Estado, the Spanish Navy Hydrographic Institute or any official body.",
      ],
    },
    {
      title: "2. Data stored on the device",
      paragraphs: [
        "The app stores in its private storage your favorite beaches, your main beach, the theme, the language, the height units and whether you've already seen the first-use tip.",
        "Tides, sun and moon are computed on the phone itself from data bundled with the app. None of this data is sent to the developer or to third parties.",
      ],
    },
    {
      title: "3. Location",
      paragraphs: [
        "Location permission is optional and only requested while you use the app. It is used solely to show your position on the map and centre the map on it.",
        "Your location is processed on the device: it isn't stored, sent to the developer or shared with third parties. If you deny the permission, the app works the same without the position dot. You can revoke it at any time in system settings.",
      ],
    },
    {
      title: "4. Internet connections",
      paragraphs: [
        "Predictions and the typeface are bundled with the app and don't need a connection. The app only connects to the internet to load the map.",
        "Map images (tiles) are downloaded from OpenStreetMap Foundation servers. As with any web request, those servers receive your IP address, the app identifier and which tiles are requested, which reflects the map area you're viewing. Your location is not sent.",
        "The OpenStreetMap Foundation handles that information under its own privacy policy.",
      ],
      links: [
        { label: "OpenStreetMap Foundation privacy", url: "https://osmfoundation.org/wiki/Privacy_Policy" },
      ],
    },
    {
      title: "5. What the app doesn't do",
      paragraphs: [
        "Mareas España contains no advertising, analytics, telemetry, automatic crash reports, tracking or advertising identifiers. It doesn't sell or share personal data.",
        "Distribution through Google Play or other stores is subject to each provider's independent processing. That processing is not part of the app.",
      ],
    },
    {
      title: "6. Retention and deletion",
      paragraphs: [
        "Data stays on your device until you change it in the app. To delete it, clear the app's data in system settings or uninstall it. There is no remote copy that you need to request deletion of.",
      ],
    },
    {
      title: "7. Children",
      paragraphs: [
        "The app is not specifically directed at children and does not collect personal data from users of any age.",
      ],
    },
    {
      title: "8. This website",
      paragraphs: [
        "This website uses browser local storage to remember your language and theme, shared with the other anderbggo.github.io pages. It has no analytics, ads or tracking cookies. Fonts and images are served from this website itself.",
        "The website is hosted on GitHub Pages. GitHub may process technical visitor information, such as IP addresses, under its own privacy policy.",
      ],
      links: [
        { label: "GitHub privacy statement", url: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" },
      ],
    },
    {
      title: "9. Contact and changes",
      paragraphs: [
        "You can contact the developer through their GitHub profile. This policy may be updated when the app's features or legal requirements change; the revision date always appears at the top of this page.",
      ],
      links: [{ label: "anderbggo on GitHub", url: authorUrl }],
    },
  ],
};
