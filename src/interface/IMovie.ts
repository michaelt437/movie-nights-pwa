import IService from "./IService";

interface IMovie {
  title: string;
  service: IService | string;
  duration: number | string;
  hasWatched?: boolean;
  watchDate?: number;
  addedDate?: number;
  exclude?: boolean;
  documentId?: string;
}

export default IMovie;
