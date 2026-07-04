import { useState, useEffect } from 'react';
import { navigate } from 'astro:transitions/client';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { PuzzlePiece } from './PuzzlePiece';
import { DropSlot } from './DropSlot';
import { generateJigsawPath } from '../../utils/jigsaw';
import type { EdgeType } from '../../utils/jigsaw';
import confetti from 'canvas-confetti';
import { playAudio } from '../../stores/audioStore';
import { VolumeControl } from './VolumeControl';
import { PUZZLE_LEVELS } from '../../data/puzzleLevels';
import { WinDialog } from './WinDialog';

export interface PieceData {
  id: string;
  col: number;
  row: number;
  isPlaced: boolean;
  edgeTop: EdgeType;
  edgeRight: EdgeType;
  edgeBottom: EdgeType;
  edgeLeft: EdgeType;
}


export default function PuzzleGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const level = PUZZLE_LEVELS[currentLevelIndex];

  const layout = level.layout;
  const cols = layout[0].length;
  const rows = layout.length;
  const color = level.color;

  // Dynamic piece sizes
  const [pieceW, setPieceW] = useState(80);
  const [pieceH, setPieceH] = useState(80);

  useEffect(() => {
    const updateSize = () => {
      let appW = window.innerWidth;
      let appH = appW * 0.5625;
      if (appH > window.innerHeight) {
        appH = window.innerHeight;
        appW = appH * 1.7777;
      }
      // Calculate a comfortable size for pieces based on the app container height
      const newSize = Math.max(30, Math.min(80, appH * 0.14));
      setPieceW(newSize);
      setPieceH(newSize);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [pieces, setPieces] = useState<PieceData[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Initialize pieces on mount or level change
  useEffect(() => {
    setIsWon(false);
    const newPieces: PieceData[] = [];
    const hEdges = Array.from({ length: rows - 1 }, () => Array.from({ length: cols }, () => Math.random() > 0.5 ? 1 : -1));
    const vEdges = Array.from({ length: rows }, () => Array.from({ length: cols - 1 }, () => Math.random() > 0.5 ? 1 : -1));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (layout[r][c] !== 'X') continue;

        const hasTop = r > 0 && layout[r - 1][c] === 'X';
        const hasRight = c < cols - 1 && layout[r][c + 1] === 'X';
        const hasBottom = r < rows - 1 && layout[r + 1][c] === 'X';
        const hasLeft = c > 0 && layout[r][c - 1] === 'X';

        const top = (hasTop ? -hEdges[r - 1][c] : 0) as EdgeType;
        const right = (hasRight ? vEdges[r][c] : 2) as EdgeType;
        const bottom = (hasBottom ? hEdges[r][c] : 0) as EdgeType;
        const left = (hasLeft ? -vEdges[r][c - 1] : 2) as EdgeType;

        newPieces.push({
          id: `piece-${level.id}-${c}-${r}`, col: c, row: r, isPlaced: false,
          edgeTop: top, edgeRight: right, edgeBottom: bottom, edgeLeft: left
        });
      }
    }

    // Shuffle pieces so they appear randomly in the tray
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  }, [currentLevelIndex]); // Re-run when level changes

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevent drag on slight clicks
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over) {
      // Check if dropped on the correct slot
      const pieceId = active.id;
      const slotId = over.id; // e.g. slot-c-r

      const piece = pieces.find(p => p.id === pieceId);
      if (piece && `slot-${piece.col}-${piece.row}` === slotId) {
        // Correct slot — snap SFX
        playAudio('/assets/audio/mouse-click.mp3');
        const newPieces = pieces.map(p => p.id === pieceId ? { ...p, isPlaced: true } : p);
        setPieces(newPieces);

        // Check win condition
        if (newPieces.every(p => p.isPlaced)) {
          setIsWon(true);
          playAudio('/assets/audio/hooray.mp3');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        // Wrong slot!
        playAudio('/assets/audio/try-again.mp3');
      }
    }
  };

  // Compute visual properties on the fly to support dynamic resizing
  const scaleFactor = pieceW / 80;
  const scaledShapePath = level.shapePath.replace(/[-+]?[0-9]*\.?[0-9]+/g, m => String(Number(m) * scaleFactor));

  const piecesWithVisuals = pieces.map(p => {
    const path = generateJigsawPath(pieceW, pieceH, p.edgeTop, p.edgeRight, p.edgeBottom, p.edgeLeft);
    const vTop = p.edgeTop === 2 ? -pieceH : (p.edgeTop === 1 ? -pieceH * 0.25 : 0);
    const vRight = p.edgeRight === 2 ? pieceW * 2 : (p.edgeRight === 1 ? pieceW * 1.25 : pieceW);
    const vBottom = p.edgeBottom === 2 ? pieceH * 2 : (p.edgeBottom === 1 ? pieceH * 1.25 : pieceH);
    const vLeft = p.edgeLeft === 2 ? -pieceW : (p.edgeLeft === 1 ? -pieceW * 0.25 : 0);
    const trueWidth = vRight - vLeft;
    const trueHeight = vBottom - vTop;
    return { ...p, path, vLeft, vTop, trueWidth, trueHeight };
  });

  const trayPieces = piecesWithVisuals.filter(p => !p.isPlaced);
  const boardWidth = cols * pieceW;
  const boardHeight = rows * pieceH;

  const nextLevel = () => {
    if (currentLevelIndex < PUZZLE_LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      // All levels done — use View Transitions navigate to preserve audio
      navigate('/end');
    }
  };

  if (!isPlaying) {
    return (
      <>
        {/* Full-screen Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(/assets/images/puzzle-background-menu.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }} />

        {/* Constrained Content Container */}
        <div style={{
          position: 'absolute', // Constrained to .puzzle-wrapper / app-container
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Navigation Buttons (Corners of app-container) */}
          <div style={{ position: 'absolute', top: '5cqh', left: '5cqw', width: '7cqw', zIndex: 30 }}>
            <VolumeControl />
          </div>

          <a href="/menu" style={{ position: 'absolute', top: '5cqh', right: '5cqw', display: 'inline-block', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/assets/button/home-button.png" alt="Home" style={{ width: '100%', objectFit: 'contain' }} />
          </a>

          <a href="/menu" style={{ position: 'absolute', bottom: '5cqh', left: '5cqw', display: 'inline-block', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/assets/button/prev-button.png" alt="Prev" style={{ width: '100%', objectFit: 'contain' }} />
          </a>

          <button onClick={() => setIsPlaying(true)} style={{ position: 'absolute', bottom: '5cqh', right: '5cqw', background: 'none', border: 'none', cursor: 'pointer', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/assets/button/next-button.png" alt="Next" style={{ width: '100%', objectFit: 'contain' }} />
          </button>

          {/* Title */}
          <h1 style={{
            fontSize: '6cqw',
            color: '#ff4d4d', // Red color
            textAlign: 'center',
            lineHeight: '1.2',
            marginBottom: '5cqh',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textShadow: '0px 4px 10px rgba(0,0,0,0.1)'
          }}>
            MARI BERMAIN<br />MENYUSUN PUZZEL
          </h1>

          {/* Start Button */}
          <button
            onClick={() => setIsPlaying(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              width: '18cqw',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          >
            <img src="/assets/button/start-button.png" alt="Start" style={{ width: '100%', objectFit: 'contain' }} />
          </button>
        </div>
      </>
    );
  }

  // --- GAME SCREEN ---
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Navigation Layer */}
      <nav className="top-nav" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'absolute', top: '5cqh', left: '5cqw', right: '5cqw', zIndex: 20
      }}>
        <div style={{ width: '7cqw' }}>
          <VolumeControl />
        </div>
        <a href="/menu" className="nav-btn btn-home" aria-label="Home" style={{ display: 'inline-block', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img src="/assets/button/home-button.png" alt="Home" style={{ width: '100%', objectFit: 'contain' }} />
        </a>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: '10cqh' }}>

        {/* Hint Text */}
        <h2 style={{
          color: '#1b263b',
          fontSize: '2.5cqw',
          marginBottom: '6cqh',
          textAlign: 'center',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
        }}>
          {`Level ${currentLevelIndex + 1} - Susun bentuk ${level.name.split(' (')[0]}`}
        </h2>

        <div style={{ display: 'flex', width: '100%', gap: '2cqw', alignItems: 'center', justifyContent: 'center' }}>
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
            {/* Tray Area (Left) */}
            <div className="puzzle-tray" style={{
              width: '45cqw',
              height: '60cqh',
              position: 'relative',
              border: '0.2cqw dashed #1b263b',
              borderRadius: '1cqw',
              backgroundColor: 'rgba(255,255,255,0.4)',
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'flex-start',
              justifyContent: 'center',
              gap: '2cqw',
              padding: '2cqw',
              overflowY: 'auto'
            }}>
              {trayPieces.map(p => (
                <div key={p.id} style={{ position: 'relative', width: p.trueWidth, height: p.trueHeight }}>
                  <PuzzlePiece
                    id={p.id}
                    path={p.path}
                    color={color}
                    width={pieceW}
                    height={pieceH}
                    col={p.col}
                    row={p.row}
                    shapePath={scaledShapePath}
                    vLeft={p.vLeft}
                    vTop={p.vTop}
                    trueWidth={p.trueWidth}
                    trueHeight={p.trueHeight}
                    isPlaced={false}
                  />
                </div>
              ))}
            </div>

            {/* Board Area (Right) */}
            <div style={{
              position: 'relative',
              width: boardWidth,
              height: boardHeight,
            }}>
              {/* Silhouette Vector */}
              <svg width={boardWidth} height={boardHeight} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                <path d={scaledShapePath} fill="rgba(255, 255, 255, 0.5)" stroke="#1b263b" strokeWidth="4" />
              </svg>

              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  if (layout[r][c] !== 'X') return null;

                  const slotId = `slot-${c}-${r}`;
                  const placedPiece = piecesWithVisuals.find(p => p.col === c && p.row === r && p.isPlaced);
                  const targetPiece = piecesWithVisuals.find(p => p.col === c && p.row === r);

                  return (
                    <div key={`wrap-${slotId}`} style={{
                      position: 'absolute',
                      left: c * pieceW,
                      top: r * pieceH,
                      width: pieceW,
                      height: pieceH,
                      boxSizing: 'border-box'
                    }}>
                      <DropSlot id={slotId} width={pieceW} height={pieceH} col={0} row={0} targetPiece={targetPiece} shapePath={scaledShapePath}>
                        {placedPiece && (
                          <PuzzlePiece
                            id={placedPiece.id}
                            path={placedPiece.path}
                            color={color}
                            width={pieceW}
                            height={pieceH}
                            disabled={true}
                            col={c}
                            row={r}
                            shapePath={scaledShapePath}
                            vLeft={placedPiece.vLeft}
                            vTop={placedPiece.vTop}
                            trueWidth={placedPiece.trueWidth}
                            trueHeight={placedPiece.trueHeight}
                            isPlaced={true}
                          />
                        )}
                      </DropSlot>
                    </div>
                  );
                })
              )}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeId ? (
                (() => {
                  const activePiece = piecesWithVisuals.find(p => p.id === activeId);
                  if (!activePiece) return null;
                  return (
                    <div style={{ width: activePiece.trueWidth, height: activePiece.trueHeight, scale: '1.05', cursor: 'grabbing' }}>
                      <PuzzlePiece
                        id={activePiece.id}
                        path={activePiece.path}
                        color={color}
                        width={pieceW}
                        height={pieceH}
                        col={activePiece.col}
                        row={activePiece.row}
                        shapePath={scaledShapePath}
                        disabled={true}
                        vLeft={activePiece.vLeft}
                        vTop={activePiece.vTop}
                        trueWidth={activePiece.trueWidth}
                        trueHeight={activePiece.trueHeight}
                        isPlaced={false}
                      />
                    </div>
                  );
                })()
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Custom scrollbar styles */}
        <style>{`
          .puzzle-tray::-webkit-scrollbar {
            width: 0.8cqw;
          }
          .puzzle-tray::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 1cqw;
          }
          .puzzle-tray::-webkit-scrollbar-thumb {
            background-color: #fbc962;
            border-radius: 1cqw;
            border: 0.2cqw solid #1b263b;
          }
          .puzzle-tray::-webkit-scrollbar-thumb:hover {
            background-color: #f4a261;
          }
        `}</style>

        {/* Win Dialog */}
        {isWon && (
          <WinDialog
            onNext={nextLevel}
            isLastLevel={currentLevelIndex >= PUZZLE_LEVELS.length - 1}
          />
        )}
      </div>
    </div>
  );
}
