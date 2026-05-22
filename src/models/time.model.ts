import type { MovieModel } from "./movie.model"

export interface TimeTableModel {
    timeTableId: number
    cinemaId: number
    movieId: number
    movie: MovieModel
    startTime: string
    price: number
}