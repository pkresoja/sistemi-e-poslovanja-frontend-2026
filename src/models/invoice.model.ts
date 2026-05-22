import type { InvoiceItemModel } from "./item.model"

export interface InvoiceModel {
    invoiceId: number
    pursId: string
    pursTime: string
    pursCounter: string
    createdAt: string
    invoiceItems: InvoiceItemModel[]
}