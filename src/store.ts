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
    tonightsPick: {} as IMovie | null,
    orderFilter: "",
    excludeFilter: "",
    durationFilters: [] as Array<string>,
    serviceFilters: [] as Array<string>
  },
  getters: {
    getCurrentUser: (state): IUser => state.currentUser,
    getCurrentUserDocumentId: (state): string => state.currentUserDocumentId,
    getAllMovies: (state): Array<IMovie> => state.moviesList,
    getMoviesToWatch: (state): Array<IMovie> => {
      return state.moviesList.filter((movie: IMovie) => {
        return !movie.hasWatched;
      })
        .filter(movie => {
          if (state.serviceFilters.length) {
            return state.serviceFilters.includes(movie.service.value);
          } else {
            return true;
          }
        })
        .filter(movie => {
          if (state.durationFilters.length) {
            if (state.durationFilters.includes("short")) {
              if (Number(movie.duration) < 107) {
                return movie;
              }
            }
            if (state.durationFilters.includes("long")) {
              if (Number(movie.duration) >= 107 && Number(movie.duration) <= 134) {
                return movie;
              }
            }
            if (state.durationFilters.includes("realLong")) {
              if (Number(movie.duration) > 134) {
                return movie;
              }
            }
          } else {
            return true;
          }
        })
        .sort((movie1, movie2): number => {
          switch (state.orderFilter) {
            case "alpha":
              if (movie1.title > movie2.title) {
                return 1;
              } else if (movie1.title < movie2.title) {
                return -1;
              } else {
                return 0;
              }
            case "duration_asc":
              if (Number(movie1.duration) > Number(movie2.duration)) {
                return 1;
              } else if (Number(movie1.duration) < Number(movie2.duration)) {
                return -1;
              } else {
                return 0;
              }
            case "duration_desc":
              if (Number(movie2.duration) > Number(movie1.duration)) {
                return 1;
              } else if (Number(movie2.duration) < Number(movie1.duration)) {
                return -1;
              } else {
                return 0;
              }
            case "service_abc":
              if (movie1.service.value > movie2.service.value) {
                return 1;
              } else if (movie1.service.value < movie2.service.value) {
                return -1;
              } else {
                return 0;
              }
            default:
              return 0;
          }
        })
        .sort((movie1, movie2): number => {
          switch (state.excludeFilter) {
            case "exclude":
              if (!movie1.exclude && movie2.exclude) {
                return 1;
              } else if (movie1.exclude && !movie2.exclude) {
                return -1;
              } else {
                return 0;
              }
            case "available":
              if (movie1.exclude && !movie2.exclude) {
                return 1;
              } else if (!movie1.exclude && movie2.exclude) {
                return -1;
              } else {
                return 0;
              }
            default:
              return 0;
          }
        });
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
    getTonightsPick: (state): IMovie | null => state.tonightsPick,
    getOrderFilter: (state): string => state.orderFilter,
    getExcludeFilter: (state): string => state.excludeFilter,
    getDurationFilters: (state): Array<string> => state.durationFilters,
    getServiceFilters: (state): Array<string> => state.serviceFilters
  },
  mutations: {
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
    updateRollPermission (state, value: boolean): void {
      state.canRoll = value;
    },
    setTonightsPick (state, movie: IMovie): void {
      state.tonightsPick = movie;
    },
    resetRolls (state): void {
      state.currentUser.rolls = 4000;
    },
    updateMovieExclude (state, { value, targetTitle }): void {
      const indexOfTargetMovie = state.moviesList.indexOf(state.moviesList.find(movie => movie.title === targetTitle) as IMovie);

      state.moviesList[indexOfTargetMovie].exclude = value;
    },
    updateUserHasRolled (state, value: boolean): void {
      state.currentUser.hasRolled = value;
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
    }
  },
  actions: {}
});

export default store;
