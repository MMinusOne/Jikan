export interface JikanConfig {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export interface RateLimitInfo {
  remaining: number;
  resetAt: number;
}

export default class JikanAPI {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;
  private rateLimitInfo: RateLimitInfo | null = null;

  constructor(config: JikanConfig = {}) {
    this.baseUrl = config.baseUrl || "https://api.jikan.moe/v4";
    this.timeout = config.timeout || 10_000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  private async fetchWithRetry(endpoint: string, retryCount = 0): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      this.updateRateLimitInfo(response);

      if (response.status === 429) {
        if (retryCount < this.maxRetries) {
          const waitTime = this.calculateBackoff(retryCount);
          console.warn(
            `Rate limited. Retrying in ${waitTime}ms (attempt ${
              retryCount + 1
            }/${this.maxRetries})`,
          );
          await this.sleep(waitTime);
          return this.fetchWithRetry(endpoint, retryCount + 1);
        }
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(error);
    }
  }

  private updateRateLimitInfo(response: Response): void {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const resetAt = response.headers.get("x-ratelimit-reset");

    if (remaining && resetAt) {
      this.rateLimitInfo = {
        remaining: parseInt(remaining, 10),
        resetAt: parseInt(resetAt, 10),
      };
    }
  }

  private calculateBackoff(retryCount: number): number {
    return this.retryDelay * Math.pow(2, retryCount);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getRateLimitInfo(): RateLimitInfo | null {
    return this.rateLimitInfo;
  }

  // ==================== MANGA ENDPOINTS ====================

  async getManga(id: number): Promise<any> {
    return this.fetchWithRetry(`/manga/${id}`);
  }

  async getMangaFull(id: number): Promise<any> {
    return this.fetchWithRetry(`/manga/${id}/full`);
  }

  async getMangaCharacters(id: number): Promise<any> {
    return this.fetchWithRetry(`/manga/${id}/characters`);
  }

  async getMangaNews(id: number, page?: number): Promise<any> {
    const pageParam = page ? `?page=${page}` : "";
    return this.fetchWithRetry(`/manga/${id}/news${pageParam}`);
  }

  async getMangaPictures(id: number): Promise<any> {
    return this.fetchWithRetry(`/manga/${id}/pictures`);
  }

  async getMangaStatistics(id: number): Promise<any> {
    return this.fetchWithRetry(`/manga/${id}/statistics`);
  }

  async getMangaRecommendations(id: number): Promise<any> {
    return this.fetchWithRetry(`/manga/${id}/recommendations`);
  }

  async getMangaReviews(id: number, page?: number): Promise<any> {
    const pageParam = page ? `?page=${page}` : "";
    return this.fetchWithRetry(`/manga/${id}/reviews${pageParam}`);
  }

  async getMangaRelations(id: number): Promise<any> {
    return this.fetchWithRetry(`/manga/${id}/relations`);
  }

  async searchManga(
    params: {
      q?: string;
      page?: number;
      limit?: number;
      type?:
        | "manga"
        | "novel"
        | "lightnovel"
        | "oneshot"
        | "doujin"
        | "manhwa"
        | "manhua";
      score?: number;
      min_score?: number;
      max_score?: number;
      status?:
        | "publishing"
        | "complete"
        | "hiatus"
        | "discontinued"
        | "upcoming";
      genres?: string; // comma-separated genre IDs
      genres_exclude?: string; // comma-separated genre IDs
      order_by?:
        | "mal_id"
        | "title"
        | "start_date"
        | "end_date"
        | "chapters"
        | "volumes"
        | "score"
        | "scored_by"
        | "rank"
        | "popularity"
        | "members"
        | "favorites";
      sort?: "desc" | "asc";
      letter?: string; // first letter of title
      magazines?: string; // comma-separated magazine IDs
    } = {},
  ): Promise<any> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return this.fetchWithRetry(`/manga${queryString ? `?${queryString}` : ""}`);
  }

  async getTopManga(
    params: {
      page?: number;
      limit?: number;
      type?:
        | "manga"
        | "novel"
        | "lightnovel"
        | "oneshot"
        | "doujin"
        | "manhwa"
        | "manhua";
      filter?: "publishing" | "upcoming" | "bypopularity" | "favorite";
    } = {},
  ): Promise<any> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return this.fetchWithRetry(
      `/top/manga${queryString ? `?${queryString}` : ""}`,
    );
  }

  // ==================== CHARACTER ENDPOINTS ====================

  async getCharacter(id: number): Promise<any> {
    return this.fetchWithRetry(`/characters/${id}`);
  }

  async getCharacterFull(id: number): Promise<any> {
    return this.fetchWithRetry(`/characters/${id}/full`);
  }

  async getCharacterPictures(id: number): Promise<any> {
    return this.fetchWithRetry(`/characters/${id}/pictures`);
  }

  async getCharacterAnime(id: number): Promise<any> {
    return this.fetchWithRetry(`/characters/${id}/anime`);
  }

  async getCharacterManga(id: number): Promise<any> {
    return this.fetchWithRetry(`/characters/${id}/manga`);
  }

  async searchCharacters(
    params: {
      q?: string;
      page?: number;
      limit?: number;
      order_by?: "mal_id" | "name" | "favorites";
      sort?: "desc" | "asc";
      letter?: string;
    } = {},
  ): Promise<any> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return this.fetchWithRetry(
      `/characters${queryString ? `?${queryString}` : ""}`,
    );
  }

  async getTopCharacters(page?: number, limit?: number): Promise<any> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    return this.fetchWithRetry(
      `/top/characters${queryString ? `?${queryString}` : ""}`,
    );
  }

  async getMangaGenres(): Promise<any> {
    return this.fetchWithRetry("/genres/manga");
  }

  // ==================== RANDOM ====================

  async getRandomManga(): Promise<any> {
    return this.fetchWithRetry("/random/manga");
  }
}
