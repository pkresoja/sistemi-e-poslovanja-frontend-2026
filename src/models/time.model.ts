import type { CinemaModel } from "./cinema.model"

export interface TimeTableModel {
    timeTableId: number
    cinemaId: number
    movieId: number
    startTime: string
    price: number
    cinema?: CinemaModel
}