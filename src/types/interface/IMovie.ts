import { TMDBMovie, TMDBStreamProvider } from "@/types/tmdb";
import { WatchProviderSource } from "../enums";

type IMovie = TMDBMovie & {
  hasWatched: boolean;
  addedDate: number;
  exclude: boolean;
  watchDate: number;
  providers: TMDBStreamProvider[];
  customProvider?: WatchProviderSource;
  customProviderModel?: Partial<TMDBStreamProvider>;
  documentId?: string;
  user?: string;
  // TODO remove old members
  service?: any;
  duration?: number;
};

export default IMovie;
