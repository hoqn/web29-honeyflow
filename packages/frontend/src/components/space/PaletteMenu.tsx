import { useEffect, useState } from "react";

import { Image, Link, LucideIcon, NotebookPen, X } from "lucide-react";

import { circle, hexagon } from "@/assets/shapes";

type PaletteButtonType = "note" | "image" | "link" | "close";
type Position = { top: number; left: number };

type PaletteButtonProps = {
  variant: PaletteButtonType;
  position: Position;
};

const buttonConfig: Record<
  PaletteButtonType,
  { icon: LucideIcon; color: string }
> = {
  note: { icon: NotebookPen, color: "fill-yellow-300" },
  image: { icon: Image, color: "fill-yellow-400" },
  link: { icon: Link, color: "fill-yellow-500" },
  close: { icon: X, color: "fill-yellow-200" },
};

const CONTAINER_SIZE = 160;
const BUTTON_SIZE = 60;
const RADIUS = 55;
const MAX_ITEMS = 6;
const CENTER_OFFSET = (CONTAINER_SIZE - BUTTON_SIZE) / 2;

function PaletteButton({ variant, position }: PaletteButtonProps) {
  const { icon: Icon, color } = buttonConfig[variant];
  const [transform, setTransform] = useState("translate(0, 0)");

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      animationFrameId = requestAnimationFrame(() => {
        setTransform(
          `translate(${position.left - CENTER_OFFSET}px, ${position.top - CENTER_OFFSET}px)`,
        );
      });
    };

    updatePosition();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [position.left, position.top]);

  return (
    <div
      className="absolute transition-transform duration-300 ease-in-out"
      style={{
        top: CENTER_OFFSET,
        left: CENTER_OFFSET,
        transform,
        zIndex: variant === "close" ? 10 : "auto",
      }}
    >
      <button
        className="relative hover:scale-110 transition-transform"
        style={{
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
        }}
      >
        <svg viewBox="0 0 100 100">
          <path d={circle} className={color}>
            <animate
              attributeName="d"
              from={circle}
              to={hexagon}
              dur="0.6s"
              fill="freeze"
            />
          </path>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
}

type PaletteMenuProps = {
  /** 팔레트 메뉴에 표시 옵션 (최대 6개) */
  items: PaletteButtonType[];
};

function getPositionByIndex(index: number): Position {
  const centerPoint = CONTAINER_SIZE / 2;
  const angle = index * (360 / MAX_ITEMS) * (Math.PI / 180);
  const offset = centerPoint - BUTTON_SIZE / 2;

  return {
    top: offset + RADIUS * Math.sin(angle),
    left: offset + RADIUS * Math.cos(angle),
  };
}

export default function PaletteMenu({ items }: PaletteMenuProps) {
  if (import.meta.env.MODE === "development" && items.length > MAX_ITEMS) {
    throw new Error(
      `팔레트 메뉴는 ${MAX_ITEMS}개의 옵션만 표시할 수 있습니다.`,
    );
  }

  const centerOffset = CONTAINER_SIZE / 2 - BUTTON_SIZE / 2;

  return (
    <div
      className="relative"
      style={{
        width: CONTAINER_SIZE,
        height: CONTAINER_SIZE,
      }}
    >
      <PaletteButton
        variant="close"
        position={{
          top: centerOffset,
          left: centerOffset,
        }}
      />
      {items.slice(0, MAX_ITEMS).map((variant, index) => (
        <PaletteButton
          key={`${variant}-${index}`}
          variant={variant}
          position={getPositionByIndex(index)}
        />
      ))}
    </div>
  );
}