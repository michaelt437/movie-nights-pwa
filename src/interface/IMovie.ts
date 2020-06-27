import IService from "./IService";

interface IMovie {
  title: string;
  service: IService | string;
  duration: number | string;
  watchDate: number;
  addedDate?: number;
  exclude?: boolean;
}

export default IMovie;
