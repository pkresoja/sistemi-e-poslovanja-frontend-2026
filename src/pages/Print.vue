<script lang="ts" setup>
import { useLogout } from '@/hooks/logout.hook'
import type { InvoiceModel } from '@/models/invoice.model'
import type { InvoiceItemModel } from '@/models/item.model'
import { InvoiceService } from '@/services/invoice.service'
import QRCode from 'qrcode'
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const logout = useLogout()
const route = useRoute()

const invoice = ref<InvoiceModel | null>(null)
const loading = ref(true)
const qrCodeUrl = ref('')

const id = Number(route.params.id)

const fiscalVerificationPayload = computed(() => {
    if (!invoice.value?.pursId) return ''
    return `https://suf.purs.gov.rs/v/?id=${encodeURIComponent(invoice.value.pursId)}`
})

InvoiceService.getDetails(id)
    .then(rsp => {
        invoice.value = rsp.data
    })
    .catch(e => logout(e))
    .finally(() => loading.value = false)

watch(
    fiscalVerificationPayload,
    async value => {
        if (!value) {
            qrCodeUrl.value = ''
            return
        }

        qrCodeUrl.value = await QRCode.toDataURL(value, {
            width: 220,
            margin: 1,
            errorCorrectionLevel: 'M',
        })
    },
    { immediate: true }
)

watch(
    () => loading.value,
    async isLoading => {
        if (!isLoading && invoice.value) {
            await nextTick()

            /**
             * Malo kašnjenje je korisno da browser sigurno nacrta QR kod.
             */
            setTimeout(() => {
                window.print()
            }, 300)
        }
    }
)

const invoiceNumber = computed(() => {
    if (!invoice.value) return ''

    const year = new Date(invoice.value.createdAt).getFullYear()
    const paddedId = String(invoice.value.invoiceId).padStart(6, '0')

    return `#${year}/${paddedId}`
})

const invoiceItems = computed(() => invoice.value?.invoiceItems ?? [])

const totalAmount = computed(() => {
    return invoiceItems.value.reduce((sum, item) => {
        return sum + item.pricePerItem * item.count
    }, 0)
})

const vatAmount = computed(() => {
    return totalAmount.value * 20 / 120
})

const netAmount = computed(() => {
    return totalAmount.value - vatAmount.value
})

function formatMoney(value: number): string {
    return new Intl.NumberFormat('sr-RS', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value) + ' RSD'
}

function formatDateTime(value?: string): string {
    if (!value) return '-'

    return new Intl.DateTimeFormat('sr-RS', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

function getItemTotal(item: InvoiceItemModel): number {
    return item.pricePerItem * item.count
}

function printAgain(): void {
    window.print()
}
</script>

<template>
    <main class="receipt-page">
        <div v-if="loading" class="receipt-loading">
            Loading receipt...
        </div>

        <div v-else-if="!invoice" class="receipt-loading">
            Receipt not found.
        </div>

        <template v-else>
            <div class="receipt-paper">
                <div class="text-center mb-2">
                    <div class="receipt-title">ФИСКАЛНИ РАЧУН</div>
                    <div class="receipt-small">Практикум Системи Е-пословања</div>
                    <div class="receipt-small">Технички Факултет</div>
                    <div class="receipt-small">Универзитет Сингидунум</div>
                    <div class="receipt-small">Данијелова 32, 11000 Београд, Србија</div>
                </div>

                <div class="receipt-line"></div>

                <div class="receipt-row">
                    <span>Рачун:</span>
                    <strong>{{ invoiceNumber }}</strong>
                </div>

                <div class="receipt-row">
                    <span>Касир:</span>
                    <strong>Веб продавница</strong>
                </div>

                <div class="receipt-row">
                    <span>Датум:</span>
                    <strong>{{ formatDateTime(invoice.pursTime) }}</strong>
                </div>

                <div class="receipt-row">
                    <span>ПФР број:</span>
                </div>

                <div class="receipt-break">
                    {{ invoice.pursCounter }}
                </div>

                <div class="receipt-line"></div>

                <div v-for="item in invoiceItems" :key="`receipt-${item.invoiceItemId}`" class="receipt-item">
                    <div class="receipt-item-title">
                        {{ item.timeTable.movie.title }}
                    </div>

                    <div class="receipt-row">
                        <span>
                            {{ item.count }} x {{ formatMoney(item.pricePerItem) }}
                        </span>
                        <strong>{{ formatMoney(getItemTotal(item)) }}</strong>
                    </div>
                </div>

                <div class="receipt-line"></div>

                <div class="receipt-row">
                    <span>Пореска основица</span>
                    <strong>{{ formatMoney(netAmount) }}</strong>
                </div>

                <div class="receipt-row">
                    <span>ПДВ 20%</span>
                    <strong>{{ formatMoney(vatAmount) }}</strong>
                </div>

                <div class="receipt-total">
                    <span>УКУПНО</span>
                    <strong>{{ formatMoney(totalAmount) }}</strong>
                </div>

                <div class="receipt-row mt-2">
                    <span>Плаћено картицом</span>
                    <strong>{{ formatMoney(totalAmount) }}</strong>
                </div>

                <div class="receipt-line"></div>

                <div class="receipt-small mb-1">
                    ПФР време:
                </div>

                <div class="receipt-break">
                    {{ formatDateTime(invoice.pursTime) }}
                </div>

                <div class="receipt-small mt-2 mb-1">
                    ПФР ИД:
                </div>

                <div class="receipt-break">
                    {{ invoice.pursId }}
                </div>

                <div class="text-center mt-3">
                    <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Fiscal verification QR code" class="receipt-qr">

                    <div class="receipt-small mt-2">
                        Скенирајте QR код за проверу рачуна
                    </div>
                </div>

                <div class="receipt-line"></div>

                <div class="text-center receipt-small">
                    КРАЈ ФИСКАЛНОГ РАЧУНА
                </div>
            </div>

            <button type="button" class="print-button" @click="printAgain">
                <i class="fa-solid fa-print"></i>
                Print again
            </button>
        </template>
    </main>
</template>

<style scoped>
.receipt-page {
    min-height: 100vh;
    background: #212529;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.receipt-loading {
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding: 2rem;
}

.receipt-paper {
    width: 80mm;
    max-width: 80mm;
    background: #f8f9fa;
    color: #111;
    border-radius: 0.35rem;
    padding: 4mm;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 10px;
    line-height: 1.25;
    box-shadow:
        0 0.5rem 1rem rgba(0, 0, 0, 0.35),
        inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.text-center {
    text-align: center;
}

.mb-1 {
    margin-bottom: 0.25rem;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mt-2 {
    margin-top: 0.5rem;
}

.mt-3 {
    margin-top: 1rem;
}

.receipt-title {
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 0.03em;
}

.receipt-small {
    font-size: 9px;
    color: #333;
}

.receipt-line {
    border-top: 1px dashed #444;
    margin: 0.55rem 0;
}

.receipt-row {
    display: flex;
    justify-content: space-between;
    gap: 0.4rem;
    margin-bottom: 0.25rem;
}

.receipt-row span {
    min-width: 0;
}

.receipt-row strong {
    text-align: right;
    font-weight: 800;
}

.receipt-item {
    margin-bottom: 0.55rem;
}

.receipt-item-title {
    font-weight: 800;
    margin-bottom: 0.2rem;
    word-break: break-word;
}

.receipt-total {
    display: flex;
    justify-content: space-between;
    gap: 0.4rem;
    font-size: 12px;
    font-weight: 900;
    margin-top: 0.4rem;
}

.receipt-break {
    word-break: break-all;
    overflow-wrap: anywhere;
    font-size: 9px;
    font-weight: 700;
}

.receipt-qr {
    width: 38mm;
    max-width: 38mm;
    background: #fff;
    padding: 1mm;
    border-radius: 0.25rem;
}

.print-button {
    margin-top: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.35);
    background: transparent;
    color: #fff;
    border-radius: 0.375rem;
    padding: 0.5rem 0.85rem;
    font-size: 0.875rem;
    cursor: pointer;
}

.print-button:hover {
    background: rgba(255, 255, 255, 0.1);
}

@media print {
    @page {
        size: 80mm auto;
        margin: 0;
    }

    html,
    body {
        width: 80mm;
        margin: 0;
        padding: 0;
        background: #fff !important;
    }

    .receipt-page {
        display: block;
        min-height: 0;
        width: 80mm;
        margin: 0;
        padding: 0;
        background: #fff !important;
    }

    .receipt-paper {
        width: 80mm;
        max-width: 80mm;
        margin: 0;
        padding: 4mm;
        background: #fff !important;
        color: #000 !important;
        border: 0;
        border-radius: 0;
        box-shadow: none;
    }

    .receipt-title,
    .receipt-small,
    .receipt-row,
    .receipt-total,
    .receipt-item-title,
    .receipt-break {
        color: #000 !important;
    }

    .receipt-line {
        border-top-color: #000 !important;
    }

    .print-button {
        display: none !important;
    }
}
</style>