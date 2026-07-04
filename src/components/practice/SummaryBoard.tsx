interface SummaryBoardProps {
  biodata: { nama: string; kelas: string; sekolah: string };
  score: number;
  results: { id: string; status: 'correct' | 'incorrect' }[];
  onNavigatePuzzle: () => void;
}

export function SummaryBoard({ biodata, score, results, onNavigatePuzzle }: SummaryBoardProps) {
  return (
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
            <img src="/assets/icon/coin.png" style={{ width: '4cqw' }} alt="Coin" />
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
        onClick={onNavigatePuzzle}
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
  );
}
