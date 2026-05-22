<script lang="ts" setup>
import { useLogout } from '@/hooks/logout.hook'
import type { InvoiceModel } from '@/models/invoice.model'
import type { InvoiceItemModel } from '@/models/item.model'
import { InvoiceService } from '@/services/invoice.service'
import QRCode from 'qrcode'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const logout = useLogout()
const route = useRoute()
const router = useRouter()

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

const invoiceNumber = computed(() => {
    if (!invoice.value) return ''

    const year = new Date(invoice.value.createdAt).getFullYear()
    const paddedId = String(invoice.value.invoiceId).padStart(6, '0')

    return `#${year}/${paddedId}`
})

const InvoiceItemModels = computed(() => invoice.value?.invoiceItems ?? [])

const totalAmount = computed(() => {
    return InvoiceItemModels.value.reduce((sum, item) => {
        return sum + item.pricePerItem * item.count
    }, 0)
})

const totalTickets = computed(() => {
    return InvoiceItemModels.value.reduce((sum, item) => sum + item.count, 0)
})

const vatAmount = computed(() => {
    /**
     * If the price already contains VAT and VAT rate is 20%:
     * VAT = gross * 20 / 120
     */
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

function formatDate(value?: string): string {
    if (!value) return '-'

    return new Intl.DateTimeFormat('sr-RS', {
        dateStyle: 'medium',
    }).format(new Date(value))
}

function formatTime(value?: string): string {
    if (!value) return '-'
    return value.substring(0, 5)
}

function getItemTotal(item: InvoiceItemModel): number {
    return item.pricePerItem * item.count
}

function getGenres(item: InvoiceItemModel): string {
    return item.timeTable.movie.movieGenres
        ?.map(movieGenre => movieGenre.genre.name)
        .join(', ') || '-'
}

function getActors(item: InvoiceItemModel): string {
    return item.timeTable.movie.movieActors
        ?.slice(0, 4)
        .map(movieActor => movieActor.actor.name)
        .join(', ') || '-'
}

function openPrintPage(): void {
    const printUrl = router.resolve({
        path: `${route.path}/print`,
    })

    window.open(printUrl.href, '_blank')
}
</script>

<template>
    <div class="container-fluid py-4">
        <div v-if="loading" class="card border-0 shadow-sm">
            <div class="card-body py-5 text-center">
                <div class="spinner-border text-primary mb-3" role="status"></div>
                <div class="fw-semibold">Loading invoice details...</div>
            </div>
        </div>

        <div v-else-if="!invoice" class="card border-0 shadow-sm">
            <div class="card-body py-5 text-center">
                <div class="display-6 mb-2">Invoice not found</div>
                <p class="text-body-secondary mb-0">
                    The requested invoice could not be loaded.
                </p>
            </div>
        </div>

        <div v-else class="row g-4 align-items-start">
            <!-- MAIN INVOICE UI - 10 COLUMNS -->
            <div class="col-12 col-xl-10">
                <div class="card border-0 shadow-sm mb-4 overflow-hidden">
                    <div class="card-body p-4">
                        <div class="d-flex flex-column flex-lg-row justify-content-between gap-3">
                            <div>
                                <div class="text-uppercase text-body-secondary small fw-bold mb-1">
                                    Invoice details
                                </div>

                                <h1 class="h3 fw-bold mb-2">
                                    Invoice {{ invoiceNumber }}
                                </h1>

                                <div class="d-flex flex-wrap gap-2">
                                    <span class="badge rounded-pill text-bg-success">
                                        Paid
                                    </span>

                                    <span class="badge rounded-pill text-bg-secondary">
                                        {{ totalTickets }} tickets
                                    </span>

                                    <span class="badge rounded-pill text-bg-dark border">
                                        Fiscalized
                                    </span>
                                </div>
                            </div>

                            <div class="text-lg-end">
                                <div class="text-body-secondary small">
                                    App invoice ID
                                </div>
                                <div class="fw-bold fs-5">
                                    {{ invoice.invoiceId }}
                                </div>

                                <div class="text-body-secondary small mt-2">
                                    Created at
                                </div>
                                <div class="fw-semibold">
                                    {{ formatDateTime(invoice.createdAt) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-12 col-md-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="text-body-secondary small fw-bold text-uppercase mb-2">
                                    Total amount
                                </div>
                                <div class="h3 fw-bold mb-0">
                                    {{ formatMoney(totalAmount) }}
                                </div>
                                <div class="text-body-secondary small mt-2">
                                    VAT included
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="text-body-secondary small fw-bold text-uppercase mb-2">
                                    Paid at
                                </div>
                                <div class="fw-bold fs-5">
                                    {{ formatDateTime(invoice.pursTime) }}
                                </div>
                                <div class="text-body-secondary small mt-2">
                                    Time from government tax API
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <div class="text-body-secondary small fw-bold text-uppercase mb-2">
                                    Fiscal invoice
                                </div>
                                <div class="fw-bold text-break">
                                    {{ invoice.pursCounter }}
                                </div>
                                <div class="text-body-secondary small mt-2">
                                    PURS invoice counter
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-transparent border-secondary-subtle p-4">
                        <div class="d-flex flex-column flex-lg-row justify-content-between gap-2">
                            <div>
                                <h2 class="h5 fw-bold mb-1">
                                    Ordered tickets
                                </h2>
                                <p class="text-body-secondary mb-0">
                                    Overview of all movies, showtimes and ticket quantities.
                                </p>
                            </div>

                            <div class="text-lg-end">
                                <div class="small text-body-secondary">
                                    Unique fiscal ID
                                </div>
                                <div class="small fw-semibold text-break">
                                    {{ invoice.pursId }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-body p-0">
                        <div v-for="item in InvoiceItemModels" :key="item.invoiceItemId"
                            class="p-4 border-bottom border-secondary-subtle">
                            <div class="row g-4">
                                <div class="col-12 col-md-3 col-lg-2">
                                    <img :src="item.timeTable.movie.poster" :alt="item.timeTable.movie.title"
                                        class="img-fluid rounded-4 shadow-sm movie-poster">
                                </div>

                                <div class="col-12 col-md-9 col-lg-7">
                                    <div class="d-flex flex-wrap gap-2 mb-2">
                                        <span class="badge text-bg-primary">
                                            {{ item.timeTable.movie.runTime }} min
                                        </span>

                                        <span class="badge text-bg-secondary">
                                            {{ getGenres(item) }}
                                        </span>
                                    </div>

                                    <h3 class="h4 fw-bold mb-1">
                                        {{ item.timeTable.movie.title }}
                                    </h3>

                                    <div class="text-body-secondary mb-3">
                                        {{ item.timeTable.movie.originalTitle }}
                                    </div>

                                    <p class="mb-3">
                                        {{ item.timeTable.movie.shortDescription }}
                                    </p>

                                    <div class="row g-3 small">
                                        <div class="col-12 col-md-6">
                                            <div class="text-body-secondary">
                                                Cinema
                                            </div>
                                            <div class="fw-semibold">
                                                {{ item.timeTable.cinema.name }}
                                            </div>
                                            <div class="text-body-secondary">
                                                {{ item.timeTable.cinema.address }}
                                            </div>
                                        </div>

                                        <div class="col-12 col-md-6">
                                            <div class="text-body-secondary">
                                                Projection
                                            </div>
                                            <div class="fw-semibold">
                                                {{ formatDate(item.timeTable.movie.startDate) }}
                                                at
                                                {{ formatTime(item.timeTable.startTime) }}
                                            </div>
                                            <div class="text-body-secondary">
                                                Director:
                                                {{ item.timeTable.movie.director?.name || '-' }}
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="text-body-secondary">
                                                Main actors
                                            </div>
                                            <div class="fw-semibold">
                                                {{ getActors(item) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12 col-lg-3">
                                    <div class="card bg-body-tertiary border-0 h-100">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="text-body-secondary">Quantity</span>
                                                <span class="fw-bold">{{ item.count }}</span>
                                            </div>

                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="text-body-secondary">Price</span>
                                                <span class="fw-bold">
                                                    {{ formatMoney(item.pricePerItem) }}
                                                </span>
                                            </div>

                                            <hr>

                                            <div class="d-flex justify-content-between align-items-center">
                                                <span class="fw-semibold">Subtotal</span>
                                                <span class="fw-bold fs-5">
                                                    {{ formatMoney(getItemTotal(item)) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer bg-transparent p-4">
                        <div class="row justify-content-end">
                            <div class="col-12 col-md-6 col-lg-4">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-body-secondary">Net amount</span>
                                    <span class="fw-semibold">{{ formatMoney(netAmount) }}</span>
                                </div>

                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-body-secondary">VAT 20%</span>
                                    <span class="fw-semibold">{{ formatMoney(vatAmount) }}</span>
                                </div>

                                <hr>

                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 fw-bold mb-0">Total</span>
                                    <span class="h4 fw-bold mb-0">
                                        {{ formatMoney(totalAmount) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- SERBIAN RECEIPT - LAST 2 COLUMNS -->
            <div class="col-12 col-xl-2">
                <div class="receipt-wrapper sticky-xl-top">
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

                        <div v-for="item in InvoiceItemModels" :key="`receipt-${item.invoiceItemId}`"
                            class="receipt-item">
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

                    <button type="button" class="btn btn-outline-light w-100 mt-3" @click="openPrintPage">
                        <i class="fa-solid fa-print me-2"></i>
                        Print
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.movie-poster {
    width: 100%;
    max-height: 260px;
    object-fit: cover;
}

.receipt-wrapper {
    top: 1rem;
}

.receipt-paper {
    background: #f8f9fa;
    color: #111;
    border-radius: 0.35rem;
    padding: 0.75rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-size: 0.68rem;
    line-height: 1.25;
    box-shadow:
        0 0.5rem 1rem rgba(0, 0, 0, 0.35),
        inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.receipt-title {
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 0.03em;
}

.receipt-small {
    font-size: 0.62rem;
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
    font-size: 0.78rem;
    font-weight: 900;
    margin-top: 0.4rem;
}

.receipt-break {
    word-break: break-all;
    overflow-wrap: anywhere;
    font-size: 0.62rem;
    font-weight: 700;
}

.receipt-qr {
    width: 100%;
    max-width: 150px;
    background: #fff;
    padding: 0.25rem;
    border-radius: 0.25rem;
}

@media (max-width: 1199.98px) {
    .receipt-paper {
        max-width: 360px;
        margin-inline: auto;
        font-size: 0.75rem;
    }

    .receipt-small,
    .receipt-break {
        font-size: 0.68rem;
    }
}
</style>