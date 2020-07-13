import Vue from "vue";
import Vuex from "vuex";
import IMovie from "@/interface/IMovie";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUserDocumentId: "",
    moviesList: []
  },
  getters: {
    getCurrentUserDocumentId: (state): string => state.currentUserDocumentId,
    getAllMovies: (state): Array<IMovie> => state.moviesList,
    getMoviesToWatch: (state): Array<IMovie> => {
      return state.moviesList.filter((movie: IMovie) => !movie.hasWatched);
    },
    getMoviesWatched: (state): Array<IMovie> => {
      return state.moviesList.filter((movie: IMovie) => movie.hasWatched);
    }
  },
  mutations: {
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
    }
  },
  actions: {}
});

export default store;
