import IMovie from "./IMovie";

interface IMovieEditable extends IMovie {
  exclude: boolean;
}

export default IMovieEditable;
