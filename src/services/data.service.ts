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

    static async getCinemas() {
        return await client.get<any[]>('/cinema')
    }

    static async deleteCinemaById(id: number) {
        return await client.request({
            url: `/cinema/${id}`,
            method: 'DELETE'
        })
    }

    static async getCinemaById(id: number) {
        return await client.get(`/cinema/${id}`)
    }

    static async updateCinema(id: number, obj: any) {
        return await client.request({
            url: `/cinema/${id}`,
            method: 'PUT',
            data: obj
        })
    }

    static async createCinema(obj: any) {
        return await client.request({
            url: `/cinema`,
            method: 'POST',
            data: obj
        })
    }
}