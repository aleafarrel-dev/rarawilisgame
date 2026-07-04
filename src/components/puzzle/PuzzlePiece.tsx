import React from 'react';
import { useDraggable } from '@dnd-kit/core';
export interface PuzzlePieceProps {
  id: string;
  path: string;
  color: string;
  width: number;
  height: number;
  disabled?: boolean;
  col?: number;
  row?: number;
  shapePath?: string;
  vLeft?: number;
  vTop?: number;
  trueWidth?: number;
  trueHeight?: number;
  isPlaced?: boolean;
}

export function PuzzlePiece({ id, path, color, width, height, disabled, col, row, shapePath, vLeft = 0, vTop = 0, trueWidth = width, trueHeight = height, isPlaced = false }: PuzzlePieceProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled
  });

  const style: React.CSSProperties = {
    zIndex: isDragging ? 50 : 1,
    cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
    touchAction: 'none',
    width: trueWidth,
    height: trueHeight,
    position: 'absolute',
    top: isPlaced ? vTop : 0,
    left: isPlaced ? vLeft : 0,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} className="no-click-sfx" style={style} {...listeners} {...attributes} aria-label={`Puzzle Piece ${id}`}>
      <svg width={trueWidth} height={trueHeight} viewBox={`${vLeft} ${vTop} ${trueWidth} ${trueHeight}`} style={{ overflow: 'visible' }}>
        <defs>
          <filter id={`shadow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
          </filter>
          {shapePath && col !== undefined && row !== undefined && (
            <>
              <mask id={`mask-shape-${id}`}>
                <path d={shapePath} transform={`translate(-${col * width}, -${row * height})`} fill="white" />
              </mask>
              <mask id={`mask-jigsaw-${id}`}>
                <path d={path} fill="white" />
              </mask>
            </>
          )}
        </defs>

        <g filter={!isPlaced ? `url(#shadow-${id})` : undefined}>
          {shapePath && col !== undefined && row !== undefined ? (
            <>
              <g mask={`url(#mask-shape-${id})`}>
                <path d={path} fill={color} />
                <path d={path} fill="none" stroke="#1b263b" strokeWidth="1.5" strokeLinejoin="round" />
              </g>
              <g mask={`url(#mask-jigsaw-${id})`}>
                <path d={shapePath} transform={`translate(-${col * width}, -${row * height})`} fill="none" stroke="#1b263b" strokeWidth="1.5" strokeLinejoin="round" />
              </g>
            </>
          ) : (
            <>
              <path d={path} fill={color} />
              <path d={path} fill="none" stroke="#1b263b" strokeWidth="1.5" strokeLinejoin="round" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
