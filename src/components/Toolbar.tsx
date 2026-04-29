import { useMutation, useHistory } from "@liveblocks/react/suspense";
import type { Layer } from "../liveblocks.config";
import { StickyNote, MousePointer2, Pencil, Undo2, Redo2 } from "lucide-react";
import { LiveObject } from "@liveblocks/client";

const COLORS = ["#FEF08A", "#BBF7D0", "#BFDBFE", "#FBCFE8", "#FED7AA", "#FFFFFF", "#000000", "#EF4444"];

type ToolbarProps = {
  mode: "selection" | "pencil";
  setMode: (mode: "selection" | "pencil") => void;
  penColor: string;
  setPenColor: (color: string) => void;
};

export const Toolbar = ({ mode, setMode, penColor, setPenColor }: ToolbarProps) => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  
  const insertLayer = useMutation((
    { storage },
    layerType: "StickyNote",
    position: { x: number, y: number }
  ) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    if (liveLayers.size >= 100) return; // Prevent too many objects

    const layerId = crypto.randomUUID();
    const fill = COLORS[Math.floor(Math.random() * 5)]; // We only want the first 5 pastel colors for notes

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
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl z-50">
      
      {/* Undo/Redo */}
      <div className="flex gap-1 mr-2 border-r border-white/10 pr-2">
        <button 
          onClick={undo}
          disabled={!canUndo}
          className="w-10 h-10 flex items-center justify-center bg-transparent text-white/50 disabled:opacity-30 disabled:hover:bg-transparent hover:bg-white/10 hover:text-white rounded-xl transition-all"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button 
          onClick={redo}
          disabled={!canRedo}
          className="w-10 h-10 flex items-center justify-center bg-transparent text-white/50 disabled:opacity-30 disabled:hover:bg-transparent hover:bg-white/10 hover:text-white rounded-xl transition-all"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Tools */}
      <button 
        onClick={() => setMode("selection")}
        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all hover:scale-105 group relative ${mode === "selection" ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-white/5 text-white/70 hover:bg-white/20"}`}
      >
        <MousePointer2 className="w-5 h-5" />
      </button>

      <button 
        onClick={() => setMode("pencil")}
        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all hover:scale-105 group relative ${mode === "pencil" ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-white/5 text-white/70 hover:bg-white/20"}`}
      >
        <Pencil className="w-5 h-5" />
      </button>

      {/* Pencil Colors */}
      {mode === "pencil" && (
        <div className="flex gap-2 items-center mx-2 pl-2 border-l border-white/10">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setPenColor(c)}
              className={`w-7 h-7 rounded-full border-[3px] transition-all hover:scale-110 ${penColor === c ? "scale-125 border-white shadow-lg" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}

      {/* Insert Note */}
      <div className="w-px h-8 bg-white/10 mx-2" />
      <button 
        onClick={() => {
          setMode("selection");
          insertLayer("StickyNote", { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 });
        }}
        className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/20 text-white rounded-xl transition-all hover:scale-105 group relative"
      >
        <StickyNote className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
        <div className="absolute -top-10 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Notatka
        </div>
      </button>
    </div>
  );
};
