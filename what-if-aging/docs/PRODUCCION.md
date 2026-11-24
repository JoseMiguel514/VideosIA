# What If Your Body Stopped Aging at 25? (versión stickman)

Documento de producción según el *AI Video Production Prompt (Stick Characters Reference)*.
Video final: `out/what-if-stopped-aging-at-25-stickman.mp4` · 1920×1080 · 30 fps · 3:48 · narración en inglés.

---

## 1. Título y alternativas
- **Principal:** What If Your Body Stopped Aging at 25?
- Frozen at 25 Forever: What Would Really Happen?
- You Stop Aging Today. Here's How You'd Die.
- What If Aging Was Switched Off?

## 2. Idea central y público
- **Idea:** si dejaras de envejecer a los 25 no serías inmortal; tu riesgo de morir se quedaría fijo en el de un joven de 25, y la edad resulta ser el mayor factor de riesgo de las grandes enfermedades.
- **Público:** espectadores de 16 a 40 años de canales de ciencia y de "what if", curiosos por la longevidad y la biología.

## 3. Gancho (0–3 s)
Las velas de un pastel de cumpleaños de 25 se apagan… y toda la fiesta se congela en el aire, con el panel HUD que marca **"BIOLOGICAL AGE 25 · PAUSED"**.

## 4. Sinopsis
"Tú" (sudadera amarilla) deja de envejecer en su fiesta de 25 años. Sus amigos (Mia, Zoe y Sam) encanecen mientras él no cambia. La Dra. Reyes le explica, en el laboratorio, la consulta, el acuario y el hospital, qué es el envejecimiento, por qué los telómeros importan, por qué la medusa "inmortal" no lo es y qué lo mataría en realidad: los accidentes. Tras siglos de vida, el miedo al riesgo lo cambia todo. Giro: la edad es el factor de riesgo número 1 de las grandes enfermedades. Cierre: de vuelta en la fiesta, la pregunta al espectador.

## 5. Guion
El guion completo de la narración está en `scripts/guion.json` (17 bloques, unas 560 palabras). Es una sola voz narradora sin diálogos, en segunda persona.

**Hechos verificados:**
- Los 12 *hallmarks of aging* (López-Otín et al., *Cell*, 2023).
- El acortamiento de los telómeros con cada división celular.
- La reversión al estado de pólipo de *Turritopsis dohrnii*.
- Las principales causas de muerte a los 25 años: accidentes, sobredosis y violencia.
- La edad como principal factor de riesgo de las enfermedades cardíacas, de muchos cánceres y del alzhéimer.
- Los fármacos senolíticos en ratones.

**Especulación marcada en pantalla:**
- La esperanza de vida de unos 1,000 años aparece como *"Rough estimate, not a measured figure"*.
- La curva de riesgo aparece como *"Illustrative shape, not real data"*.

## 6. Hoja de personajes
Hoja de referencia: `docs/character-sheet.png`, renderizada desde la composición `CharacterSheet`.

Construcción común para todos los personajes, definida en `src/stick/Stick.tsx`:
- **Cabeza:** negra sólida, perfectamente redonda y sobredimensionada (radio 74 px a escala 1).
- **Cuerpo y extremidades:** negros y muy delgados (trazo de 11 px); el torso es estrecho.
- **Contorno:** borde crema `#F0D29A` alrededor de toda la silueta, del mismo grosor en todo el video.
- **Cara:** ojos, cejas y boca mínimos en blanco crema `#F6EFDF`.
- **Expresiones:** neutral, feliz, triste, sorprendido, enojado, preocupado (con gota de sudor), confundido y aburrido (párpado a media altura, como en la referencia).
- **Poses:** idle, señalar, señalar arriba, saludar, aplaudir, brazos cruzados (nervioso, como en la referencia del cinturón), manos en la cadera, encogerse de hombros, sostener y dudar.
- **Animación:** respiración, parpadeo cada 3.5 s, temblor, caminata, sentado y envejecimiento (canas y espalda encorvada).

| Personaje | Ropa | Pelo / accesorio | Papel |
|---|---|---|---|
| **You** | Sudadera amarilla `#F2C21B`, jeans `#2C3D6B` | Mechón | Protagonista |
| **Mia** | Camiseta morada `#8F5BD8` | Dos moños | Amiga |
| **Zoe** | Sudadera roja `#E0452F` | Pelo largo | Amiga |
| **Sam** | Camiseta naranja `#F08A24` | Gorra `#B9864A` | Amigo |
| **Dra. Reyes** | Bata blanca, camisa verde azulado `#2F8F9A` | Moño y lentes | Autoridad: gestos calmados y pausados |

## 7. Paleta y estilo visual
- **Personajes:** planos y siempre iguales.
- **Escenarios:** cinematográficos, con desenfoque de profundidad (3–6 px), conos de luz volumétricos (como el pasillo del avión de la referencia), bokeh y viñeta.
- **Acentos de interfaz:**
  - Dorado `#FFC23D` para valores importantes.
  - Hielo `#7FE6FF` para el tiempo congelado.
  - Rojo `#E8343F` para riesgo y muerte.
- **Elementos de interfaz inspirados en las capturas:**
  - Panel HUD arriba a la derecha (estilo *"ENGINES STOP IN"*).
  - Píldoras oscuras con borde crema (estilo *"23B"*).
  - Etiquetas rojas (estilo *"DO NOT TOUCH"*).
  - Trofeo dorado con placa (estilo *"RIGHT AGAIN"*).
- **Tipografías:** Nunito 900 en la interfaz e Inter 800 en los subtítulos.

## 8–11. Storyboard, prompts de imagen y animación, y cámara

| # | Tiempo | Narración (resumen) | Personajes | Lugar / luz | Acción principal | Cámara | Prompt de imagen | Prompt de animación |
|---|---|---|---|---|---|---|---|---|
| 1 | 0:00 (11 s) | Velas → "your body just stops… Forever" | You, Mia, Zoe, Sam | Fiesta nocturna, luz cálida y guirnaldas | You sopla las velas, el humo sube y todo se congela | Zoom lento hacia el pastel | *Night apartment party, warm string lights, stick characters with round black heads around a birthday cake with "25"* | Aplausos que se congelan en mitad del gesto; destello helado |
| 2 | 0:11 (12.6 s) | "No gray hair… you'd still die" | You | Baño frío; se vuelve rojo | Se mira en un espejo de mano, contento; luego asustado, con los brazos cruzados y sudando | Push-in medio | *Cool tiled bathroom, stick character holding a hand mirror* | Cambio feliz → preocupado, temblor, gota de sudor |
| 3 | 0:23 (10.8 s) | Hallmarks of aging | Dra. Reyes | Laboratorio verde azulado | Señala la pantalla, donde aparecen los 12 hallmarks | Ligero zoom out | *Teal science lab, big wall screen, scientist stick figure in lab coat* | Niega con la cabeza y luego señala arriba |
| 4 | 0:34 (12.4 s) | ADN, proteínas, células zombi → pausa | Dra. Reyes | Mismo laboratorio | Pulsa el control remoto y la pantalla se congela | Push-in | — | Brazo que señala; destello de congelación |
| 5 | 0:46 (10.3 s) | Pasan los años; los amigos lo notan | Todos | Calle al atardecer | Los amigos encanecen y se encorvan; You sigue igual y saluda | Zoom lento | *Dusk city street, four stick friends standing* | Envejecimiento gradual; signos "?" sobre los amigos |
| 6 | 0:57 (12.5 s) | Piel, articulaciones y corazón de 25 | You, Dra. Reyes | Consulta médica | Revisión médica con la carpeta; fotos de 25 y 35 idénticas | Push-in | *Doctor's office, exam table, ECG wall monitor* | La doctora se sorprende; sello "IDENTICAL" |
| 7 | 1:09 (19.5 s) | Telómeros | Dra. Reyes, You | Laboratorio, monitor | Un cromosoma normal pierde las tapas; el de You no | Zoom lento al monitor | — | You pasa de pensativo a sorprendido |
| 8 | 1:29 (21.2 s) | Medusa *Turritopsis* | You, Dra. Reyes | Acuario azul con cáusticas | Ciclo adulto ↔ juvenil; un pez se la come; se enferma | Estático con zoom leve | *Blue aquarium tunnel, glowing pink jellyfish tank* | Cambio de forma de la medusa; el pez cruza la pecera |
| 9 | 1:50 (18.6 s) | ¿Qué mata a los 25? | Dra. Reyes, You | Oficina con TV | Se dibuja la gráfica de riesgo y aparecen las causas | Zoom lento | — | You se pone nervioso y suda |
| 10 | 2:09 (11.2 s) | ¿Cientos de años? ¿Mil? | You | Pasillo tipo avión, conos de luz | Camina entre letreros 80→1000 y se detiene preocupado | Dolly hacia delante | *Long corridor with ceiling light cones and numbered wall signs* | Ciclo de caminata; se detiene |
| 11 | 2:20 (10.6 s) | Cumpleaños 200 | You | Cementerio al atardecer con skyline futurista | De pie con flores y triste; la ciudad cambia de época | Zoom out lento | *Dusk cemetery, blurred futuristic skyline* | La cabeza se inclina; las carreras se tachan |
| 12 | 2:30 (12.5 s) | Cada riesgo… ¿moto? | You | Interior de auto → garaje | Con cinturón, nervioso (como la referencia); duda ante la moto | Push-in | *Car interior blue-gray, seatbelt, dot-pattern panels* | Temblor y brazos cruzados; mano que duda |
| 13 | 2:43 (14.9 s) | El giro: la edad | Dra. Reyes | Pasillo de hospital frío | Camina entre Cardiología, Oncología y Neurología; tacha tabaco y dieta | Dolly | *Cool blue hospital corridor with department signs* | Camina; manos en la cadera; aparece el trofeo "AGE ITSELF" |
| 14 | 2:58 (8.8 s) | La raíz de muchas enfermedades | You, Dra. Reyes | Parque, hora dorada | Árbol cuyas raíces se iluminan con la etiqueta "AGING" | Zoom lento | *Golden-hour park, big tree* | Las ramas crecen; las raíces brillan |
| 15 | 3:06 (14.5 s) | Senolíticos en ratones; "Not yet" | Dra. Reyes | Laboratorio con ratón | Las células zombi desaparecen; la cara se vuelve seria | Zoom fuerte final a la doctora | — | Feliz → neutral → aburrido |
| 16 | 3:21 (10.9 s) | ¿Qué harías con el tiempo? | You | Ventana nocturna, lámpara cálida | Sentado con un reloj de arena; la arena se vuelve roja | Push-in | *Night window, warm lamp cone, hourglass on table* | Inclinación de cabeza triste, sudor |
| 17 | 3:32 (15.5 s) | CTA | Todos | Fiesta otra vez | Comentario que se escribe, botón SUBSCRIBE y próximo video | Zoom out | — | Saludos; clic en el botón; fundido a negro |

**Transiciones:** fundido corto (≈0.3 s) entre escenas con un *whoosh*. La escena 13 entra con un *boom* y un destello rojo.

## 12. Dirección de voz
Voz masculina grave (Kokoro `am_michael`, velocidad 0.94), con tono documental cinematográfico. Las frases se sintetizan una por una con 0.38 s de silencio entre ellas para las pausas. Script: `scripts/voz.py`.

## 13. Efectos de sonido
- *Whoosh* en cada corte.
- Soplido al apagar las velas.
- *Freeze* (tono descendente) al congelarse el tiempo y en "Not yet".
- *Boom* en "DIE", al empezar el giro y en "AGE".
- *Pop* al suscribirse.

## 14. Música
Score original sintetizado (`scripts/musica.py`):
- Pad ambiental en La menor y arpegios suaves.
- Latido grave desde los 40 s y tictac de reloj sutil.
- Volumen 0.16 bajo la voz, con fade in y fade out.

## 15. Edición
Subtítulos de 3 a 6 palabras con la palabra activa en azul hielo, sincronizados frase por frase. Cada animación clave se dispara con la palabra exacta (función `at()` en `src/timing.ts`). Zooms lentos y controlados, sin cámara inestable.

## 16. Checklist de calidad
- [x] Mismas proporciones, contorno, ojos, ropa y colores en las 17 escenas (un único componente `Stick`).
- [x] Sin extremidades extra, duplicados ni deformaciones (geometría fija, poses por ángulos).
- [x] Fondos detallados y desenfocados; personajes planos y legibles.
- [x] Narración, subtítulos y animación sincronizados por frase.
- [x] Especulación marcada como tal; sin estadísticas inventadas.
- [x] Espacio inferior libre para los subtítulos.
