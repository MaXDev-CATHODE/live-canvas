import { useMutation } from "../liveblocks.config";
import type { Layer } from "../liveblocks.config";
import { StickyNote } from "lucide-react";
import { LiveObject } from "@liveblocks/client";

const COLORS = ["#FEF08A", "#BBF7D0", "#BFDBFE", "#FBCFE8", "#FED7AA"];

export const Toolbar = () => {
  const insertLayer = useMutation((
    { storage },
    layerType: "StickyNote",
    position: { x: number, y: number }
  ) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    if (liveLayers.size >= 100) return; // Prevent too many objects

    const layerId = crypto.randomUUID();
    const fill = COLORS[Math.floor(Math.random() * COLORS.length)];

    const layer = new LiveObject<Layer>({
      type: layerType,
      x: position.x,
      y: position.y,
      fill: fill,
      text: "",
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);
  }, []);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl z-50">
      <button 
        onClick={() => insertLayer("StickyNote", { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 })}
        className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/20 text-white rounded-xl transition-all hover:scale-105 group relative"
      >
        <StickyNote className="w-6 h-6 group-hover:text-yellow-300 transition-colors" />
        <div className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Nowa Notatka
        </div>
      </button>
    </div>
  );
};
