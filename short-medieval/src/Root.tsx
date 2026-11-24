import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { GtaPerfiles, GTA_PERFILES_FRAMES } from "./videos/GtaPerfiles";
import { Peste, PESTE_FRAMES } from "./videos/Peste";
import { GtaFiltracion, GTA_FILTRACION_FRAMES } from "./videos/GtaFiltracion";
import { Venus, VENUS_FRAMES } from "./videos/Venus";

const V = { fps: 30, width: 1080, height: 1920 };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition id="GtaPerfiles" component={GtaPerfiles} durationInFrames={GTA_PERFILES_FRAMES} {...V} />
      <Composition id="Peste" component={Peste} durationInFrames={PESTE_FRAMES} {...V} />
      <Composition id="GtaFiltracion" component={GtaFiltracion} durationInFrames={GTA_FILTRACION_FRAMES} {...V} />
      <Composition id="Venus" component={Venus} durationInFrames={VENUS_FRAMES} {...V} />
    </>
  );
};
