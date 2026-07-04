interface WinDialogProps {
  onNext: () => void;
  isLastLevel: boolean;
}

export function WinDialog({ onNext, isLastLevel }: WinDialogProps) {
  return (
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
        onClick={onNext}
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
        {isLastLevel ? 'Selesai' : 'Lanjut ke Puzzle Berikutnya'}
      </button>
    </div>
  );
}
