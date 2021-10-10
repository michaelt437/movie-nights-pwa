interface IMovieDatabaseService<M, S> {
  getWatchProviders(movieId: number): Promise<S[]>;
  searchMovie(searchText: string): Promise<M[]>;
}

export default IMovieDatabaseService;
