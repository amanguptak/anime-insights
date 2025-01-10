// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
let lastRequestTime = 0;

// Helper function to handle rate limiting
const rateLimit = async () => {
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
const fetchWithRetry = async (url: string, retries: number = 3): Promise<Response> => {
  await rateLimit();
  
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
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch search results');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

export const fetchTopAnime = async (page: number = 1): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch top anime');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching top anime:', error);
    return [];
  }
};

export const fetchUpcomingAnime = async (page: number = 1): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/seasons/upcoming?page=${page}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch upcoming anime');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching upcoming anime:', error);
    return [];
  }
};

export const fetchAnimeById = async (id: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/full`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch anime details');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
};

export const fetchAnimeStatistics = async (id: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/statistics`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch statistics');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
};

export const fetchAnimeEpisodes = async (id: number, page: number = 1): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch episodes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return { data: [], pagination: { last_visible_page: 1 } };
  }
};

export const fetchAnimeMoreInfo = async (id: number) => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/moreinfo`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch more info');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching more info:', error);
    return null;
  }
};

export const fetchAnimeRecommendations = async (id: number): Promise<any[]> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch recommendations');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

export const fetchAnimeCharacters = async (animeId: number): Promise<any> => {
  try {
    const response = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch characters');
    }
    const data = await response.json();
    return { characters: data.data, eTag: response.headers.get('ETag') };
  } catch (error) {
    console.error('Error fetching characters:', error);
    return { characters: [], eTag: null };
  }
};

export const fetchSchedules = async (
  filter: string = "monday",
  kids: string = "false",
  sfw: string = "true",
  page: number = 1,
  limit: number = 25
) => {
  try {
    const response = await fetchWithRetry(
      `https://api.jikan.moe/v4/schedules?filter=${filter}&kids=${kids}&sfw=${sfw}&page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch schedules');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
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
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch seasonal anime');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
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