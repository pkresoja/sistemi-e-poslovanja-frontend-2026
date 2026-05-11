import type { MovieModel } from "@/models/movie.model";
import axios from "axios";

const client = axios.create({
    baseURL: 'http://localhost:3300/api',
    headers: {
        'Accept': 'application/json'
    }
})

export class DataService {
    static async getMovies() {
        return await client.get<MovieModel[]>('/movie')
    }

    static async getMovieById(id: number) {
        return await client.get<MovieModel>('/movie/' + id)
    }
}