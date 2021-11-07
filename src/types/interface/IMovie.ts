import { TMDBMovie, TMDBStreamProvider } from "@/types/tmdb";

type IMovie = TMDBMovie & {
  hasWatched: boolean;
  addedDate: number;
  exclude: boolean;
  documentId?: string;
  user?: string;
};

export default IMovie;
