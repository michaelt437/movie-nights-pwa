type TMDBSearchDTO = {
  page: number;
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
};

type TMDBWatchProviderDTO = {
  id: number;
  results: {
    [region: string]: TMDBProviderRegions;
  };
};

type TMDBProviderRegions = {
  link: string;
  flatrate: TMDBStreamProvider[];
  rent: TMDBStreamProvider[];
  buy: TMDBStreamProvider[];
};

type TMDBMovie = {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
};

type TMDBStreamProvider = {
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
};

export { TMDBMovie, TMDBSearchDTO, TMDBStreamProvider, TMDBWatchProviderDTO };
