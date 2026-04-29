import type { LiveObject, LiveList, LiveMap } from "@liveblocks/client";

export type LayerType = "StickyNote" | "Path";

export type StickyNoteLayer = {
  type: "StickyNote";
  x: number;
  y: number;
  fill: string;
  text: string;
};

export type PathLayer = {
  type: "Path";
  x: number;
  y: number;
  fill: string;
  points: number[][]; // [x, y, pressure][]
};

export type Layer = StickyNoteLayer | PathLayer;

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      info: { name: string; color: string };
      pencilDraft: [x: number, y: number, pressure: number][] | null;
      penColor: string | null;
    };

    Storage: {
      layers: LiveMap<string, LiveObject<Layer>>;
      layerIds: LiveList<string>;
    };
  }
}

export {};
