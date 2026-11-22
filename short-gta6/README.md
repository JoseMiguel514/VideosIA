# Short: "GTA VI ganó más en 1 día que cualquier película"

Video vertical (1080×1920, 30 fps, ~45 s) para **YouTube Shorts y TikTok**, hecho 100 % en código con Remotion.

## Por qué este tema (investigación, 22 nov 2026)

- **GTA VI salió el 19 de noviembre de 2026** y domina YouTube: el video #1 de gaming en tendencias es un walkthrough de GTA 6 (~6 M de vistas) y aparece también arriba en el chart mundial.
- Take-Two anunció **$3,790 millones en ventas el primer día** (incluye preventas), récord del entretenimiento, y **32.5 millones de copias** vendidas antes del lanzamiento.
- Los guiones que más retienen en Shorts son **datos curiosos con números impactantes, comparaciones y un giro final** (reveal + "pero ojo"), con gancho en los primeros 2 segundos y una pregunta al final para generar comentarios.

## Guion

| # | Escena | Narración | En pantalla |
|---|---|---|---|
| 1 | Gancho | Este videojuego ganó más dinero en un día... que cualquier película en toda su historia. | Claqueta VS control, sello "EN 24 HORAS", corona |
| 2 | Dato | El 19 de noviembre salió GTA VI. Y en 24 horas, vendió 3,790 millones de dólares. | Calendario + contador de dinero + lluvia de billetes |
| 3 | Comparación 1 | Eso es casi cinco veces lo que hizo GTA V en su primer día, allá por 2013. | Barras $800M vs $3,790M, sello "×4.7" |
| 4 | Comparación 2 | Y supera lo que Avatar recaudó en toda su vida en cines: unos 2,900 millones. | Carrera de barras película vs videojuego |
| 5 | Dato "wow" | Haz la cuenta: son casi 44,000 dólares... cada segundo. | Cronómetro + contador corriendo |
| 6 | Preventas | Y antes de salir, ya tenía 32.5 millones de copias reservadas. | Cuadrícula de cajas (1 caja = 1 millón) |
| 7 | Giro | Pero ojo: esa cifra la dio la propia Take-Two. Sensor Tower calcula bastante menos: unos 2,360 millones. | Glitch + tarjetas oficial vs estimación |
| 8 | Llamada a la acción | ¿Tú ya lo jugaste, o esperas a que baje de precio? Te leo en comentarios. | Encuesta visual + "Comenta y sígueme" |

## Edición para retención

Subtítulos palabra por palabra sincronizados con la voz (cifras en verde neón), zoom de entrada y flash blanco en cada corte, sacudida de cámara en los golpes, efectos de sonido (whoosh, boom, caja registradora, tic-tac, glitch, pop), barra de progreso arriba, beat trap original de fondo y fondo animado. Todo el arte (íconos, música, efectos) es original; no usa logos ni material de Rockstar.

## Uso

```bash
npm i
npm run dev                                   # vista previa en Remotion Studio
npx remotion render GTA6Record out/gta6.mp4   # exportar
```

Regenerar audio (opcional):

```bash
pip install kokoro-onnx soundfile scipy
# modelo: kokoro-v1.0.onnx y voices-v1.0.bin de github.com/thewh1teagle/kokoro-onnx (releases) en /home/user/tts/
python3 scripts/voz.py     # narración -> public/voz/*.wav y src/duraciones.json
python3 scripts/audio.py   # música y efectos -> public/musica.wav, public/sfx/*.wav
```

El texto está en `scripts/guion.json`: `texto` es lo que dice la voz y `pantalla` lo que se ve; `$3,790{tres_mil_setecientos_noventa}` muestra la cifra pero toma el tiempo de lo que se pronuncia.

## Fuentes

- Take-Two: https://www.take2games.com/ir/news/grand-theft-auto-vi-shatters-entertainment-box-office-records
- Make Tech Easier (preventas y Sensor Tower): https://maketecheasier.com/gta-6-day-one-sales-record/
- NBC (GTA V, ~$800 M el primer día): https://www.nbcnews.com/technolog/grand-theft-auto-v-sales-blow-past-1-billion-three-4b11216900
- Tendencias YouTube: https://creatordb.app/free-tools/whats-trending-on-youtube/gaming/
