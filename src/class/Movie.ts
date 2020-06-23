import IMovie from "@/interface/IMovie";
import IService from "@/interface/IService";

class Movie implements IMovie {
  constructor (
    public title: string,
    public service: IService,
    public duration: number,
    public watchDate: number
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
