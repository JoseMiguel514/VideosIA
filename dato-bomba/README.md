# Dato Bomba — Shorts (Remotion)

Proyecto compartido del canal: la misma edición (subtítulos karaoke, zoom-punch, flash, sacudidas, efectos, barra de progreso, beat original) y un **tema visual por video** que encaja con su historia.

| Tema | Video | Look |
|---|---|---|
| `gallery` | Van Gogh | Noche azul con remolinos de pincel y estrellas, marco dorado, tipografía clásica (Playfair Display / Lora), placa de museo |
| `sonar` | Submarino | Pantalla de sonar con barrido, pulsos y contactos, nieve marina, HUD "SONAR ACTIVO" con reloj, tipografía de terminal (Share Tech Mono / Rajdhani) |
| `stream` | GTA VI streams | Pantalla de stream: borde morado, insignia "EN VIVO", chat flotante, rejilla de píxeles, tipografía gamer (Bungee / Rubik) |
| `neon` | (por defecto) | Estilo neón original del canal |

Los temas están en `src/lib/themes.tsx`; cada uno define fuentes, paleta, fondo animado y overlay. Todos los componentes (`Big`, `Label`, `Stamp`, `Card`, subtítulos…) toman sus colores y fuentes del tema activo.

```
src/lib/          motor de tiempos, temas, componentes de UI, íconos y plantilla <Reel>
src/videos/<v>/   guion.json · duraciones.json · Video.tsx
public/<v>/       voz/*.wav y musica.wav de cada video
public/sfx/       efectos compartidos
```

| Video | Composición | Archivo | Duración |
|---|---|---|---|
| Van Gogh de $190.4 millones | `VanGogh` | `out/vangogh.mp4` | ~43 s |
| 217 días bajo el mar | `Submarino` | `out/submarino.mp4` | ~47 s |
| GTA VI rompió los streams | `GTA6Streams` | `out/gta6-streams.mp4` | ~38 s |

## Comandos

```bash
npm i
npm run dev                                       # Studio con los 3 videos
npx remotion render VanGogh out/vangogh.mp4       # exportar uno
python3 scripts/voz.py <video>                    # regenerar narración (Kokoro TTS)
python3 scripts/musica.py public/<video>/musica.wav <bpm> <semitonos> <semilla>
```

**Nuevo video:** copia una carpeta de `src/videos/`, cambia `guion.json`, corre `scripts/voz.py`, elige o crea un tema en `src/lib/themes.tsx`, ajusta las escenas y regístralo en `src/Root.tsx`.

## Publicación (TikTok)

### 1. Van Gogh
**Caption:** Este cuadro se vendió por $190.4 millones… y su autor casi no vendía en vida 🎨🤯 ¿Pagarías eso?
**Hashtags:** `#arte #vangogh #fyp #datoscuriosos #historia`

### 2. Submarino
**Caption:** 217 días bajo el mar sin ver el sol 🌊 ¿Tú aguantarías? 👇
**Hashtags:** `#fyp #datoscuriosos #submarino #curiosidades #oceano`

### 3. GTA VI streams
**Caption:** 24,000 años viendo a otros jugar GTA 6 en 2 días 🤯 ¿Lo juegas o lo ves en stream?
**Hashtags:** `#gta6 #gaming #fyp #gta #illojuan`

## Fuentes

**Van Gogh:** CNBC (19/11/2026) https://www.cnbc.com/2026/11/19/sothebys-van-gogh-painting-record-auction.html · Artforum https://www.artforum.com/news/van-gogh-fetches-eye-watering-190-4-million-at-auction-1234763909/ · HENI https://heni.com/news/article/vincent-van-gogh-chataigniers-en-fleurs-2026-11-18 · Cyprus Mail (50 años sin verse) https://cyprus-mail.com/2026/11/19/van-gogh-painting-unseen-for-50-years-sells-for-record-190-4-million

**Submarino:** UK Defence Journal https://ukdefencejournal.org.uk/hms-vengeance-returns-after-likely-longest-ever-patrol/ · Maritime Executive https://maritime-executive.com/article/217-days-underwater-british-bomber-returns-from-record-patrol · Naval Technology https://www.naval-technology.com/news/uk-trident-submarine-base-returm/ · World Today Journal https://world-today-journal.com/hms-vengeance-completes-record-217-day-underwater-patrol/ — la duración es estimación de prensa (el Ministerio de Defensa no la confirma); el video lo aclara.

**Streams:** Streams Charts https://streamscharts.com/specials/gta6 · https://streamscharts.com/news/gta-6-beats-other-aaa-launches · Inven Global https://www.invenglobal.com/articles/28854/gta-vi-sets-livestreaming-records-with-791m-peak-viewers-on-launch-day — 214.63 M horas ÷ 8,766 h/año ≈ 24,484 años.
