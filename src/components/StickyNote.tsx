import { memo } from "react";
import { useMutation, useStorage } from "../liveblocks.config";
import { motion } from "framer-motion";

type StickyNoteProps = {
  id: string;
};

export const StickyNote = memo(({ id }: StickyNoteProps) => {
  const layer = useStorage((root) => root.layers[id]);

  const updatePosition = useMutation(
    ({ storage }, x: number, y: number) => {
      const liveLayers = storage.get("layers");
      const liveLayer = liveLayers.get(id);
      if (liveLayer) {
        liveLayer.update({ x, y });
      }
    },
    [id]
  );

  const updateText = useMutation(
    ({ storage }, text: string) => {
      const liveLayers = storage.get("layers");
      const liveLayer = liveLayers.get(id);
      if (liveLayer) {
        liveLayer.update({ text });
      }
    },
    [id]
  );

  if (!layer) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDrag={(_, info) => {
        // Optimistic local update via framer-motion is fine, 
        // we sync to liveblocks continuously
        updatePosition(layer.x + info.delta.x, layer.y + info.delta.y);
      }}
      initial={{ x: layer.x, y: layer.y, scale: 0.8, opacity: 0 }}
      animate={{ x: layer.x, y: layer.y, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute w-48 h-48 rounded-md shadow-lg shadow-black/20 p-4 cursor-grab active:cursor-grabbing pointer-events-auto"
      style={{ backgroundColor: layer.fill }}
    >
      <textarea
        className="w-full h-full bg-transparent border-none outline-none resize-none text-black/80 font-medium placeholder:text-black/30"
        placeholder="Napisz coś..."
        value={layer.text}
        onChange={(e) => updateText(e.target.value)}
        // Stop pointer propagation so dragging doesn't conflict when typing
        onPointerDown={(e) => e.stopPropagation()} 
      />
    </motion.div>
  );
});
