import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils/getSvgPathFromStroke";
import { memo } from "react";

type PathProps = {
  x: number;
  y: number;
  points: number[][];
  fill: string;
};

export const Path = memo(({ x, y, points, fill }: PathProps) => {
  // Generowanie gładkiej krzywej za pomocą perfect-freehand
  // Opcje dobrano tak, by symulować przyjemny odręczny pisak (ołówek)
  const stroke = getStroke(points, {
    size: 6,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  const pathData = getSvgPathFromStroke(stroke);

  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      style={{ overflow: 'visible', zIndex: 40 }}
    >
      <path
        d={pathData}
        fill={fill}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      />
    </svg>
  );
});
