/**
 * Puzzle level definitions.
 * Each level describes the shape layout ('X' = active cell), a display color,
 * and an SVG path that silhouettes the target shape on the board.
 *
 * To add a new level: append an object to this array following the same shape.
 * `layout` rows must all have the same length (pad with spaces for non-square shapes).
 */

export interface PuzzleLevel {
  id: string;
  name: string;
  color: string;
  /** Grid layout — 'X' means an active puzzle cell, ' ' means empty. */
  layout: string[];
  /** SVG path for the target shape silhouette (scaled to pieceW × pieceH units). */
  shapePath: string;
}

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    id: 'square-2x2',
    name: 'Persegi (Level 1)',
    color: '#f4a261',
    layout: [
      'XX',
      'XX',
    ],
    shapePath: 'M 0 0 H 160 V 160 H 0 Z',
  },
  {
    id: 'trapesium',
    name: 'Trapesium (Level 2)',
    color: '#2a9d8f',
    layout: [
      ' XX ',
      'XXXX',
    ],
    shapePath: 'M 80 0 L 240 0 L 320 160 L 0 160 Z',
  },
  {
    id: 'belah-ketupat',
    name: 'Belah Ketupat (Level 3)',
    color: '#e9c46a',
    layout: [
      '  X  ',
      ' XXX ',
      'XXXXX',
      ' XXX ',
      '  X  ',
    ],
    shapePath: 'M 200 0 L 400 200 L 200 400 L 0 200 Z',
  },
  {
    id: 'rect-5x3',
    name: 'Persegi Panjang (Level 4)',
    color: '#e76f51',
    layout: [
      'XXXXX',
      'XXXXX',
      'XXXXX',
    ],
    shapePath: 'M 0 0 H 400 V 240 H 0 Z',
  },
  {
    id: 'segitiga',
    name: 'Segitiga (Level 5)',
    color: '#8338ec',
    layout: [
      '  X  ',
      ' XXX ',
      'XXXXX',
    ],
    shapePath: 'M 200 0 L 400 240 L 0 240 Z',
  },
  {
    id: 'jajar-genjang',
    name: 'Jajar Genjang (Level 6)',
    color: '#3a86ff',
    layout: [
      '  XXXX',
      ' XXXX ',
      'XXXX  ',
    ],
    shapePath: 'M 160 0 L 480 0 L 320 240 L 0 240 Z',
  },
];
