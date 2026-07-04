import { atom } from 'nanostores';

const KEY_VOLUME  = 'bgm_volume';
const KEY_MUTED   = 'bgm_muted';

function getStored(key: string, fallback: string): string {
  if (typeof localStorage === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
}

export const volumeStore   = atom<number>(parseFloat(getStored(KEY_VOLUME, '0.5')));
export const bgmMutedStore = atom<boolean>(getStored(KEY_MUTED, 'false') === 'true');

volumeStore.subscribe(v => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY_VOLUME, String(v));
});

bgmMutedStore.subscribe(m => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY_MUTED, String(m));
});

/** Play a one-shot sound effect. Respects current volume level. */
export function playAudio(src: string): void {
  const sfx = new Audio(src);
  sfx.volume = volumeStore.get();
  sfx.play().catch(() => {/* SFX blocked by autoplay policy */});
}
