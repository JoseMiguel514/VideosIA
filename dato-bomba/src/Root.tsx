import { VanGoghComposition } from "./videos/vangogh/Video";
import { SubmarinoComposition } from "./videos/submarino/Video";
import { StreamsComposition } from "./videos/streams/Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <VanGoghComposition />
      <SubmarinoComposition />
      <StreamsComposition />
    </>
  );
};
