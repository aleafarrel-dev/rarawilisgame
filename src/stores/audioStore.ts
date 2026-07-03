import { atom } from 'nanostores';

export const volumeStore = atom<number>(0.5); // Default volume is 50%

export function playAudio(src: string) {
  const audio = new Audio(src);
  audio.volume = volumeStore.get();
  audio.play().catch(e => {
    console.warn('Audio play blocked or failed:', e);
  });
}
