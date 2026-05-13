import type { TimeTableModel } from "@/models/time.model";
import { DataService } from "./data.service";

export class TimeTableService {
    static async getById(id: number) {
        return await DataService.useAxios<TimeTableModel>(`/time-table/${id}`)
    }

    static async create(obj: any) {
        return await DataService.useAxios(`/time-table`, 'post', obj)
    }

    static async update(id: number, obj: any) {
        return await DataService.useAxios(`/time-table/${id}`, 'put', obj)
    }

    static async deleteById(id: number) {
        return await DataService.useAxios(`/time-table/${id}`, 'delete')
    }
}