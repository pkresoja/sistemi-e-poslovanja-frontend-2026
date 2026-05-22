import type { MovieModel } from "./movie.model"

export interface InvoiceItemModel {
    invoiceItemId: number
    pricePerItem: number
    count: number
    timeTable: {
        timeTableId: number
        startTime: string
        cinema: {
            cinemaId: number
            name: string
            address: string
        }
        movie: MovieModel
    }
}