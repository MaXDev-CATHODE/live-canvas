import { memo } from "react";
import { useMutation, useStorage, useRoom } from "@liveblocks/react/suspense";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { StickyNoteLayer } from "../liveblocks.config";

type StickyNoteProps = {
  id: string;
  mode: "selection" | "pencil";
};

export const StickyNote = memo(({ id, mode }: StickyNoteProps) => {
  const room = useRoom();
  
  const layer = useStorage((root) => {
    const l = root.layers[id];
    return l?.type === "StickyNote" ? (l as StickyNoteLayer) : null;
  });

  const updatePosition = useMutation(
    ({ storage }, x: number, y: number) => {
      room.history.disable(() => {
        const liveLayers = storage.get("layers");
        const liveLayer = liveLayers.get(id);
        if (liveLayer) liveLayer.update({ x, y });
      });
    },
    [id, room]
  );

  const updateText = useMutation(
    ({ storage }, text: string) => {
      room.history.disable(() => {
        const liveLayers = storage.get("layers");
        const liveLayer = liveLayers.get(id);
        if (liveLayer) liveLayer.update({ text });
      });
    },
    [id, room]
  );

  const deleteLayer = useMutation(
    ({ storage }) => {
      room.history.disable(() => {
        const liveLayers = storage.get("layers");
        const liveLayerIds = storage.get("layerIds");
        liveLayers.delete(id);
        const index = liveLayerIds.findIndex((l) => l === id);
        if (index !== -1) {
          liveLayerIds.delete(index);
        }
      });
    },
    [id, room]
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
      className={`absolute w-48 h-48 rounded-md shadow-lg shadow-black/20 p-4 group ${mode === "selection" ? "cursor-grab active:cursor-grabbing pointer-events-auto" : "pointer-events-none"}`}
      style={{ backgroundColor: layer.fill }}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); deleteLayer(); }}
        className="absolute top-2 right-2 w-6 h-6 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        disabled={mode === "pencil"}
      >
        <X className="w-4 h-4 text-black/60" />
      </button>

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
