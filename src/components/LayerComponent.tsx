import { memo } from "react";
import { useStorage } from "@liveblocks/react/suspense";
import { StickyNote } from "./StickyNote";
import { PathLayer } from "./PathLayer";

type LayerProps = {
  id: string;
  mode: "selection" | "pencil";
};

export const LayerComponent = memo(({ id, mode }: LayerProps) => {
  const layerType = useStorage((root) => root.layers[id]?.type);

  if (layerType === "StickyNote") {
    return <StickyNote id={id} mode={mode} />;
  }

  if (layerType === "Path") {
    return <PathLayer id={id} />;
  }

  return null;
});
