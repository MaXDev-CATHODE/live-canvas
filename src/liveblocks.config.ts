import type { LiveObject, LiveList, LiveMap } from "@liveblocks/client";

// Shared types for layers
export type LayerType = "StickyNote";

export type Layer = {
  type: LayerType;
  x: number;
  y: number;
  fill: string;
  text: string;
};

// Liveblocks v3 global type declarations
// Hooks automatically resolve these types without generics
declare global {
  interface Liveblocks {
    // Presence: ephemeral per-user data (resets on disconnect)
    Presence: {
      cursor: { x: number; y: number } | null;
      info: { name: string; color: string };
    };

    // Storage: persistent shared state (CRDT-backed)
    Storage: {
      layers: LiveMap<string, LiveObject<Layer>>;
      layerIds: LiveList<string>;
    };
  }
}

export {};
