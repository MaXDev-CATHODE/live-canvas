import { useOthers } from "../liveblocks.config";
import { Cursor } from "./Cursor";

export const Cursors = () => {
  // `useOthers` returns a list of all other users in the room
  // We map over them to render their cursors
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        if (presence == null || presence.cursor == null) {
          return null;
        }

        return (
          <Cursor
            key={connectionId}
            color={presence.info.color}
            name={presence.info.name}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        );
      })}
    </>
  );
};
