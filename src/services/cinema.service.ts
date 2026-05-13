import { DataService } from "./data.service"

export class CinemaService {
    static async getCinemas() {
        return await DataService.useAxios<any[]>('/cinema')
    }

    static async getCinemaById(id: number) {
        return await DataService.useAxios<any>(`/cinema/${id}`)
    }

    static async createCinema(obj: any) {
        return await DataService.useAxios(`/cinema`, 'post', obj)
    }

    static async updateCinema(id: number, obj: any) {
        return await DataService.useAxios(`/cinema/${id}`, 'put', obj)
    }

    static async deleteCinemaById(id: number) {
        return await DataService.useAxios(`/cinema/${id}`, 'delete')
    }
}