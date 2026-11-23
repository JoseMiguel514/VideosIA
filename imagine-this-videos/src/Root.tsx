import { IQ500Composition } from "./iq500/Video";
import { SheetComp } from "./test/Sheet";
import { ThumbnailComposition } from "./iq500/Thumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <IQ500Composition />
      <SheetComp />
      <ThumbnailComposition />
    </>
  );
};
