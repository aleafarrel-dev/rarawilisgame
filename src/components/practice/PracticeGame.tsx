import React, { useState, useEffect } from 'react';
import { navigate } from 'astro:transitions/client';
import { playAudio } from '../../stores/audioStore';
import { VolumeControl } from '../puzzle/VolumeControl';
import { PRACTICE_QUESTIONS } from '../../data/practiceQuestions';
import type { PracticeQuestion } from '../../data/practiceQuestions';
import confetti from 'canvas-confetti';

export default function PracticeGame() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<{ id: string; status: 'correct' | 'incorrect' }[]>([]);
  const [biodata, setBiodata] = useState({ nama: '', kelas: '', sekolah: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBiodata({
        nama: sessionStorage.getItem('biodata_nama') || 'Siswa',
        kelas: sessionStorage.getItem('biodata_kelas') || '-',
        sekolah: sessionStorage.getItem('biodata_sekolah') || '-'
      });
    }
  }, []);

  const currentQuestion: PracticeQuestion = PRACTICE_QUESTIONS[currentIndex];

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === currentQuestion.correctAnswerIndex) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      setResults(prev => [...prev, { id: currentQuestion.id, status: 'correct' }]);
      playAudio('/assets/audio/hooray.mp3'); // or correct sound
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setFeedback('incorrect');
      setResults(prev => [...prev, { id: currentQuestion.id, status: 'incorrect' }]);
      playAudio('/assets/audio/try-again.mp3'); // or wrong sound
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentIndex < PRACTICE_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Fredoka One", "Nunito", sans-serif'
  };

  const gridBackgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#fff',
    backgroundImage: `
      linear-gradient(lightblue 1px, transparent 1px),
      linear-gradient(90deg, lightblue 1px, transparent 1px)
    `,
    backgroundSize: '30px 30px',
    zIndex: 1
  };

  if (!hasStarted) {
    return (
      <>
        <div style={gridBackgroundStyle} />
        <div style={containerStyle}>
          {/* Controls */}
          <div style={{ position: 'absolute', top: '5cqh', left: '5cqw', width: '7cqw', zIndex: 30 }}>
            <VolumeControl />
          </div>
          <a href="/menu" style={{ position: 'absolute', top: '5cqh', right: '5cqw', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/assets/button/home-button.png" alt="Home" style={{ width: '100%', objectFit: 'contain' }} />
          </a>

          <h1 style={{ 
            fontSize: '6cqw', 
            color: '#ff4d4d', 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: '5cqh', 
            textShadow: '0.4cqw 0.4cqw 0 #fff, -0.4cqw -0.4cqw 0 #fff, 0.4cqw -0.4cqw 0 #fff, -0.4cqw 0.4cqw 0 #fff',
            letterSpacing: '0.2cqw'
          }}>
            MARI MENGERJAKAN SOAL
          </h1>
          
          <button 
            onClick={handleStart}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              width: '15cqw',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} 
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src="/assets/button/start-button.png" alt="Start" style={{ width: '100%', objectFit: 'contain' }} />
          </button>

          {/* Navigation bottom arrows for Start Screen */}
          <a href="/menu" style={{ position: 'absolute', bottom: '5cqh', left: '5cqw', display: 'inline-block', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/assets/button/prev-button.png" alt="Prev" style={{ width: '100%', objectFit: 'contain' }} />
          </a>
        </div>
      </>
    );
  }

  if (isFinished) {
    return (
      <>
        <div style={gridBackgroundStyle} />
        <div style={containerStyle}>
          {/* Top Controls */}
          <div style={{ position: 'absolute', top: '5cqh', left: '5cqw', width: '7cqw', zIndex: 30 }}>
            <VolumeControl />
          </div>
          <a href="/menu" style={{ position: 'absolute', top: '5cqh', right: '5cqw', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
            <img src="/assets/button/home-button.png" alt="Home" style={{ width: '100%', objectFit: 'contain' }} />
          </a>

          {/* Summary Board */}
          <div style={{
            backgroundColor: '#fef0ba',
            border: '0.3cqw solid #1b263b',
            boxShadow: '1.5cqw 1.5cqw 0 #e6d3a5',
            padding: '4cqh 5cqw',
            width: '60cqw',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ position: 'absolute', top: '2cqh', left: '2cqw', width: '2.5cqw', height: '2.5cqw', backgroundColor: '#00a896', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '2cqh', right: '2cqw', width: '2.5cqw', height: '2.5cqw', backgroundColor: '#00a896', borderRadius: '50%' }} />
            
            <h1 style={{ fontSize: '4cqw', color: '#ff4d4d', fontWeight: 'bold', margin: '0 0 2cqh 0', textShadow: '2px 2px 0px #fff' }}>
              RANGKUMAN LATIHAN
            </h1>

            {/* Biodata Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5cqh', width: '100%', backgroundColor: '#fff', padding: '1cqh 3cqw', borderRadius: '1cqw', border: '0.2cqw solid #1b263b', marginBottom: '1.5cqh' }}>
              <div style={{ display: 'flex', fontSize: '2cqw', fontWeight: 'bold', color: '#1b263b' }}>
                <span style={{ width: '10cqw' }}>Nama</span><span>: {biodata.nama}</span>
              </div>
              <div style={{ display: 'flex', fontSize: '2cqw', fontWeight: 'bold', color: '#1b263b' }}>
                <span style={{ width: '10cqw' }}>Kelas</span><span>: {biodata.kelas}</span>
              </div>
              <div style={{ display: 'flex', fontSize: '2cqw', fontWeight: 'bold', color: '#1b263b' }}>
                <span style={{ width: '10cqw' }}>Sekolah</span><span>: {biodata.sekolah}</span>
              </div>
            </div>

            {/* Score & Answers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '3cqh' }}>
              <div style={{ width: '48%', backgroundColor: '#fff', padding: '2cqh 2cqw', borderRadius: '1cqw', border: '0.2cqw solid #1b263b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2cqw', fontWeight: 'bold', color: '#1b263b', marginBottom: '1cqh' }}>Total Koin</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1cqw' }}>
                  <img src="/assets/icon/coin.png" style={{ width: '4cqw' }} />
                  <span style={{ fontSize: '4cqw', fontWeight: 'bold', color: '#fca311' }}>{score}</span>
                </div>
              </div>
              
              <div style={{ width: '48%', backgroundColor: '#fff', padding: '2cqh 2cqw', borderRadius: '1cqw', border: '0.2cqw solid #1b263b', display: 'flex', flexDirection: 'column', gap: '1cqh' }}>
                <span style={{ fontSize: '2cqw', fontWeight: 'bold', color: '#1b263b', textAlign: 'center' }}>Hasil Jawaban</span>
                <style>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 0.8cqw;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 1cqw;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #fbc962;
                    border-radius: 1cqw;
                    border: 0.2cqw solid #1b263b;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #f4a261;
                  }
                `}</style>
                <div className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '0.5cqh', maxHeight: '18cqh', overflowY: 'auto', paddingRight: '1cqw' }}>
                  {results.map((r, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8cqw', fontWeight: 'bold', color: r.status === 'correct' ? '#4caf50' : '#ff4d4d' }}>
                      <span>Soal {idx + 1}</span>
                      <span>{r.status === 'correct' ? 'Benar (+10)' : 'Salah (0)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/puzzle')}
              style={{
                padding: '1.5cqh 4cqw',
                fontSize: '2.5cqw',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#4caf50',
                border: '0.3cqw solid #1b263b',
                borderRadius: '1.5cqw',
                cursor: 'pointer',
                boxShadow: '0 0.5cqw 0 #1b263b',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0.5cqw)';
                e.currentTarget.style.boxShadow = '0 0 0 #1b263b';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0.5cqw 0 #1b263b';
              }}
            >
              Lanjut ke Puzzle
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={gridBackgroundStyle} />
      <div style={containerStyle}>
        {/* Top Controls */}
        <div style={{ position: 'absolute', top: '5cqh', left: '5cqw', width: '7cqw', zIndex: 30 }}>
          <VolumeControl />
        </div>
        <a href="/menu" style={{ position: 'absolute', top: '5cqh', right: '5cqw', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img src="/assets/button/home-button.png" alt="Home" style={{ width: '100%', objectFit: 'contain' }} />
        </a>

        {/* Question Area */}
        <h2 style={{ 
          fontSize: '4cqw', 
          color: '#ff4d4d', 
          fontWeight: 'bold', 
          margin: '2cqh 0', 
          textShadow: '0.2cqw 0.2cqw 0 #fff, -0.2cqw -0.2cqw 0 #fff, 0.2cqw -0.2cqw 0 #fff, -0.2cqw 0.2cqw 0 #fff',
          letterSpacing: '0.1cqw'
        }}>
          Soal {currentIndex + 1}
        </h2>

        <div style={{
          backgroundColor: '#f6bd60',
          border: '0.3cqw solid #000',
          padding: '2cqh 3cqw',
          width: '60cqw',
          minHeight: '15cqh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '2cqw',
          fontWeight: '500',
          marginBottom: '3cqh'
        }}>
          {currentQuestion.question}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5cqh', width: '50cqw' }}>
          {currentQuestion.options.map((opt, idx) => {
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                style={{
                  backgroundColor: '#9b7ede', // Default color purple
                  border: 'none',
                  padding: '1.5cqh 2cqw',
                  fontSize: '1.8cqw',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#fff', // Default text white
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.1s, background-color 0.2s, color 0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.backgroundColor = '#fde293'; // Hover color yellow
                  e.currentTarget.style.color = '#000'; // Hover text black
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#9b7ede';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation bottom arrows */}
        <button 
          onClick={() => { 
            if (currentIndex === 0) {
              setHasStarted(false);
            } else {
              setCurrentIndex(c => c - 1); 
            }
          }} 
          style={{ position: 'absolute', bottom: '5cqh', left: '5cqw', background: 'none', border: 'none', cursor: 'pointer', width: '7cqw', transition: 'transform 0.2s' }} 
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} 
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="/assets/button/prev-button.png" alt="Prev" style={{ width: '100%', objectFit: 'contain' }} />
        </button>
        
        <button onClick={handleNext} style={{ position: 'absolute', bottom: '5cqh', right: '5cqw', background: 'none', border: 'none', cursor: 'pointer', width: '7cqw', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img src="/assets/button/next-button.png" alt="Next" style={{ width: '100%', objectFit: 'contain' }} />
        </button>

        {/* Feedback Modal Overlay */}
        {feedback && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '60cqw'
            }}>
              {/* Umpan Balik Sign Banner */}
              <div style={{
                backgroundColor: '#fdf1d6', // beige
                border: '0.4cqw solid #8b5a2b',
                borderRadius: '1cqw',
                padding: '1cqh 3cqw',
                zIndex: 4,
                position: 'relative',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
              }}>
                <h3 style={{ fontSize: '3cqw', color: '#ff4d4d', fontWeight: 'bold', margin: 0 }}>UMPAN BALIK</h3>
              </div>

              {/* Emoji hanging */}
              <img 
                src={feedback === 'correct' ? "/assets/icon/emoji-bravo.png" : "/assets/icon/emoji-sorry.png"} 
                style={{ 
                  width: '12cqw', 
                  zIndex: 3,
                  position: 'relative',
                  marginTop: '-1cqh' // Slightly overlaps the sign
                }} 
              />

              {/* Cloud Background Container */}
              <div style={{
                backgroundImage: 'url(/assets/images/decoration-cloud.png)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '45cqw',
                height: '28cqw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '6cqw', // Space for emoji
                marginTop: '-10cqh', // Pull cloud up to overlap behind emoji
                zIndex: 2,
                position: 'relative'
              }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '1cqw', marginBottom: '2cqh' }}>
                  {feedback === 'correct' ? (
                    <>
                      <img src="/assets/icon/star.png" style={{ width: '5cqw' }} />
                      <img src="/assets/icon/star.png" style={{ width: '6cqw', transform: 'translateY(-1cqh)' }} />
                      <img src="/assets/icon/star.png" style={{ width: '5cqw' }} />
                    </>
                  ) : (
                    <img src="/assets/icon/star.png" style={{ width: '6cqw' }} />
                  )}
                </div>
                
                {/* Text Message */}
                <p style={{ fontSize: '2cqw', color: '#ff4d4d', fontWeight: 'bold', margin: '0 0 2cqh 0' }}>
                  {feedback === 'correct' ? 'Jawabanmu Benar!' : 'Jawabanmu Kurang Tepat!'}
                </p>

                {/* Coin Container */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1cqw' }}>
                  <img src="/assets/icon/coin.png" style={{ width: '3cqw' }} />
                  <span style={{ fontSize: '2.5cqw', fontWeight: 'bold', color: '#000' }}>
                    {feedback === 'correct' ? '+10' : '0'}
                  </span>
                </div>
              </div>

              {/* Next Button matching PuzzleGame style */}
              <button
                onClick={handleNext}
                style={{
                  marginTop: '1cqh',
                  padding: '1cqw 3cqw',
                  fontSize: '2cqw',
                  fontWeight: 'bold',
                  color: '#fff',
                  backgroundColor: '#4caf50',
                  border: '0.2cqw solid #1b263b',
                  borderRadius: '1cqw',
                  cursor: 'pointer',
                  boxShadow: '0 4px 0 #1b263b',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                  zIndex: 5,
                  position: 'relative'
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
                Lanjut
              </button>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
