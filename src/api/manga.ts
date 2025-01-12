import { rateLimit, fetchWithRetry } from './index';

export const fetchMangaSearch = async (query: string): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/manga?q=${query}&sfw=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch manga search results');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching manga:', error);
    return [];
  }
};

export const fetchTopManga = async (page: number = 1): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/top/manga?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch top manga');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching top manga:', error);
    return [];
  }
};

export const fetchMangaById = async (id: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/manga/${id}/full`);
    if (!response.ok) {
      throw new Error('Failed to fetch manga details');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching manga details:', error);
    return null;
  }
};

export const fetchMangaChapters = async (id: number, page: number = 1): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/manga/${id}/chapters?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return { data: [], pagination: { last_visible_page: 1 } };
  }
};

export const fetchMangaRecommendations = async (id: number): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/manga/${id}/recommendations`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};