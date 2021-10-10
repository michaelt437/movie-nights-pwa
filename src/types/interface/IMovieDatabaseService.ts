interface IMovieDatabaseService<M, S> {
  getWatchProviders(): Promise<S[]>;
  searchMovie(searchText: string): Promise<M[]>;
}

export default IMovieDatabaseService;
