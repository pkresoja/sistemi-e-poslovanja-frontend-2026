import type { InvoiceModel } from "./invoice.model"

export interface UserModel {
    userId: number
    firstName: string
    lastName: string
    gender: 'm' | 'f'
    email: string
    invoices: InvoiceModel[]
}