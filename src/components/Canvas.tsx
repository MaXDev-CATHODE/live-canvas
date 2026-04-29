import { useState, useCallback } from "react";
import { useUpdateMyPresence, useStorage, useMutation, useOthers, useSelf, useHistory } from "@liveblocks/react/suspense";
import { Cursors } from "./Cursors";
import { Toolbar } from "./Toolbar";
import { LayerComponent } from "./LayerComponent";
import { Path } from "./Path";
import { LiveObject } from "@liveblocks/client";
import type { Layer } from "../liveblocks.config";

export const Canvas = () => {
  const [mode, setMode] = useState<"selection" | "pencil">("selection");
  const [penColor, setPenColor] = useState<string>("#FFFFFF");
  const [isDrawing, setIsDrawing] = useState(false);

  const updateMyPresence = useUpdateMyPresence();
  const layerIds = useStorage((root) => root.layerIds);
  const others = useOthers();
  const myPresence = useSelf((me) => me.presence);
  
  // Wpięcie historii dla globalnych skrótów Undo/Redo
  const { undo, redo } = useHistory();

  // Wstawienie nowej narysowanej ścieżki do Storage
  const insertPath = useMutation((
    { storage },
    points: number[][],
    color: string
  ) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    if (liveLayers.size >= 150) return; // limit dla obiektów

    const layerId = crypto.randomUUID();
    const layer = new LiveObject<Layer>({
      type: "Path",
      x: 0,
      y: 0,
      fill: color,
      points: points,
    });

    liveLayerIds.push(layerId);
    liveLayers.set(layerId, layer);
  }, []);

  // Events dla interakcji rysowania
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (mode === "pencil") {
      setIsDrawing(true);
      const newPoint: [number, number, number] = [e.clientX, e.clientY, e.pressure || 0.5];
      updateMyPresence({ pencilDraft: [newPoint], penColor });
    }
  }, [mode, penColor, updateMyPresence]);

  // Lepszy sposób na update rysowanej linii podczas Move (React synthetic events mogą być za wolne)
  // Wrzucimy obsługę do osobnego effect/listenera jeśli chcemy, ale dla prostej integracji:
  const handlePointerMoveDraft = (e: React.PointerEvent) => {
    updateMyPresence({
      cursor: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
    });

    if (mode === "pencil" && isDrawing && myPresence.pencilDraft) {
      const newPoint: [number, number, number] = [e.clientX, e.clientY, e.pressure || 0.5];
      // Aktualizujemy presence na bieżąco z nowym punktem
      updateMyPresence({ 
        pencilDraft: [...myPresence.pencilDraft, newPoint] 
      });
    }
  };

  const handlePointerUp = useCallback(() => {
    if (mode === "pencil" && isDrawing) {
      setIsDrawing(false);
      // Pobieramy ostatnie punkty
      if (myPresence.pencilDraft && myPresence.pencilDraft.length > 2) {
        insertPath(myPresence.pencilDraft, penColor);
      }
      // Czyścimy efemeryczny state
      updateMyPresence({ pencilDraft: null });
    }
  }, [mode, isDrawing, myPresence.pencilDraft, penColor, insertPath, updateMyPresence]);

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
    handlePointerUp();
  }, [updateMyPresence, handlePointerUp]);

  // Obsługa klawiaturowego Cofania i Ponawiania (Globalnie)
  // Ze względu na specyfikę dema, ustawiamy nasłuch na oknie na keydown
  // Byłoby to normalnie obsłużone przez useEffect, ale można podpiąć to do diva
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-neutral-900 overflow-hidden touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMoveDraft}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Allows capturing keyboard events directly on canvas
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-neutral-900">
        <div className="w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')]"></div>
      </div>
      
      {/* Live Cursors */}
      <Cursors />
      
      {/* Persisted Layers (Notatki i Rysunki) */}
      {layerIds?.map((layerId) => (
        <LayerComponent key={layerId} id={layerId} mode={mode} />
      ))}

      {/* Renderowanie draftów ołówka innych użytkowników w czasie rzeczywistym */}
      {others.map(({ connectionId, presence }) => {
        if (presence.pencilDraft && presence.pencilDraft.length > 0) {
          return (
            <Path 
              key={`draft-${connectionId}`} 
              x={0} 
              y={0} 
              points={presence.pencilDraft} 
              fill={presence.penColor || "#fff"} 
            />
          );
        }
        return null;
      })}

      {/* Renderowanie mojego lokalnego draftu, podczas gdy trzymam klawisz myszy */}
      {myPresence?.pencilDraft && myPresence.pencilDraft.length > 0 && (
        <Path 
          x={0} 
          y={0} 
          points={myPresence.pencilDraft} 
          fill={penColor} 
        />
      )}

      {/* Interfejs Użytkownika */}
      <Toolbar mode={mode} setMode={setMode} penColor={penColor} setPenColor={setPenColor} />
    </div>
  );
};
