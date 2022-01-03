type TMDBSearchDTO = {
  page: number;
  results: TMDBMovieSearch[];
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

type TMDBMovieSearch = {
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

type TMDBGenre = {
  id: number;
  name: string;
};

type TMDBPerson = {
  adult: boolean;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
};

type TMDBCast = TMDBPerson & {
  cast_id: number;
  character: string;
  order: number;
};

type TMDBCrew = TMDBPerson & {
  department: string;
  job: string;
};

type TMDBMovie = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: object;
  budget: number;
  credits: {
    cast: TMDBCast[];
    crew: TMDBCrew[];
  };
  genres: TMDBGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: object[];
  production_countries: object[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: object[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type TMDBConfig = {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
};
export {
  TMDBConfig,
  TMDBGenre,
  TMDBMovie,
  TMDBMovieSearch,
  TMDBSearchDTO,
  TMDBStreamProvider,
  TMDBWatchProviderDTO
};
