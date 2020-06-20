import moment from "moment";
import IService from "./IService";

interface IMovie {
  title: string;
  service: IService;
  duration: number;
  watchDate: moment.Moment;
}

export default IMovie;
