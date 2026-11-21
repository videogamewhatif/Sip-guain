# Sip Güain 3.0 · *Historias que se descorchan*

Sitio web editorial, multipágina e interactivo para **Sip Güain**, marca mexicana de vinos del Bajío que une vino, literatura, arte y naturaleza.
No es una tienda: es una experiencia de marca. **No hay carrito, precios, checkout, inventario ni cuentas.**

> Concepto: un libro interactivo. Cada página es un capítulo; la Home abre con una botella real de Sip Güain que sirve vino en una copa al ritmo del scroll.

---

## 1. Requisitos e instalación

- Node.js **20.9 o superior** (probado con Node 22) y npm.

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>. (Si el puerto 3000 está ocupado, Next.js usará el siguiente libre; también puedes forzar otro con `npm run dev -- -p 3001`.)

| Script              | Qué hace                                                   |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo (Turbopack).                        |
| `npm run build`     | Compilación de producción (todas las rutas se prerenderizan). |
| `npm start`         | Sirve la compilación de producción.                        |
| `npm run typecheck` | Verificación de tipos TypeScript.                          |
| `npm run lint`      | ESLint (reglas de Next.js y React Hooks).                  |
| `npm run check`     | Typecheck + lint + build en un solo paso.                  |

Variables de entorno: copia `.env.example` a `.env.local` y completa lo necesario (ver §7).

---

## 2. Stack

- **Next.js 16** (App Router, Cache Components + Partial Prefetching, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (tokens de marca en `src/app/globals.css`)
- **GSAP + ScrollTrigger** (animación principal sincronizada al scroll, parallax)
- **Three.js + React Three Fiber + drei** (solo en la escena del vertido; carga diferida)
- **Motion for React** (menú móvil, visor de imágenes, filtros de galería)
- **Lucide React** (iconografía) · **Zod** (validación compartida cliente/servidor)
- **Next/Image** con AVIF/WebP automáticos

---

## 3. Mapa del sitio

| Ruta | Contenido |
| --- | --- |
| `/` | Hero cinematográfico (botella sirviendo vino) + 7 secciones editoriales |
| `/nosotros` | Origen, filosofía, vino y literatura, Bajío, visión artística, naturaleza, equipo |
| `/vinos` | Catálogo informativo |
| `/vinos/[slug]` | Ficha por vino (generada desde datos): hero, historia, ficha técnica, explorador del arte de la etiqueta, galería, "Descubre otro capítulo" |
| `/arte-y-literatura` | Índice tipo libro + historias en composición asimétrica |
| `/arte-y-literatura/[slug]` | Lectura en formato libro, símbolos, vinos relacionados |
| `/artistas`, `/artistas/[slug]` | Artistas colaboradores |
| `/merch` | Colección visual por categorías (sin compra) |
| `/experiencias` | Catas y experiencias; agenda alimentada por datos |
| `/galeria` | Galería masonry con filtros y visor accesible |
| `/contacto` | Formulario con validación, antispam y consentimiento |
| `/aviso-de-privacidad`, `/legal` | Privacidad, consumo responsable, propiedad intelectual |
| `/sitemap.xml`, `/robots.txt` | Generados automáticamente |

---

## 4. Estructura del proyecto

```
public/
  animations/wine-pouring/   Botellas recortadas (WebP con transparencia) para la animación
  images/                    branding · wines · art · experiences · vineyards · merch
src/
  app/                       Rutas (App Router), metadata, sitemap, robots, API de contacto
  components/
    animations/              Hero del vertido (wine-pour/), Parallax
    contact/                 Formulario
    gallery/                 Galería y visor
    illustrations/           Ilustraciones botánicas SVG originales (vid, mariposa monarca, pluma…)
    layout/                  Header, menú móvil, footer, verificación de edad
    sections/home/           Secciones de la Home
    ui/                      Primitivas (botones, encabezados, logo, migas de pan…)
    wines/                   Tarjeta de vino y explorador de etiquetas
  data/                      Contenido estructurado (vinos, historias, artistas, merch, experiencias, galería, marca)
  hooks/                     Media queries, detección de capacidad WebGL
  lib/                       Acceso a contenido, SEO, línea de tiempo del vertido, GSAP, utilidades
  types/                     Modelos de contenido
```

---

## 5. La animación principal: botella sirviendo vino

**Archivos:** `src/lib/pour-timeline.ts` (lógica), `src/components/animations/wine-pour/` (`WinePourHero`, `WinePourScene`, `WinePourSvg`).

**Decisión técnica.** No existía un modelo 3D fiel de la botella y un modelo genérico habría falseado la etiqueta. Por eso se combinan:

- **La botella real**: la fotografía oficial del Malbec *El regalo de la monarca*, recortada con transparencia. Solo se traslada y rota (transformación rígida): la etiqueta **no se deforma**.
- **Copa, vino y chorro en WebGL** (React Three Fiber): copa de vidrio transmisivo generada por torno; vino recortado por un plano de nivel; superficie que oscila; chorro como tubo de radio variable sobre una parábola; ondas y salpicaduras en el impacto.
- **Una sola línea de tiempo pura** `getPourState(p)`: el mismo progreso produce siempre el mismo fotograma → **100 % reversible**, se detiene exactamente donde el usuario deja de desplazarse.

**Etapas (según el brief):**

| Progreso | Etapa | Qué ocurre |
| --- | --- | --- |
| 0–15 % | Presentación | Botella vertical, copa vacía, botánicas que se dibujan, título |
| 15–35 % | Inclinación | La botella se eleva, avanza y gira **sobre su boca** (no sobre su centro); la cámara se desplaza |
| 35–65 % | Servir | Cae el chorro con gravedad, entra en la copa, ondas; el nivel sube **por volumen** (perfil real de la copa) |
| 65–85 % | Copa llena | ~40 % de capacidad; el chorro se corta y se desprende; la botella vuelve a vertical; el vino oscila |
| 85–100 % | Transición | La botella sale de cuadro; la copa queda protagonista; aparecen los textos de bienvenida |

**Mecánica de scroll.** Sección alta (`480–520svh`) con contenedor `sticky` (no se bloquea el scroll). Un timeline de GSAP con `ScrollTrigger` (`scrub`) produce el progreso suavizado que alimenta textos y escena a la vez.

**Rendimiento y respaldo progresivo.**
1. Póster **SVG** inmediato (misma lógica y encuadre) — no retrasa el LCP.
2. La escena WebGL se importa de forma diferida en tiempo ocioso y hace fundido cruzado al primer fotograma.
3. Perfil **ligero** automático en móviles/equipos modestos (vidrio sin transmisión, menos geometría, `dpr` limitado).
4. **Sin WebGL** o si la escena falla: el SVG sigue animado y sincronizado.
5. El render se pausa cuando el hero sale de pantalla; geometrías y texturas se liberan al desmontar.
6. **`prefers-reduced-motion`**: composición estática (botella y copa servida) + textos + enlace "Continuar".
7. Enlace **"Saltar introducción"** visible y accesible por teclado.

**Para elevar el realismo** (opcional): sustituir `public/animations/wine-pouring/bottle-malbec.webp` por un recorte de mayor resolución (≥ 2400 px de alto, mismo encuadre vertical, boca centrada arriba). Si la proporción cambia, actualiza `BOTTLE_ASPECT` en `src/lib/pour-timeline.ts`.

---

## 6. Administrar contenido

Todo el contenido vive en `src/data/*.ts`, tipado en `src/types/content.ts`. Las páginas leen a través de `src/lib/content.ts` (funciones asíncronas): para migrar a un CMS (Sanity, Contentful, Payload…) basta con reimplementar esas funciones sin tocar las páginas.

- **Nuevo vino:** agrega un objeto en `src/data/wines.ts` (con `slug`) y sus imágenes en `public/images/wines/`. La ruta `/vinos/<slug>`, el sitemap y "Descubre otro capítulo" se actualizan solos. Los campos opcionales vacíos **no se muestran**.
- **Nueva historia:** `src/data/stories.ts`. Para publicar el **texto literario original completo**, pega sus párrafos en `originalText`: la página lo mostrará en formato libro en lugar del resumen.
- **Nuevo evento:** `src/data/experiences.ts` con `date` (ISO 8601) y `location`; aparece en la agenda.
- **Galería / merch / artistas:** `gallery.ts`, `merch.ts`, `artists.ts`.

---

## 7. Formulario de contacto

`POST /api/contact` valida con Zod (mismo esquema que el cliente), filtra spam (campo trampa + tiempo mínimo de llenado + límite de 5 envíos/10 min por IP) y envía con **Resend** vía su API REST.

- **Sin `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL`, el formulario NO envía correos** y se lo dice al usuario, ofreciendo `contacto@sipguain.com`. Nunca muestra una confirmación falsa.
- Para activarlo: crea una cuenta en Resend, verifica el dominio, define las tres variables en Vercel y vuelve a desplegar.
- El limitador de envíos es en memoria (por instancia). Con tráfico alto, cámbialo por un almacén compartido (Upstash/Vercel KV).

---

## 8. SEO, accesibilidad y aspectos legales

**SEO:** metadatos por página (título, descripción, canonical, Open Graph, Twitter), imagen OG de marca, `sitemap.xml`, `robots.txt`, datos estructurados (Organization, BreadcrumbList, Product sin oferta comercial, CreativeWork, Person), URLs semánticas en español, HTML semántico y textos alternativos. En entornos de *preview* el `robots.txt` bloquea la indexación.

**Accesibilidad (objetivo WCAG 2.2 AA):** enlace "Saltar al contenido", navegación completa por teclado, foco visible, menú móvil y visor como diálogos modales (foco atrapado, Esc, retorno del foco), formularios etiquetados con errores asociados (`aria-describedby`) y anuncio de estado, `aria-current` en la navegación, contrastes verificados (variantes oscuras de terracota/olivo para texto pequeño), animaciones decorativas con `aria-hidden` y respeto total a `prefers-reduced-motion`.

**Legal:** verificación de mayoría de edad (18+) elegante, sin parpadeo (se resuelve antes del primer pintado y se recuerda en el navegador). Es una **autodeclaración, no una garantía de cumplimiento legal**. Leyenda "Evite el abuso en el consumo de este producto", página de consumo responsable y aviso de privacidad adaptado a este sitio. **Ambos textos legales deben validarse con la asesoría legal de la marca antes de publicar.**

---

## 9. Despliegue (GitHub + Vercel)

> No se despliega nada automáticamente. La 3.0 puede probarse en paralelo sin sustituir el sitio actual.

1. Crea un repositorio y sube el proyecto: `git init && git add . && git commit -m "Sip Güain 3.0" && git remote add origin <url> && git push -u origin main`.
2. En [vercel.com](https://vercel.com) → *Add New Project* → importa el repositorio (framework detectado: Next.js; no requiere configuración extra).
3. Variables de entorno en Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ALLOW_INDEXING=false` (mientras se prueba) y, si se activa el formulario, las de Resend.
4. Cada rama genera una URL de *preview* para revisión (no indexable).
5. **Dominio personalizado** (cuando la marca lo apruebe): *Project → Settings → Domains* → agrega `sipguain.com`, actualiza los DNS según indique Vercel, cambia `NEXT_PUBLIC_SITE_URL=https://sipguain.com` y quita `NEXT_PUBLIC_ALLOW_INDEXING=false`. Conviene configurar redirecciones 301 de las URLs antiguas de WooCommerce (`/producto/malbec/` → `/vinos/el-regalo-de-la-monarca`, `/producto/tempranillo/` → `/vinos/tempranillo`, `/el-regalo-de-la-monarca/` → `/arte-y-literatura/el-regalo-de-la-monarca`, `/xunankab/` → `/arte-y-literatura/xunan-kab`, `/nosotros/` → `/nosotros`).

---

## 10. Pruebas realizadas

- `npm run typecheck`, `npm run lint` y `npm run build` sin errores; 26 rutas prerenderizadas de forma estática.
- Navegación entre todas las páginas y rutas dinámicas (`/vinos/*`, `/arte-y-literatura/*`, `/artistas/*`), incluida la navegación del lado del cliente y el botón "atrás" (la escena se reinicializa correctamente).
- Animación del vertido: recorrido completo hacia abajo y **hacia arriba** (etapas 5 → 3 → 2 → 1, la copa se vacía al retroceder), en escritorio (1280–1440 px) y móvil (375 px).
- Sin desbordamiento horizontal a 375 px en todas las páginas revisadas.
- Formulario: validación con mensajes y foco en el primer error; envío válido sin proveedor → aviso honesto; API: campo trampa, envío demasiado rápido y JSON inválido rechazados.
- Galería: filtros, visor con flechas del teclado, Esc y retorno del foco. Menú móvil: foco inicial, Esc y estado `aria-expanded`.
- Consola del navegador sin errores en las páginas revisadas.

**Nota sobre rutas dinámicas:** el contenido que depende del `slug` se transmite dentro de `<Suspense>` (navegación instantánea con Partial Prefetching). Por eso un slug inexistente muestra la página 404 con `<meta name="robots" content="noindex">`, pero el código HTTP es 200 (el streaming ya comenzó). Si se prefiere un 404 estricto, exporta `export const instant = false` en esas páginas y lee `params` fuera de Suspense.

**No verificado en este entorno:** Lighthouse/Core Web Vitals medidos, lectores de pantalla reales (NVDA/VoiceOver), Safari/iOS y Firefox reales (en Firefox las animaciones de aparición por scroll se degradan a contenido visible sin animación, por diseño), y el envío real de correos (requiere credenciales de Resend).

---

## 11. Recursos y datos pendientes (proporcionados por la marca)

Todo lo que se muestra proviene de sipguain.com o de las etiquetas en fotografías oficiales. Donde falta material, el sitio muestra marcadores **"Recurso pendiente"** o simplemente omite el campo.

**Imágenes**
- [ ] Recorte de la botella del Malbec en **alta resolución** para la animación (la actual mide 221 × 960 px; se ve suave en pantallas retina).
- [ ] Imagen oficial de la línea gráfica / manual de marca (no se recibió). Los colores y tipografías siguen el brief.
- [ ] Logotipo en vectores limpios. Se usa el SVG publicado en sipguain.com; las variantes vino/crema solo cambian el color de relleno y retiran el bloque verde de fondo, sin alterar la forma.
- [ ] Fotografías de los **viñedos reales**. La de "El origen" y la de la galería provienen del sitio actual y parecen de banco de imágenes.
- [ ] Retrato autorizado y enlaces oficiales de **Danny Sixx**; confirmar la grafía ("Danny Sixx" / "Dany Sixx").
- [ ] Arte del **Tempranillo** en gran formato y confirmación de autoría (hoy se muestra la ilustración completa de *El regalo de la monarca*, cuyo paisaje coincide con la etiqueta).
- [ ] Fotografías de las fundadoras (se usan iniciales en lugar de retratos).

**Datos**
- [ ] Añada y graduación del **Tempranillo** (no legibles en la fotografía). Las del Malbec (2022, 13.5 %) provienen de su etiqueta.
- [ ] Texto literario **original** de *El regalo de la monarca* y *Xunan Kab* para `originalText` (hoy se muestra un resumen editorial con enlace al texto completo en sipguain.com).
- [ ] Etiqueta asociada a *Xunan Kab* (la historia menciona "esta botella", sin vino publicado).
- [ ] Fechas, sedes y fotos de próximas experiencias.
- [ ] Revisión legal del aviso de privacidad y de las leyendas de consumo responsable.

**Integraciones**
- [ ] Credenciales de Resend (o el proveedor elegido) para activar el envío del formulario.
