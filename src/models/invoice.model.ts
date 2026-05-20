export interface InvoiceModel {
    invoiceId: number
    pursId: string
    pursTime: string
    invoiceItems: {
        invoiceItemId: number
        pricePerItem: number
        count: number
    }[]
}