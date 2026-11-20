# Sip Güain 2.0

Sitio editorial de la marca mexicana Sip Güain. La portada abre con una botella de Malbec que sirve vino conforme avanza el scroll. La navegación recorre un catálogo informativo, relatos, colaboradores, una colección de merch, experiencias, una galería y el contacto.

## Ejecutar en local

Usa Node.js 22 o superior y npm. Descomprime el ZIP y abre la carpeta `sip-guain` en Visual Studio Code.

```sh
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000/). Para usar metadatos canónicos locales, copia `.env.example` a `.env.local`. Las fuentes y fotografías están incluidas en el proyecto.

```sh
npm run build
npm start
```

## Código y contenido

| Ubicación | Contenido |
| --- | --- |
| `src/app` | Next.js App Router. Inicio, Nosotros, Nuestros vinos, Arte y literatura, Artistas, Merch, Experiencias, Galería, Contacto y aviso de privacidad. |
| `src/app/vinos/[slug]` | Fichas generadas a partir de los vinos registrados. Solo se muestran las características documentadas. |
| `src/app/arte-y-literatura/[slug]` | Fichas generadas a partir de los relatos registrados. |
| `src/data/content.ts` | Datos tipados para vinos, relatos, artistas, merch, eventos y galería. Añade nuevas entradas y reconstruye el sitio. Para eventos, usa fechas ISO como `AAAA-MM-DD`. |
| `src/components` | Navegación, confirmación de edad, editoriales, vertido, formularios y visor. |
| `src/lib/pour.mjs` | Cálculo reproducible de la posición de la botella, la boca, el chorro, el nivel y las ondas a partir del progreso. |
| `public/images` | Fotografías oficiales optimizadas, logotipos y arte decorativo del proyecto. |

La escena usa SVG, una fotografía recortada del Malbec y GSAP ScrollTrigger dentro de una sección sticky. Se dibuja con el progreso exacto del scroll en ambas direcciones. Las rotaciones y traslaciones conservan las proporciones de la botella y de su etiqueta. La copa, el chorro y las ondas son gráficos 2D. Para movimiento reducido y ventanas horizontales de poca altura se usa la composición estática. Las transiciones editoriales usan Motion for React y los estilos usan Tailwind CSS y CSS del proyecto. Las fotos editoriales se sirven con Next Image.

## Contacto

Por defecto, la página muestra el correo oficial y el botón del formulario queda deshabilitado. Para habilitarlo, configura las siguientes variables en `.env.local` o en Vercel.

| Variable | Valor |
| --- | --- |
| `SITE_URL` | Origen exacto donde se usa el formulario, por ejemplo `http://localhost:3000` o `https://sipguain.com`. También sirve de base para canonical, Open Graph y sitemap. |
| `RESEND_API_KEY` | Clave de envío de Resend, solo en el servidor. |
| `CONTACT_FROM` | Dirección de un dominio verificado en Resend. Puede incluir nombre visible. |
| `CONTACT_TO` | Buzón que recibe las consultas. El correo publicado por la marca es `contacto@sipguain.com`. |

El endpoint valida origen, contenido, consentimiento y tamaño. Usa un campo trampa y una cuota temporal por instancia. En Vercel toma la dirección del encabezado de plataforma y, en local, usa una cuota compartida. La confirmación aparece tras una respuesta exitosa del proveedor. Si necesitas un límite uniforme entre instancias, conecta una cuota compartida en el servidor o en el perímetro antes de abrir el formulario a tráfico público.

## Despliegue de prueba en Vercel

1. Sube a un repositorio de GitHub el contenido descomprimido. Conserva `package-lock.json` y `.env.example`. Mantén las credenciales en las variables de entorno.
2. Importa el repositorio en Vercel. Selecciona Next.js y Node.js 22 o superior. La raíz es el directorio que contiene `package.json`.
3. Configura las variables de entorno para la vista previa. Si habilitas el correo, usa en `SITE_URL` el origen exacto del entorno que lo recibirá y verifica una entrega de prueba.
4. Revisa el aviso de privacidad y el tratamiento de datos del proveedor antes de habilitar envíos públicos. La confirmación de 18 años es una declaración de sesión del visitante.
5. Cuando se apruebe la vista previa, configura las variables de Production con el dominio definitivo. Añade el dominio en Vercel y aplica sus registros DNS cuando decidas hacer el cambio.

## Pruebas reproducibles

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm start
```

Ejecuta los siguientes comandos en otra terminal.

```sh
npm run test:e2e
npm run test:contact
```

`test:e2e` verifica las rutas, metadatos, sitemap, galería, imágenes, navegación, confirmación de edad, scroll reversible en escritorio, vertido en móvil y preferencia de movimiento reducido. Incluye análisis automatizado con axe en la portada y en Contacto. `test:contact` levanta un servidor local aparte y simula Resend para verificar validación, confirmación, fallo de entrega y límite. `TEST_URL` permite indicar el servidor en ejecución para la suite de navegador. `CONTACT_TEST_URL` permite cambiar el puerto local de la prueba de correo.

## Fuentes y recursos pendientes

- Fotografías, logotipos y material de marca obtenidos del [sitio oficial](https://sipguain.com/), su [página de historia](https://sipguain.com/nosotros/), el [catálogo](https://sipguain.com/shop/), las fichas de [Malbec](https://sipguain.com/producto/malbec/) y [Tempranillo](https://sipguain.com/producto/tempranillo/), y los relatos [El regalo de la monarca](https://sipguain.com/el-regalo-de-la-monarca/) y [Xunankab](https://sipguain.com/xunankab/). El sitio enlaza también al [aviso integral](https://sipguain.com/aviso-de-privacidad/). Playfair Display y Montserrat se distribuyen mediante Fontsource bajo sus respectivas licencias OFL.
- El adjunto contenía el brief. Queda por cotejar la imagen de lineamientos gráficos cuando se proporcione. La interfaz aplica la paleta y las tipografías especificadas y usa los logotipos públicos de la marca.
- Se requieren fotografías de los viñedos vinculados a la marca, un retrato autorizado de Danny Sixx y la ilustración oficial de Xunankab. Los espacios correspondientes están identificados. En las fichas se omiten añadas, graduaciones y los detalles de la etiqueta de Tempranillo aún sin verificar.
- La cata de la monarca corresponde a la [experiencia publicada por la marca](https://sipguain.com/producto/el-regalo-de-la-monarca/). El archivo muestra fotografías del sitio actual. Las próximas fechas están vacías hasta recibir una confirmación.
- Para un acabado fotográfico del vertido hacen falta tomas de la botella abierta, la copa y el chorro desde un mismo ángulo y con iluminación constante, o una secuencia con canal alfa. El montaje 2D entregado usa la foto oficial frontal y aproxima la perspectiva y el líquido.
- La suite de correo usa un proveedor simulado. Las credenciales y una entrega real quedan pendientes. La evaluación con axe cubre casos automatizables; queda pendiente una auditoría WCAG completa y la medición de Core Web Vitals con tráfico real.
