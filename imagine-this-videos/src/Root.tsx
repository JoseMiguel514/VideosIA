import { IQ500Composition } from "./iq500/Video";
import { SheetComp } from "./test/Sheet";
import { MindsComposition } from "./minds/Video";
import { ShortsCompositions } from "./shorts/Shorts";
import { ThumbnailComposition } from "./iq500/Thumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <IQ500Composition />
      <MindsComposition />
      <ShortsCompositions />
      <SheetComp />
      <ThumbnailComposition />
    </>
  );
};
