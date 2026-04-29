import { memo } from "react";
import { motion } from "motion/react";

type CursorProps = {
  x: number;
  y: number;
  color: string;
  name: string;
};

export const Cursor = memo(({ x, y, color, name }: CursorProps) => {
  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none drop-shadow-md z-50"
      initial={{ x, y, opacity: 0 }}
      animate={{ x, y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        damping: 30,
        mass: 0.8,
        stiffness: 350,
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform -translate-x-[2px] -translate-y-[2px]"
      >
        <path
          d="M5.65376 21.1568L2.03175 3.04285C1.65654 1.16666 3.73176 -0.320743 5.37895 0.638541L21.4329 9.99127C23.1465 10.9897 23.0039 13.5042 21.1866 14.3218L13.8824 17.6083C13.5855 17.7419 13.3421 17.9626 13.1895 18.2435L9.62066 24.8118C8.6853 26.5332 6.00287 26.2995 5.65376 21.1568Z"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
      <div
        className="absolute left-5 top-5 px-2 py-1 rounded-full text-xs text-white whitespace-nowrap font-medium tracking-wide shadow-sm"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </motion.div>
  );
});
