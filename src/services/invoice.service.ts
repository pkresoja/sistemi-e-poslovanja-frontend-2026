import { DataService } from "./data.service";

export class InvoiceService {
    static async addTimeTableByIdToCart(id: number) {
       return await DataService.useAxios(`/invoice/cart/add/${id}`, 'put')
    }
}