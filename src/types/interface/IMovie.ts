import IService from "./IService";
import { TMBDMovieSearch, TMDBStreamProvider } from "@/types/tmdb";

type IMovieBase = {
  title?: string;
  service?: IService;
  duration?: number | string;
  hasWatched?: boolean;
  watchDate?: number;
  exclude?: boolean;
  documentId?: string;
  user?: string;
  genres?: Array<object>;
};

type IMovie = IMovieBase &
  TMBDMovieSearch & {
    hasWatched: boolean;
    addedDate: number;
    exclude: boolean;
    documentId?: string;
    providers: TMDBStreamProvider[];
    user?: string;
  };

export default IMovie;
