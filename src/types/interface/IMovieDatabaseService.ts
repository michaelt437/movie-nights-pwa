import { TMDBMovie, TMDBStreamProvider } from "@/types/tmdb";

interface IMovieDatabaseService {
  getMovieProviders(): TMDBStreamProvider[];
  searchMovie(): TMDBMovie[];
}

export default IMovieDatabaseService;
