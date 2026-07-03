export type EdgeType = 0 | 1 | -1 | 2; // 0: flat, 1: tab (out), -1: blank (in), 2: extend flat

/**
 * Generates an SVG path for a jigsaw piece.
 * @param w Width of the piece's base rectangle
 * @param h Height of the piece's base rectangle
 * @param top Edge type for the top
 * @param right Edge type for the right
 * @param bottom Edge type for the bottom
 * @param left Edge type for the left
 */
export function generateJigsawPath(
  w: number,
  h: number,
  top: EdgeType,
  right: EdgeType,
  bottom: EdgeType,
  left: EdgeType
): string {
  // The tab size is proportional to the piece size
  const tabSizeX = w * 0.25;
  const tabSizeY = h * 0.25;

  // We construct the path starting from top-left (0,0)
  let path = `M 0 0`;

  // Top edge (moving left to right: (0,0) to (w,0))
  if (top === 0) {
    path += ` L ${w} 0`;
  } else if (top === 2) {
    path += ` L 0 -${h} L ${w} -${h} L ${w} 0`;
  } else {
    const dir = top === 1 ? -1 : 1;
    const ty = tabSizeY * dir;
    path += ` L ${w * 0.38} 0`;
    path += ` C ${w * 0.38} ${ty * 0.3}, ${w * 0.28} ${ty * 0.8}, ${w * 0.5} ${ty}`;
    path += ` C ${w * 0.72} ${ty * 0.8}, ${w * 0.62} ${ty * 0.3}, ${w * 0.62} 0`;
    path += ` L ${w} 0`;
  }

  // Right edge (moving top to bottom: (w,0) to (w,h))
  if (right === 0) {
    path += ` L ${w} ${h}`;
  } else if (right === 2) {
    path += ` L ${w * 2} 0 L ${w * 2} ${h} L ${w} ${h}`;
  } else {
    const dir = right === 1 ? 1 : -1;
    const tx = tabSizeX * dir;
    path += ` L ${w} ${h * 0.38}`;
    path += ` C ${w + tx * 0.3} ${h * 0.38}, ${w + tx * 0.8} ${h * 0.28}, ${w + tx} ${h * 0.5}`;
    path += ` C ${w + tx * 0.8} ${h * 0.72}, ${w + tx * 0.3} ${h * 0.62}, ${w} ${h * 0.62}`;
    path += ` L ${w} ${h}`;
  }

  // Bottom edge (moving right to left: (w,h) to (0,h))
  if (bottom === 0) {
    path += ` L 0 ${h}`;
  } else if (bottom === 2) {
    path += ` L ${w} ${h * 2} L 0 ${h * 2} L 0 ${h}`;
  } else {
    const dir = bottom === 1 ? 1 : -1;
    const ty = tabSizeY * dir;
    path += ` L ${w * 0.62} ${h}`;
    path += ` C ${w * 0.62} ${h + ty * 0.3}, ${w * 0.72} ${h + ty * 0.8}, ${w * 0.5} ${h + ty}`;
    path += ` C ${w * 0.28} ${h + ty * 0.8}, ${w * 0.38} ${h + ty * 0.3}, ${w * 0.38} ${h}`;
    path += ` L 0 ${h}`;
  }

  // Left edge (moving bottom to top: (0,h) to (0,0))
  if (left === 0) {
    path += ` L 0 0`;
  } else if (left === 2) {
    path += ` L -${w} ${h} L -${w} 0 L 0 0`;
  } else {
    const dir = left === 1 ? -1 : 1;
    const tx = tabSizeX * dir;
    path += ` L 0 ${h * 0.62}`;
    path += ` C ${tx * 0.3} ${h * 0.62}, ${tx * 0.8} ${h * 0.72}, ${tx} ${h * 0.5}`;
    path += ` C ${tx * 0.8} ${h * 0.28}, ${tx * 0.3} ${h * 0.38}, 0 ${h * 0.38}`;
    path += ` L 0 0`;
  }

  path += ` Z`;
  return path;
}
