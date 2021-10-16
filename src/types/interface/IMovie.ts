import IService from "./IService";
import { TMDBMovie, TMDBStreamProvider } from "@/types/tmdb";

interface IMovie {
  title: string;
  service: IService;
  duration: number | string;
  hasWatched?: boolean;
  watchDate?: number;
  addedDate?: string;
  exclude?: boolean;
  documentId?: string;
  user?: string;
  genres: Array<object>;
}

interface IMovie2 extends TMDBMovie {
  hasWatched: boolean;
  addedDate: string;
  exclude: boolean;
  documentId?: string;
  providers: TMDBStreamProvider[];
  user?: string;
}

export default IMovie;
