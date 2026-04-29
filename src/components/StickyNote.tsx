import { memo } from "react";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { motion } from "motion/react";
import type { StickyNoteLayer } from "../liveblocks.config";

type StickyNoteProps = {
  id: string;
  mode: "selection" | "pencil";
};

export const StickyNote = memo(({ id, mode }: StickyNoteProps) => {
  const layer = useStorage((root) => {
    const l = root.layers[id];
    return l?.type === "StickyNote" ? (l as StickyNoteLayer) : null;
  });

  const updatePosition = useMutation(
    ({ storage }, x: number, y: number) => {
      const liveLayers = storage.get("layers");
      const liveLayer = liveLayers.get(id);
      if (liveLayer) liveLayer.update({ x, y });
    },
    [id]
  );

  const updateText = useMutation(
    ({ storage }, text: string) => {
      const liveLayers = storage.get("layers");
      const liveLayer = liveLayers.get(id);
      if (liveLayer) liveLayer.update({ text });
    },
    [id]
  );

  if (!layer) return null;

  return (
    <motion.div
      drag={mode === "selection"}
      dragMomentum={false}
      onDrag={(_, info) => {
        if (mode !== "selection") return;
        updatePosition(layer.x + info.delta.x, layer.y + info.delta.y);
      }}
      initial={{ x: layer.x, y: layer.y, scale: 0.8, opacity: 0 }}
      animate={{ x: layer.x, y: layer.y, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`absolute w-48 h-48 rounded-md shadow-lg shadow-black/20 p-4 ${mode === "selection" ? "cursor-grab active:cursor-grabbing pointer-events-auto" : "pointer-events-none"}`}
      style={{ backgroundColor: layer.fill }}
    >
      <textarea
        disabled={mode === "pencil"}
        className="w-full h-full bg-transparent border-none outline-none resize-none text-black/80 font-medium placeholder:text-black/30 disabled:opacity-100"
        placeholder="Napisz coś..."
        value={layer.text}
        onChange={(e) => updateText(e.target.value)}
        onPointerDown={(e) => e.stopPropagation()} 
      />
    </motion.div>
  );
});
