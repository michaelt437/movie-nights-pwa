import { injectable, inject } from "tsyringe";
import Vue from "vue";
import Vuex from "vuex";
import IMovie from "@/types/interface/IMovie";
import IUser from "@/types/interface/IUser";
import { TMDBMovieSearch } from "@/types/tmdb";
import IMovieDatabaseService from "@/types/interface/IMovieDatabaseService";

Vue.use(Vuex);

@injectable()
class AppStore<MovieSearchType, StreamProviderType, MovieType> {
  public state;
  public getters;
  public mutations;
  public actions;
  public apiService;
  public store;
  constructor (
    @inject("IMovieDatabaseService")
      apiService: IMovieDatabaseService<
      MovieSearchType,
      StreamProviderType,
      MovieType
    >
  ) {
    this.apiService = apiService;
    this.state = {
      currentUser: {} as IUser,
      currentUserDocumentId: "",
      moviesList: [] as IMovie[],
      canRoll: true,
      tonightsPick: null,
      orderFilter: "",
      excludeFilter: "",
      durationFilters: [] as Array<string>,
      serviceFilters: [] as Array<string>,
      genreFilters: [] as Array<string>,
      durationCategories: [] as Array<string>,
      serviceCategories: [] as Array<string>,
      genreCategories: [] as Array<string>,
      searchResults: [] as MovieSearchType[],
      config: {} as object // TODO type as config?
    };

    this.getters = {
      getCurrentUser: (state): IUser => state.currentUser,
      getCurrentUserDocumentId: (state): string => state.currentUserDocumentId,
      getAllMovies: (state): MovieType[] => state.moviesList,
      getMoviesToWatch: <MovieType extends { addedDate: number }>(
        state
      ): MovieType[] => {
        return state.moviesList
          .filter((movie: IMovie) => {
            return !movie.hasWatched;
          })
          .sort((m1: MovieType, m2: MovieType) => {
            if (m1.addedDate > m2.addedDate) return -1;
            else if (m1.addedDate < m2.addedDate) return 1;
            else return 0;
          });
      },
      getMoviesWatched: (state): MovieType[] => {
        return state.moviesList
          .filter(
            (movie: IMovie) =>
              movie.hasWatched &&
              movie.documentId !== state.tonightsPick?.documentId
          )
          .sort((movie1, movie2) => {
            if (movie1.watchDate! > movie2.watchDate!) {
              return -1;
            } else if (movie1.watchDate! < movie2.watchDate!) {
              return 1;
            } else {
              return 0;
            }
          });
      },
      getTonightsPick: (state): MovieType | null => state.tonightsPick,
      getOrderFilter: (state): string => state.orderFilter,
      getExcludeFilter: (state): string => state.excludeFilter,
      getDurationFilters: (state): string[] => state.durationFilters,
      getServiceFilters: (state): string[] => state.serviceFilters,
      getGenreFilters: (state): string[] => state.genreFilters,
      getDurationCategories: (state): string[] => state.durationCategories,
      getServiceCategories: (state): string[] => state.serviceCategories,
      getGenreCategories: (state): string[] => state.genreCategories
    };

    this.mutations = {
      setCurrentUser (state, user: IUser): void {
        state.currentUser = user;
      },
      setCurrentUserDocumentId (state, id: string): void {
        state.currentUserDocumentId = id;
      },
      setMoviesList (state, moviesArray: Array<IMovie>): void {
        state.moviesList = moviesArray;
      },
      submitEditsToMovie (state, movieEdits: IMovie): void {
        const moviesList: Array<IMovie> = state.moviesList;
        const movieToEditIndex = moviesList.indexOf(
          moviesList.find(
            movie => movie.documentId === movieEdits.documentId
          ) as IMovie
        );
        Vue.set(state.moviesList, movieToEditIndex, movieEdits);
      },
      addMovieToList (state, movie: IMovie): void {
        state.moviesList.push(movie);
      },
      deleteMovieFromList (state, movieToDelete: IMovie): void {
        const moviesList: Array<IMovie> = state.moviesList;
        const movieToDeleteIndex = moviesList.indexOf(
          moviesList.find(
            movie => movie.documentId === movieToDelete.documentId
          ) as IMovie
        );
        moviesList.splice(movieToDeleteIndex, 1);
      },
      decrementRolls (state): void {
        state.currentUser.rolls = state.currentUser.rolls - 1;
      },
      updateRollPermission (state, value: boolean): void {
        state.canRoll = value;
      },
      setTonightsPick (state, movie: IMovie): void {
        state.tonightsPick = movie;
      },
      resetRolls (state): void {
        state.currentUser.rolls = 4;
      },
      updateMovieExclude (state, { value, targetTitle }): void {
        const indexOfTargetMovie = state.moviesList.indexOf(
          state.moviesList.find(movie => movie.title === targetTitle) as IMovie
        );

        state.moviesList[indexOfTargetMovie].exclude = value;
      },
      updateUserHasRolled (state, value: boolean): void {
        state.currentUser.hasRolled = value;
      },
      updateProviders (state, { documentId, newProviders }): void {
        const moviesList: Array<IMovie> = state.moviesList;
        const movieToEditIndex = moviesList.indexOf(
          moviesList.find(movie => movie.documentId === documentId) as IMovie
        );
        Vue.set(state.moviesList[movieToEditIndex], "providers", newProviders);
      },
      setOrderFilter (state, value: string): void {
        state.orderFilter = value;
      },
      setExcludeFilter (state, value: string): void {
        state.excludeFilter = value;
      },
      setDurationFilters (state, arrayOfDurations: Array<string>): void {
        state.durationFilters = arrayOfDurations;
      },
      setServiceFilters (state, arrayOfServices: Array<string>): void {
        state.serviceFilters = arrayOfServices;
      },
      setGenreFilters (state, arrayOfGenres: Array<string>): void {
        state.genreFilters = arrayOfGenres;
      },
      setDurationCategories (state, arrayOfDurations: Array<string>): void {
        state.durationCategories = arrayOfDurations;
      },
      setServiceCategories (state, arrayOfServices: Array<string>): void {
        state.serviceCategories = arrayOfServices;
      },
      setGenreCategories (state, arrayOfGenres: Array<string>): void {
        state.genreCategories = arrayOfGenres;
      },
      resetListPageFilters (state): void {
        state.orderFilter = "";
        state.excludeFilter = "";
        state.durationFilters = [];
        state.serviceFilters = [];
        state.genreFilters = [];
      },
      resetPickFilters (state): void {
        state.durationCategories = [];
        state.serviceCategories = [];
        state.genreCategories = [];
      },
      setSearchResults (state, data: TMDBMovieSearch[]): void {
        state.searchResults = data;
      },
      setConfiguration (state, config): void {
        state.config = config;
      }
    };
    this.actions = {
      async searchMovie (
        { commit },
        payload: { searchText: string }
      ): Promise<void> {
        const data = await apiService.searchMovie(payload.searchText);
        commit("setSearchResults", data);
      },
      async fetchWatchProviders (
        context,
        payload: { movieId: number }
      ): Promise<StreamProviderType[]> {
        const data = await apiService.getWatchProviders(payload.movieId);
        return data;
      },
      async fetchMovieDetails (
        context,
        payload: { movieId: number }
      ): Promise<MovieType> {
        const data = await apiService.getMovieDetails(payload.movieId);
        return data;
      },
      async fetchConfiguration (context): Promise<void> {
        const data = await apiService.getConfiguration();
        context.commit("setConfiguration", data);
      }
    };
    this.store = new Vuex.Store({
      state: this.state,
      getters: this.getters,
      mutations: this.mutations,
      actions: this.actions
    });
  }
}

export { AppStore };
