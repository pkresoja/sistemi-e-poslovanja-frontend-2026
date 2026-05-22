import type { MovieModel } from "@/models/movie.model"
import { DataService } from "./data.service"

export class MovieService {
    static async getMovies() {
        return await DataService.useAxios<MovieModel[]>('/movie')
    }

    static async getById(id: number) {
        return await DataService.useAxios<MovieModel>(`/movie/${id}`)
    }
}