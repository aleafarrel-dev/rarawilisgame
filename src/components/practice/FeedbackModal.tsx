
interface FeedbackModalProps {
  feedback: 'correct' | 'incorrect';
  score: number;
  onNext: () => void;
}

export function FeedbackModal({ feedback, score, onNext }: FeedbackModalProps) {
  const isCorrect = feedback === 'correct';

  return (
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
          src={isCorrect ? "/assets/icon/emoji-bravo.png" : "/assets/icon/emoji-sorry.png"} 
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
            {isCorrect && (
              <img src="/assets/icon/star.png" style={{ width: '5cqw' }} />
            )}
            <img src="/assets/icon/star.png" style={{ width: '6cqw', transform: isCorrect ? 'translateY(-1cqh)' : 'translateY(0)' }} />
            {isCorrect && (
              <img src="/assets/icon/star.png" style={{ width: '5cqw' }} />
            )}
          </div>
          
          {/* Text Message */}
          <p style={{ fontSize: '2cqw', color: '#ff4d4d', fontWeight: 'bold', margin: '0 0 2cqh 0' }}>
            {isCorrect ? 'Jawabanmu Benar!' : 'Jawabanmu Kurang Tepat!'}
          </p>

          {/* Coin Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1cqw' }}>
            <img src="/assets/icon/coin.png" style={{ width: '3cqw' }} />
            <span style={{ fontSize: '2.5cqw', fontWeight: 'bold', color: '#000' }}>
              {isCorrect ? '+10' : '0'}
            </span>
          </div>
        </div>

        {/* Next Button matching PuzzleGame style */}
        <button
          onClick={onNext}
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
  );
}
