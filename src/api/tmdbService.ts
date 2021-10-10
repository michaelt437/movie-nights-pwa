import axios from "axios";
import IMovieDatabaseService from "@/types/interface/IMovieDatabaseService";
import {
  TMDBMovie,
  TMDBSearchDTO,
  TMDBStreamProvider,
  TMDBWatchProviderDTO
} from "@/types/tmdb";

const uriRoot = "https://api.themoviedb.org/3/";

class TMDBService
implements IMovieDatabaseService<TMDBMovie, TMDBStreamProvider> {
  async getWatchProviders (movieId: number): Promise<TMDBStreamProvider[]> {
    const apiResponse = await axios
      .get<TMDBWatchProviderDTO>(
        `${uriRoot}movie/${movieId}/watch/providers?apiKey=${process.env.VUE_APP_TMDBKEY}`
      )
      .then(res => res.data);
    const results = apiResponse.results.US?.flatrate;
    return results;
  }

  async searchMovie (searchText: string): Promise<TMDBMovie[]> {
    const apiResponse = await axios
      .get<TMDBSearchDTO>(
        `${uriRoot}search/movie?apiKey=${
          process.env.VUE_APP_TMDBKEY
        }&language=en-US&query=${encodeURIComponent(
          searchText
        )}&page=1&include_adult=false`
      )
      .then(res => res.data);
    const results = apiResponse.results;
    return results;
  }
}

export default TMDBService;