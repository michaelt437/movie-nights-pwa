import Vue from "vue";
import Vuex from "vuex";
import IMovie from "@/interface/IMovie";
import IUser from "@/interface/IUser";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: {} as IUser,
    currentUserDocumentId: "",
    moviesList: [] as IMovie[],
    canRoll: true,
    tonightsPick: {} as IMovie | null
  },
  getters: {
    getCurrentUser: (state): IUser => state.currentUser,
    getCurrentUserDocumentId: (state): string => state.currentUserDocumentId,
    getAllMovies: (state): Array<IMovie> => state.moviesList,
    getMoviesToWatch: (state): Array<IMovie> => {
      return state.moviesList.filter((movie: IMovie) => !movie.hasWatched);
    },
    getMoviesWatched: (state): Array<IMovie> => {
      return state.moviesList.filter((movie: IMovie) => movie.hasWatched && (movie.documentId !== state.tonightsPick?.documentId)).sort((movie1, movie2) => {
        if (movie1.watchDate! > movie2.watchDate!) {
          return -1;
        } else if (movie1.watchDate! < movie2.watchDate!) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    getTonightsPick: (state): IMovie | null => state.tonightsPick
  },
  mutations: {
    setCurrentUser (state, user): void {
      state.currentUser = user;
    },
    setCurrentUserDocumentId (state, id): void {
      state.currentUserDocumentId = id;
    },
    setMoviesList (state, moviesArray): void {
      state.moviesList = moviesArray;
    },
    submitEditsToMovie (state, movieEdits): void {
      const moviesList: Array<IMovie> = state.moviesList;
      const movieToEditIndex = moviesList.indexOf(moviesList.find(movie => movie.documentId === movieEdits.documentId) as IMovie);
      Vue.set(state.moviesList, movieToEditIndex, movieEdits);
    },
    addMovieToList (state, movie: IMovie): void {
      state.moviesList.push(movie);
    },
    deleteMovieFromList (state, movieToDelete: IMovie): void {
      const moviesList: Array<IMovie> = state.moviesList;
      const movieToDeleteIndex = moviesList.indexOf(moviesList.find(movie => movie.documentId === movieToDelete.documentId) as IMovie);
      moviesList.splice(movieToDeleteIndex, 1);
    },
    decrementRolls (state): void {
      state.currentUser.rolls = state.currentUser.rolls - 1;
    },
    updateRollPermission (state, value): void {
      state.canRoll = value;
    },
    setTonightsPick (state, movie): void {
      state.tonightsPick = movie;
    },
    resetRolls (state): void {
      state.currentUser.rolls = 4000;
    },
    updateUserHasRolled (state, value): void {
      state.currentUser.hasRolled = value;
    }
  },
  actions: {}
});

export default store;
