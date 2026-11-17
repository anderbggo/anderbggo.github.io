# anderbggo.github.io

Sitio personal publicado en [anderbggo.github.io](https://anderbggo.github.io). React, TypeScript y Vite.

## Arrancar en desarrollo

```bash
npm run dev
```

→ http://localhost:3000

## Build y despliegue

```bash
npm run build
```

Cada push a `master` despliega `dist/` automáticamente mediante GitHub Actions.

## Rutas

| Ruta                | Página                            |
| ------------------- | --------------------------------- |
| `/`                 | Página temporal en construcción   |
| `/contribute/`      | Apoyo a proyectos independientes  |
| `/vestige/`         | Información pública de Vestige    |
| `/vestige/privacy/` | Política de privacidad de Vestige |
| `/gpmatcher/`       | Google Photos Matcher, descarga e información |
| `/gpmatcher/privacy/` | Política de privacidad de Google Photos Matcher |
| `/roko/`            | Memorial de Roko con velas, farolillos y mensajes |

Las páginas de los proyectos incluyen español e inglés y modos claro y oscuro.
El idioma y el tema se comparten entre páginas y se recuerdan en el navegador.

## Memorial `/roko/` (Firebase Firestore)

Las velas, farolillos y mensajes se guardan en Firestore (plan gratuito Spark) mediante su API REST, sin login para
los visitantes. Sin configurar Firebase, la página funciona igualmente, pero cada visitante solo ve sus propias luces.

1. Crea un proyecto en [Firebase](https://console.firebase.google.com/) y una base de datos Firestore `(default)`.
2. Publica las reglas de [`firestore.rules`](./firestore.rules): pégalas en _Firestore → Reglas_ o ejecuta
   `npx firebase-tools deploy --only firestore --project <id-del-proyecto>` (también publica
   [`firestore.indexes.json`](./firestore.indexes.json), que excluye el resumen de los índices).
3. En GitHub, _Settings → Secrets and variables → Actions → Variables_, crea `FIREBASE_PROJECT_ID` y, opcionalmente,
   `FIREBASE_API_KEY` (la clave web de _Configuración del proyecto_; es pública por diseño).
4. Para desarrollo local, copia `.env.example` a `.env.local` y rellena los mismos valores.
5. Ejecuta `npm run roko:sync-sky` para copiar las luces existentes al documento resumen.

Cada luz es un documento en `roko_tributes`, y además se copia en un único documento resumen, `roko_summary/sky`, en la
misma escritura. Así cada visita cuesta 2 lecturas (el resumen y un recuento) en vez de una por luz, y la cuota gratuita
(50.000 lecturas al día) da para unas 25.000 visitas diarias. Si el resumen no tiene todas las luces, la página lee la
colección completa como antes; `npm run roko:sync-sky` lo pone al día y se puede ejecutar tantas veces como haga falta.
Cada navegador reutiliza además las luces durante 2 minutos y, si Firestore falla, muestra la última copia guardada.

Las reglas solo permiten crear documentos válidos en `roko_tributes` (nombre ≤ 40 y mensaje ≤ 280 caracteres) y añadir
al resumen copias exactas de esas luces; bloquean ediciones y borrados desde la web. Para moderar, borra el mensaje desde
la consola de Firebase en los dos sitios: su documento en `roko_tributes` y su entrada en `roko_summary/sky` → `lights`.

Los farolillos y velas con mensaje llevan una carta. Si hay más luces de las que caben en el cielo, se muestran primero
las que tienen mensaje, luego las que solo llevan nombre y después el resto, de la más reciente a la más antigua.

Al compartir el enlace se usa [`public/roko/og.jpg`](./public/roko/og.jpg) como vista previa.
