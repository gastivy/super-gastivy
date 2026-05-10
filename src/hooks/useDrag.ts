import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseDragReturn {
  position: Position;
  isDragging: boolean;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  ref: React.RefObject<HTMLDivElement | null>;
}

const useDrag = (): UseDragReturn => {
  const [position, setPosition] = useState<Position>({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef<Position>({ x: 0, y: 0 });

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!ref.current) return;

    // Initialize position from actual DOM position on first drag
    const rect = ref.current.getBoundingClientRect();
    setPosition((prev) => {
      if (prev.x >= 0) return prev;
      return { x: rect.left, y: rect.top };
    });

    dragStart.current = { x: clientX, y: clientY };
    setIsDragging(true);
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !ref.current) return;

      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;

      setPosition((prev) => {
        const rect = ref.current!.getBoundingClientRect();

        const newX = Math.max(
          0,
          Math.min(prev.x + deltaX, window.innerWidth - rect.width)
        );
        const newY = Math.max(
          0,
          Math.min(prev.y + deltaY, window.innerHeight - rect.height)
        );

        return { x: newX, y: newY };
      });

      dragStart.current = { x: clientX, y: clientY };
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };
    const onMouseUp = () => handleEnd();

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => handleEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    },
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
  };

  return { position, isDragging, handlers, ref };
};

export default useDrag;
