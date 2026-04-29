import "./liveblocks.config"; // Load global type declarations
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Canvas } from "./components/Canvas";
import { LiveList, LiveMap } from "@liveblocks/client";

// Random name and color generator for anonymous users
const COLORS = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#34d399",
  "#38bdf8",
  "#818cf8",
  "#e879f9",
];
const NAMES = [
  "Anonymous Bear",
  "Happy Fox",
  "Silent Wolf",
  "Clever Cat",
  "Swift Eagle",
];

function App() {
  return (
    <LiveblocksProvider
      publicApiKey="pk_dev_rkZsvUsxx3Z3fnaTNQ8wi7zVJ2dT1nMhqfHr-pzE4BdMLvPpohSZoyw4qb_qCRBI"
    >
      <RoomProvider
        id="live-canvas-demo-room"
        initialPresence={{
          cursor: null,
          info: {
            name: NAMES[Math.floor(Math.random() * NAMES.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          },
        }}
        initialStorage={{
          layers: new LiveMap([]),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="flex items-center justify-center w-full h-screen bg-neutral-900 text-white/50 tracking-widest text-sm">
              ŁĄCZENIE Z SERWEREM KOLABORACJI...
            </div>
          }
        >
          <Canvas />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export default App;
