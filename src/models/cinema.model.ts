import type { TimeTableModel } from "./time.model"

export interface CinemaModel {
    cinemaId: number
    name: string
    address: string,
    timeTables: TimeTableModel[]
}