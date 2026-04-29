import { useUpdateMyPresence, useStorage } from "../liveblocks.config";
import { Cursors } from "./Cursors";
import { Toolbar } from "./Toolbar";
import { StickyNote } from "./StickyNote";

export const Canvas = () => {
  const updateMyPresence = useUpdateMyPresence();
  const layerIds = useStorage((root) => root.layerIds);

  // Handle pointer movements
  const handlePointerMove = (e: React.PointerEvent) => {
    // Math.round to reduce unneeded precision and save bandwidth
    updateMyPresence({
      cursor: {
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
      },
    });
  };

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };

  return (
    <div 
      className="relative w-full h-screen bg-neutral-900 overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-neutral-900">
        {/* Background grid or pattern could go here */}
        <div className="w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')]"></div>
      </div>
      
      {/* Live Cursors from other users */}
      <Cursors />
      
      {/* Render Sticky Notes */}
      {layerIds?.map((layerId) => (
        <StickyNote key={layerId} id={layerId} />
      ))}

      <Toolbar />
    </div>
  );
};
