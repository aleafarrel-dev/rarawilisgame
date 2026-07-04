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

export interface PieceData {
  id: string;
  col: number;
  row: number;
  path: string;
  isPlaced: boolean;
  vLeft: number;
  vTop: number;
  trueWidth: number;
  trueHeight: number;
}


export default function PuzzleGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const level = PUZZLE_LEVELS[currentLevelIndex];

  const layout = level.layout;
  const cols = layout[0].length;
  const rows = layout.length;
  const color = level.color;

  // Size for desktop/tablet landscape
  const pieceW = 80;
  const pieceH = 80;

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

        const path = generateJigsawPath(pieceW, pieceH, top, right, bottom, left);

        const vTop = top === 2 ? -pieceH : (top === 1 ? -pieceH * 0.25 : 0);
        const vRight = right === 2 ? pieceW * 2 : (right === 1 ? pieceW * 1.25 : pieceW);
        const vBottom = bottom === 2 ? pieceH * 2 : (bottom === 1 ? pieceH * 1.25 : pieceH);
        const vLeft = left === 2 ? -pieceW : (left === 1 ? -pieceW * 0.25 : 0);

        const trueWidth = vRight - vLeft;
        const trueHeight = vBottom - vTop;

        newPieces.push({
          id: `piece-${level.id}-${c}-${r}`, col: c, row: r, path, isPlaced: false,
          vLeft, vTop, trueWidth, trueHeight
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

  const trayPieces = pieces.filter(p => !p.isPlaced);
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

        <div style={{ display: 'flex', width: '100%', gap: '6cqw', alignItems: 'center', justifyContent: 'center' }}>
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
            {/* Tray Area (Left) */}
            <div className="puzzle-tray" style={{
              width: '40cqw',
              height: '60cqh',
              position: 'relative',
              border: '0.2cqw dashed #1b263b',
              borderRadius: '1cqw',
              backgroundColor: 'rgba(255,255,255,0.4)',
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'flex-start',
              justifyContent: 'center',
              gap: '40px',
              padding: '40px',
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
                    shapePath={level.shapePath}
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
                <path d={level.shapePath} fill="rgba(255, 255, 255, 0.5)" stroke="#1b263b" strokeWidth="4" />
              </svg>

              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  if (layout[r][c] !== 'X') return null;

                  const slotId = `slot-${c}-${r}`;
                  const placedPiece = pieces.find(p => p.col === c && p.row === r && p.isPlaced);
                  const targetPiece = pieces.find(p => p.col === c && p.row === r);

                  return (
                    <div key={`wrap-${slotId}`} style={{
                      position: 'absolute',
                      left: c * pieceW,
                      top: r * pieceH,
                      width: pieceW,
                      height: pieceH,
                      boxSizing: 'border-box'
                    }}>
                      <DropSlot id={slotId} width={pieceW} height={pieceH} col={0} row={0} targetPiece={targetPiece} shapePath={level.shapePath}>
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
                            shapePath={level.shapePath}
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
                  const activePiece = pieces.find(p => p.id === activeId);
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
                        shapePath={level.shapePath}
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
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '3cqw 5cqw',
            border: '0.3cqw solid #1b263b',
            borderRadius: '2cqw',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 100,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2cqw'
          }}>
            <div>
              <h2 style={{ color: '#4caf50', fontSize: '3cqw', margin: '0 0 1cqw 0' }}>Bagus Sekali!</h2>
              <p style={{ fontSize: '1.5cqw', margin: 0, color: '#1b263b' }}>Kamu berhasil menyusun bangun datar.</p>
            </div>

            <button
              onClick={nextLevel}
              style={{
                padding: '1cqw 3cqw',
                fontSize: '1.5cqw',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#4caf50',
                border: '0.2cqw solid #1b263b',
                borderRadius: '1cqw',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #1b263b',
                transition: 'transform 0.1s, box-shadow 0.1s'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(4px)';
                e.currentTarget.style.boxShadow = '0 0px 0 #1b263b';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #1b263b';
              }}
            >
              {currentLevelIndex < PUZZLE_LEVELS.length - 1 ? 'Lanjut ke Puzzle Berikutnya' : 'Selesai'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
