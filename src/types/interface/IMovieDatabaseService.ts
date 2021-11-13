interface IMovieDatabaseService<M, S, T> {
  getWatchProviders(movieId: number): Promise<S[]>;
  searchMovie(searchText: string): Promise<M[]>;
  getMovieDetails(movieId: number): Promise<T>;
  getConfiguration(): Promise<any>;
}

export default IMovieDatabaseService;
