import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const themeAtom = atom({
  key: 'theme',
  default: 'dark',
  effects_UNSTABLE: [persistAtom],
});

export const searchQueryAtom = atom({
  key: 'searchQuery',
  default: '',
});

export const searchResultsAtom = atom({
  key: 'searchResults',
  default: [] as any[],
});

export const topAnimeAtom = atom({
  key: 'topAnime',
  default: [] as any[],
  effects_UNSTABLE: [persistAtom],
});