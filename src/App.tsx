import { RoomProvider } from "./liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { Canvas } from "./components/Canvas";
import { LiveList, LiveMap } from "@liveblocks/client";

// A mock name and color generator for users
const COLORS = ["#f87171", "#fb923c", "#fbbf24", "#34d399", "#38bdf8", "#818cf8", "#e879f9"];
const NAMES = ["Anonymous Bear", "Happy Fox", "Silent Wolf", "Clever Cat", "Swift Eagle"];

function App() {
  const initialPresence = {
    cursor: null,
    info: {
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
  };

  return (
    <RoomProvider 
      id="live-canvas-demo-room" 
      initialPresence={initialPresence}
      initialStorage={{
        layers: new LiveMap([]),
        layerIds: new LiveList([]),
      }}
    >
      <ClientSideSuspense fallback={<div className="flex items-center justify-center w-full h-screen bg-neutral-900 text-white/50 tracking-widest text-sm">ŁĄCZENIE Z SERWEREM KOLABORACJI...</div>}>
        {() => <Canvas />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default App;
