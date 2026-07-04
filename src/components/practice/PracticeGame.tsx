import React, { useState, useEffect } from 'react';
import { navigate } from 'astro:transitions/client';
import { playAudio } from '../../stores/audioStore';
import { VolumeControl } from '../puzzle/VolumeControl';
import { PRACTICE_QUESTIONS } from '../../data/practiceQuestions';
import type { PracticeQuestion } from '../../data/practiceQuestions';
import confetti from 'canvas-confetti';
import { FeedbackModal } from './FeedbackModal';
import { SummaryBoard } from './SummaryBoard';

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
          <SummaryBoard
            biodata={biodata}
            score={score}
            results={results}
            onNavigatePuzzle={() => navigate('/puzzle')}
          />
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

        {/* Feedback Modal Overlay */}
        {feedback && (
          <FeedbackModal
            feedback={feedback}
            score={score}
            onNext={handleNext}
          />
        )}
      </div>
    </>
  );
}
