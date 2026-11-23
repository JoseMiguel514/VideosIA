import { IQ500Composition } from "./iq500/Video";
import { SheetComp } from "./test/Sheet";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <IQ500Composition />
      <SheetComp />
    </>
  );
};
