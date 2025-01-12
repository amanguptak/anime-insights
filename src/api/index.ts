import { rateLimit } from './rateLimit';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
let lastRequestTime = 0;

// Helper function to handle rate limiting
export const handleRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => 
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
};

// Helper function to handle API requests with retries
export const fetchWithRetry = async (url: string, retries: number = 3): Promise<Response> => {
  await handleRateLimit();
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '1000');
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        continue;
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  
  throw new Error('Failed after multiple retries');
};

// Anime API functions
export const fetchAnimeSearch = async (query: string): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime?q=${query}&sfw=true`);
    if (!response.ok) {
      console.info('Search results not available');
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info('Unable to fetch search results');
    return [];
  }
};

export const fetchTopAnime = async (page: number = 1): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    if (!response.ok) {
      console.info('Top anime not available');
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info('Unable to fetch top anime');
    return [];
  }
};

export const fetchUpcomingAnime = async (page: number = 1): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/seasons/upcoming?page=${page}`);
    if (!response.ok) {
      console.info('Upcoming anime not available');
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info('Unable to fetch upcoming anime');
    return [];
  }
};

export const fetchAnimeById = async (id: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/full`);
    if (!response.ok) {
      console.info(`Anime details not available for ID ${id}`);
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch anime details for ID ${id}`);
    return null;
  }
};

export const fetchAnimeStatistics = async (id: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/statistics`);
    if (!response.ok) {
      console.info(`Statistics not available for anime ${id}`);
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch statistics for anime ${id}`);
    return null;
  }
};

export const fetchAnimeEpisodes = async (id: number, page: number = 1): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`);
    if (!response.ok) {
      console.info(`Episodes not available for anime ${id}`);
      return { data: [], pagination: { last_visible_page: 1 } };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.info(`Unable to fetch episodes for anime ${id}`);
    return { data: [], pagination: { last_visible_page: 1 } };
  }
};

export const fetchAnimeMoreInfo = async (id: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/moreinfo`);
    if (!response.ok) {
      console.info(`More info not available for anime ${id}`);
      return { moreinfo: '' };
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch more info for anime ${id}`);
    return { moreinfo: '' };
  }
};

export const fetchAnimeRecommendations = async (id: number): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
    if (!response.ok) {
      console.info(`Recommendations not available for anime ${id}`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch recommendations for anime ${id}`);
    return [];
  }
};

export const fetchAnimeCharacters = async (animeId: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
    if (!response.ok) {
      console.info(`Characters not available for anime ${animeId}`);
      return { characters: [], eTag: null };
    }
    const data = await response.json();
    return { characters: data.data, eTag: response.headers.get('ETag') };
  } catch (error) {
    console.info(`Unable to fetch characters for anime ${animeId}`);
    return { characters: [], eTag: null };
  }
};

export const fetchSchedules = async (
  filter: string = "monday",
  kids: string = "false",
  sfw: string = "true",
  page: number = 1,
  limit: number = 25
): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(
      `https://api.jikan.moe/v4/schedules?filter=${filter}&kids=${kids}&sfw=${sfw}&page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      console.info('Schedule not available');
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info('Unable to fetch schedule');
    return [];
  }
};

export const fetchSeasonalAnime = async (
  year: number = new Date().getFullYear(),
  season: string = getCurrentSeason()
): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/seasons/${year}/${season}`);
    if (!response.ok) {
      console.info(`Seasonal anime not available for ${season} ${year}`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch seasonal anime for ${season} ${year}`);
    return [];
  }
};

export const fetchAnimeGenres = async (): Promise<any[]> => {
  try {
    const response = await fetchWithRetry('https://api.jikan.moe/v4/genres/anime');
    if (!response.ok) {
      console.info('Genres not available');
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info('Unable to fetch anime genres');
    return [];
  }
};

export const fetchRandomAnime = async (): Promise<any> => {
  try {
    const response = await fetchWithRetry('https://api.jikan.moe/v4/random/anime?sfw=true');
    if (!response.ok) {
      console.info('Random anime not available');
      return null;
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info('Unable to fetch random anime');
    return null;
  }
};

export const fetchAnimeByGenre = async (genreId: number): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=score&sort=desc&limit=12`);
    if (!response.ok) {
      console.info(`Anime by genre ${genreId} not available`);
      return [];
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.info(`Unable to fetch anime by genre ${genreId}`);
    return [];
  }
};

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
}