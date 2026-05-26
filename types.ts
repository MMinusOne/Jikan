export interface JikanResponse<T> {
  pagination: Pagination;
  data: T[];
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: PaginationItems;
}

export interface PaginationItems {
  count: number;
  total: number;
  per_page: number;
}

export interface CharacterData {
  mal_id: number;
  url: string;
  images: CharacterImages;
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
}

export interface CharacterImages {
  jpg: JpgImage;
  webp: WebpImage;
}

export interface JpgImage {
  image_url: string;
}

export interface WebpImage {
  image_url: string;
  small_image_url?: string; // Optional since it may not exist for all formats
}

export interface MangaData {
  mal_id: number;
  url: string;
  images: ImageFormats;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string | null;
  title_japanese: string;
  title_synonyms: string[];
  type: string; // e.g., "Manga", "Light Novel"
  chapters: number | null;
  volumes: number | null;
  status: string; // e.g., "Publishing", "Finished"
  publishing: boolean;
  published: PublishDate;
  score: number;
  scored: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  authors: ResourceReference[];
  serializations: ResourceReference[];
  genres: ResourceReference[];
  explicit_genres: ResourceReference[];
  themes: ResourceReference[];
  demographics: ResourceReference[];
}

export interface ImageFormats {
  jpg: ImageUrls;
  webp: ImageUrls;
}

export interface ImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Title {
  type: string; // e.g., "Default", "Synonym", "Japanese", "English"
  title: string;
}

export interface PublishDate {
  from: string; // ISO Date String
  to: string | null;
  prop: PublishProp;
  string: string;
}

export interface PublishProp {
  from: DateComponents;
  to: DateComponents;
}

export interface DateComponents {
  day: number | null;
  month: number | null;
  year: number | null;
}

// Reusable interface for fields like Authors, Genres, Themes, and Serializations
export interface ResourceReference {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface JikanMangaCharacterData {
  data: MangaCharacter[];
}

export interface MangaCharacter {
  role: string; // e.g., "Main", "Supporting"
  manga: Character;
}

export interface Character {
  mal_id: number;
  url: string;
  images: ImageFormats;
  title: string;
}

export interface ImageFormats {
  jpg: ImageUrls;
  webp: ImageUrls;
}

export interface ImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanCharacterDetailResponse {
  data: FullCharacterData;
}

export interface FullCharacterData {
  mal_id: number;
  url: string;
  images: CharacterImages;
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  anime: AnimeAppearance[];
  manga: MangaAppearance[];
  voices: VoiceActorReference[];
}

export interface SimpleImage {
  image_url: string;
}

export interface WebpCharacterImage {
  image_url: string;
  small_image_url: string;
}

export interface AnimeAppearance {
  role: string; // e.g., "Main", "Supporting"
  anime: MediaNode;
}

export interface MangaAppearance {
  role: string; // e.g., "Main", "Supporting"
  manga: MediaNode;
}

export interface MediaNode {
  mal_id: number;
  url: string;
  images: FullyQualifiedImages;
  title: string;
}

export interface FullyQualifiedImages {
  jpg: ExpandedImageUrls;
  webp: ExpandedImageUrls;
}

export interface ExpandedImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface VoiceActorReference {
  person: VoiceActorPerson;
  language: string; // e.g., "Japanese", "English", "French"
}

export interface VoiceActorPerson {
  mal_id: number;
  url: string;
  images: {
    jpg: SimpleImage;
  };
  name: string;
}
