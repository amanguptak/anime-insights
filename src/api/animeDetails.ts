import { fetchWithRetry } from './index';

export const fetchAnimeVideos = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/videos`);
    if (!response.ok) {
      console.info(`Videos not available for anime ${id}`);
      return { promo: [], episodes: [] };
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch videos for anime ${id}`);
    return { promo: [], episodes: [] };
  }
};

export const fetchAnimeRelations = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/relations`);
    if (!response.ok) {
      console.info(`Relations not available for anime ${id}`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch relations for anime ${id}`);
    return [];
  }
};

export const fetchAnimeNews = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/news`);
    if (!response.ok) {
      console.info(`News not available for anime ${id}`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch news for anime ${id}`);
    return [];
  }
};

export const fetchAnimeForum = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/forum`);
    if (!response.ok) {
      console.info(`Forum discussions not available for anime ${id}`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch forum discussions for anime ${id}`);
    return [];
  }
};

export const fetchAnimePictures = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/pictures`);
    if (!response.ok) {
      console.info(`Pictures not available for anime ${id}`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch pictures for anime ${id}`);
    return [];
  }
};

export const fetchAnimeThemes = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/themes`);
    if (!response.ok) {
      console.info(`Themes not available for anime ${id}`);
      return { openings: [], endings: [] };
    }
    const data = await response.json();
    return data.data || { openings: [], endings: [] };
  } catch (error) {
    console.info(`Unable to fetch themes for anime ${id}`);
    return { openings: [], endings: [] };
  }
};

export const fetchAnimeExternal = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/external`);
    if (!response.ok) {
      console.info(`External links not available for anime ${id}`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch external links for anime ${id}`);
    return [];
  }
};