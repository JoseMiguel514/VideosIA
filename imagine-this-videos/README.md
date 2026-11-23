# Imagine This — videos "What If" animados (Remotion)

Canal en inglés de historias "¿qué pasaría si…?" animadas. Formato horizontal 1920×1080, 30 fps.

## Estilo

Inspirado en el género de canales "What If" animados (personajes con cabeza grande y rasgos mínimos, fondos atmosféricos con desenfoque por profundidad, etiquetas cortas en pantalla), pero con **diseño propio** para no copiar:

- **Protagonista original**: cabeza-galaxia (nebulosas + estrellas), anillo planetario dorado con una lunita que orbita, sudadera turquesa con parche "?".
- **NPCs**: cabezas sólidas de colores, peinados/accesorios variados (moño, gorra, pelo), gafas oscuras para agentes.
- **Entornos originales**: dormitorio al amanecer, campana de IQ, cocina, autobús, ciudad al atardecer, aula, calle bajo la lluvia, estudio, calle nocturna, ciudad futurista, azotea bajo la Vía Láctea.

`src/lib/Character.tsx` — personaje animable: expresiones (`neutral`, `deadpan`, `wide`, `happy`, `sad`, `smirk`, `focus`), bocas, poses de brazos, parpadeo automático, respiración, caminata, boca hablando, brillo de "cerebro activo".
`src/lib/scene.tsx` — cámara (zoom/paneo), capas con desenfoque y parallax, fundidos, etiquetas, títulos, polvo, lluvia, estrellas, cielos, ciudades procedurales, rayos de luz.

## Video 1: What If You Had a 500 IQ?

| Escena | Contenido |
|---|---|
| hook | Despiertas con IQ 500 |
| scale | Campana de IQ: 100 promedio, 130 superdotado, Einstein ~160 (estimado, nunca se le hizo la prueba) |
| impossible | 500 está ~27 desviaciones estándar por encima: estadísticamente nadie debería alcanzarlo |
| morning | Ves patrones en todo (vapor, tráfico) |
| learning | Libro de 300 páginas antes de que se enfríe el pan; 5 idiomas para el almuerzo |
| hunger | El cerebro es ~2% del peso corporal y usa ~20% de la energía |
| slow | El mundo va en cámara lenta |
| school | Respondes la pregunta y las 10 siguientes |
| lonely | La soledad |
| math | 7 Problemas del Milenio (Clay Institute, 2000), $1M cada uno; solo Poincaré está resuelto |
| agents | Gobiernos, gigantes tecnológicos y laboratorios secretos te buscan |
| future | Medicinas, energía limpia, ciudades que se construyen solas |
| twist | Aprender a ir despacio, escuchar y explicar |
| ending | Lo más inteligente: llevar a todos contigo |
| outro | Pregunta + suscripción |

**Título:** What If You Had a 500 IQ?
**Descripción sugerida:**

```
What if you woke up tomorrow with an IQ of 500? 🧠✨

The average IQ is 100. Einstein was estimated around 160. A 500 IQ is so far off the scale that statistically no human should ever reach it… so what would actually happen to your life, your body and the world around you?

⏱️ Chapters
0:00 Waking up with a 500 IQ
0:11 How crazy is a 500 IQ?
0:37 Seeing patterns everywhere
0:58 Your brain's energy problem
1:13 Life in slow motion
1:39 The Millennium Prize Problems
1:55 Everyone wants you
2:05 Changing the world
2:17 The hardest problem of all

💬 What would YOU do with a 500 IQ? Tell me in the comments!

This is a hypothetical, animated story for entertainment. Facts: IQ scores have a mean of 100 and SD of 15; the brain is ~2% of body weight and uses ~20% of the body's energy; the Clay Mathematics Institute announced 7 Millennium Prize Problems in 2000 ($1M each) — only the Poincaré conjecture has been solved.

#whatif #iq #animation #imaginethis
```

## Comandos

```bash
npm i
npm run dev                                                  # Studio
npx remotion render WhatIf500IQ out/what-if-500-iq.mp4       # exportar
python3 scripts/voz.py iq500 am_michael                      # narración (Kokoro TTS, inglés)
python3 scripts/musica_ambient.py public/iq500/musica.wav 200
```
