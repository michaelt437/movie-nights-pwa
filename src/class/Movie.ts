import IMovie from "@/interface/IMovie";
import IService from "@/interface/IService";
import moment from "moment";

class Movie implements IMovie {
  constructor (
    public title: string,
    public service: IService,
    public duration: number,
    public watchDate: moment.Moment
  ) {}

  get getTitle () {
    return this.title;
  }

  get getService () {
    return this.service;
  }

  get getDuration () {
    return this.duration;
  }

  get getWatchDate () {
    return this.watchDate;
  }
}

export default Movie;
