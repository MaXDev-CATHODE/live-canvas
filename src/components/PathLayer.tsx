import { memo } from "react";
import { useStorage } from "@liveblocks/react/suspense";
import { Path } from "./Path";
import type { PathLayer as PathLayerType } from "../liveblocks.config";

export const PathLayer = memo(({ id }: { id: string }) => {
  const layer = useStorage((root) => {
    const l = root.layers[id];
    return l?.type === "Path" ? (l as PathLayerType) : null;
  });

  if (!layer) return null;

  return (
    <Path
      x={layer.x}
      y={layer.y}
      points={layer.points}
      fill={layer.fill}
    />
  );
});
