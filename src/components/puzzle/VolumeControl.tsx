import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { volumeStore } from '../../stores/audioStore';

export function VolumeControl() {
  const volume = useStore(volumeStore);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    volumeStore.set(parseFloat(e.target.value));
  };

  return (
    <div 
      ref={containerRef}
      style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
    >
      <button 
        onClick={toggleOpen}
        className="nav-btn btn-sound" 
        aria-label="Toggle Sound" 
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%', height: '100%', transition: 'transform 0.2s' }} 
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} 
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img src="/assets/button/volume-button.png" alt="Sound" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          left: '110%', // Positioned to the right of the button
          backgroundColor: '#fff',
          padding: '0 1.5vw',
          borderRadius: '2vw',
          border: '0.2vw solid #1b263b',
          display: 'flex',
          alignItems: 'center',
          animation: 'fadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 100,
          height: '4vw'
        }}>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleSliderChange}
            className="styled-slider"
            style={{ 
              width: '15vw',
              background: `linear-gradient(to right, #007bff 0%, #007bff ${volume * 100}%, #e0e0e0 ${volume * 100}%, #e0e0e0 100%)`
            }}
          />
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9) translateX(-10px); }
          to { opacity: 1; transform: scale(1) translateX(0); }
        }

        .styled-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 0.8vw;
          border-radius: 1vw;
          outline: none;
          cursor: pointer;
        }

        .styled-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 2vw;
          height: 2vw;
          border-radius: 50%;
          background: #007bff;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .styled-slider::-moz-range-thumb {
          width: 2vw;
          height: 2vw;
          border-radius: 50%;
          background: #007bff;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
