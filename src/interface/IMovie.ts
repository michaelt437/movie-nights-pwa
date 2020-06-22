import IService from "./IService";

interface IMovie {
  title: string;
  service: IService;
  duration: number;
  watchDate: number;
}

export default IMovie;
