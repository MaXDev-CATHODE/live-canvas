import { createClient, LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Use public API key directly for the demo
const client = createClient({
  publicApiKey: "pk_prod_your_public_key_here", // We'll need a real one or use test one
});

export type LayerType = "StickyNote";

export type Layer = {
  type: LayerType;
  x: number;
  y: number;
  fill: string;
  text: string;
};

// Presence represents the properties that exist on every user in the Room
type Presence = {
  cursor: { x: number; y: number } | null;
  info: { name: string; color: string };
};

// Storage represents the shared document that connects all users.
type Storage = {
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
};

export const {
  RoomProvider,
  useMyPresence,
  useOthers,
  useUpdateMyPresence,
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage>(client);
