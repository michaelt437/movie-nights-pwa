import IService from "./IService";

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

export default IMovie;
