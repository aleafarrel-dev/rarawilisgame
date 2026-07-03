import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { PuzzlePiece } from './PuzzlePiece';

import type { PieceData } from './PuzzleGame';

export interface DropSlotProps {
  id: string;
  width: number;
  height: number;
  col: number;
  row: number;
  children?: React.ReactNode;
  targetPiece?: PieceData;
  shapePath?: string;
}

export function DropSlot({ id, width, height, col, row, children, targetPiece, shapePath }: DropSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width,
        height,
        position: 'absolute',
        left: col * width,
        top: row * height,
      }}
    >
      {isOver && !children && targetPiece && (
        <div style={{ opacity: 0.15 }}>
          <PuzzlePiece
            id={`${targetPiece.id}-hover`}
            path={targetPiece.path}
            color="#000"
            width={width}
            height={height}
            disabled={true}
            col={targetPiece.col}
            row={targetPiece.row}
            shapePath={shapePath}
            vLeft={targetPiece.vLeft}
            vTop={targetPiece.vTop}
            trueWidth={targetPiece.trueWidth}
            trueHeight={targetPiece.trueHeight}
            isPlaced={true}
          />
        </div>
      )}
      {children}
    </div>
  );
}
