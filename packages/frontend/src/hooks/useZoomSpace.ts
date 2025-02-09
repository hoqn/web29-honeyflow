import React, { useRef } from "react";

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

const getMousePointTo = (
  stage: Konva.Stage,
  pointer: { x: number; y: number },
  oldScale: number,
) => {
  return {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };
};

const calculateNewScale = (
  oldScale: number,
  deltaY: number,
  scaleBy: number,
) => {
  return deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
};

const calculateNewPosition = (
  pointer: { x: number; y: number },
  mousePointTo: { x: number; y: number },
  newScale: number,
) => {
  return {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
};

interface UseZoomSpaceProps {
  stageRef: React.RefObject<Konva.Stage>;
  scaleBy?: number;
  minScale?: number;
  maxScale?: number;
}

export function useZoomSpace({
  stageRef,
  scaleBy = 1.05,
  minScale = 0.5,
  maxScale = 2.5,
}: UseZoomSpaceProps) {
  const animationFrameId = useRef<number | null>(null);

  const zoomSpace = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    if (!event.evt.ctrlKey && !event.evt.metaKey) {
      return;
    }

    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = getMousePointTo(stage, pointer, oldScale);
      let newScale = calculateNewScale(oldScale, event.evt.deltaY, scaleBy);

      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      if (newScale === oldScale) {
        return;
      }

      const newPosition = calculateNewPosition(pointer, mousePointTo, newScale);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        stage.scale({ x: newScale, y: newScale });
        stage.position(newPosition);
        stage.batchDraw();
      });
    }
  };

  return { zoomSpace };
}
