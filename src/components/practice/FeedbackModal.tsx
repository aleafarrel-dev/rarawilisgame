
interface FeedbackModalProps {
  feedback: 'correct' | 'incorrect';
  score: number;
  onNext: () => void;
}

export function FeedbackModal({ feedback, score, onNext }: FeedbackModalProps) {
  const isCorrect = feedback === 'correct';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      position: 'relative'
    }}>
      {/* Board and Character Container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: 'translateY(-5cqh)' // Move up slightly so it fits well on screen
      }}>
        
        {/* Umpan Balik Sign Banner */}
        <div style={{
          backgroundColor: '#fdf1d6', // beige
          border: '0.3cqw solid #8b5a2b',
          borderRadius: '1cqw',
          padding: '1cqh 3cqw',
          zIndex: 4,
          position: 'relative',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        }}>
          {/* Strings from top of screen to the board */}
          <div style={{ position: 'absolute', top: '1.3cqh', left: '15%', width: '0.3cqw', height: '100cqh', backgroundColor: '#8b5a2b', zIndex: -1, transform: 'translate(-50%, -100%)' }}></div>
          <div style={{ position: 'absolute', top: '1.3cqh', right: '15%', width: '0.3cqw', height: '100cqh', backgroundColor: '#8b5a2b', zIndex: -1, transform: 'translate(50%, -100%)' }}></div>

          {/* Nails for strings */}
          <div style={{ position: 'absolute', top: '1cqh', left: '15%', width: '0.6cqw', height: '0.6cqw', backgroundColor: '#a23333', borderRadius: '50%', transform: 'translateX(-50%)', zIndex: 2 }}></div>
          <div style={{ position: 'absolute', top: '1cqh', right: '15%', width: '0.6cqw', height: '0.6cqw', backgroundColor: '#a23333', borderRadius: '50%', transform: 'translateX(50%)', zIndex: 2 }}></div>

          <h3 style={{ fontSize: '3cqw', color: '#ff4d4d', fontWeight: '900', margin: 0, letterSpacing: '0.1cqw' }}>UMPAN BALIK</h3>
        </div>

        {/* Emoji hanging */}
        <img 
          src={isCorrect ? "/assets/icon/emoji-bravo.png" : "/assets/icon/emoji-sorry.png"} 
          style={{ 
            width: '12cqw', 
            zIndex: 3,
            position: 'relative',
            marginTop: '-1cqh' // Overlaps the sign
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
          marginTop: '-10cqh', // Pull cloud up to overlap behind emoji properly
          zIndex: 2,
          position: 'relative'
        }}>

          {/* Stars */}
          <div style={{ display: 'flex', gap: '1.5cqw', marginBottom: '1cqh' }}>
            {isCorrect && (
              <img src="/assets/icon/star.png" style={{ width: '4.5cqw' }} />
            )}
            <img src="/assets/icon/star.png" style={{ width: '5.5cqw', transform: isCorrect ? 'translateY(-1cqh)' : 'translateY(0)' }} />
            {isCorrect && (
              <img src="/assets/icon/star.png" style={{ width: '4.5cqw' }} />
            )}
          </div>
          
          {/* Text Message */}
          <p style={{ fontSize: '2cqw', color: '#ff4d4d', fontWeight: 'bold', margin: '0 0 1.5cqh 0' }}>
            {isCorrect ? 'Jawabanmu Benar!' : 'Jawabanmu Kurang Tepat!'}
          </p>

          {/* Coin Container */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1cqw' }}>
            <img src="/assets/icon/coin.png" style={{ width: '2.5cqw' }} />
            <span style={{ fontSize: '2.5cqw', fontWeight: 'bold', color: '#000' }}>
              {isCorrect ? '+10' : '0'}
            </span>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          style={{
            marginTop: '2cqh',
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
