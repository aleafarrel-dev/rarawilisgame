export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'soal-1',
    question: 'sebuah persegi memiliki panjang sisi 15 cm. luas persegi tersebut adalah....',
    options: [
      'A. 225 cm persegi',
      'B. 30 cm persegi',
      'C. 60 cm persegi',
      'D. 250 cm persegi'
    ],
    correctAnswerIndex: 0 // A
  },
  {
    id: 'soal-2',
    question: 'sebuah papan kayu berbentuk segitiga memiliki panjang alas 18 cm dan tinggi 10 cm. luas papan kayu tersebut adalah....',
    options: [
      'A. 180 cm persegi',
      'B. 56 cm persegi',
      'C. 90 cm persegi',
      'D. 45 cm persegi'
    ],
    correctAnswerIndex: 2 // C
  },
  {
    id: 'soal-3',
    question: 'sebuah belah ketupat memiliki panjang diagonal masing-masing 12 cm dan 16 cm. Luas belah ketupat tersebut adalah...',
    options: [
      'A. 96 cm persegi',
      'B. 48 cm persegi',
      'C. 148 cm persegi',
      'D. 56 cm persegi'
    ],
    correctAnswerIndex: 0 // A
  },
  {
    id: 'soal-4',
    question: 'sebuah trapesium memiliki panjang sisi sejajar 10 cm dan 14 cm. jika tinggi trapesium tersebut adalah 6 cm. berapakah luasnya?',
    options: [
      'A. 60 cm persegi',
      'B. 72 cm persegi',
      'C. 24 cm persegi',
      'D. 144 cm persegi'
    ],
    correctAnswerIndex: 1 // B
  }
];
