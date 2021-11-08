import { TMDBMovie, TMDBStreamProvider } from "@/types/tmdb";

type IMovie = TMDBMovie & {
  hasWatched: boolean;
  addedDate: number;
  exclude: boolean;
  watchDate: number;
  providers: TMDBStreamProvider[];
  documentId?: string;
  user?: string;
  // TODO remove old members
  service?: any;
  duration?: number;
};

export default IMovie;
