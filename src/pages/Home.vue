<script setup lang="ts">
import Loading from '@/components/Loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { CinemaModel } from '@/models/cinema.model';
import type { TimeTableModel } from '@/models/time.model';
import router from '@/router';
import { CinemaService } from '@/services/cinema.service';
import { InvoiceService } from '@/services/invoice.service';
import { TimeTableService } from '@/services/time.service';
import { onMounted, ref } from 'vue';

const logout = useLogout()
const cinemas = ref<CinemaModel[]>()

function loadData() {
    CinemaService.getCinemasWithTimeTables()
        .then(rsp => cinemas.value = rsp.data)
        .catch(e => logout(e))
}

function remove(timeTable: TimeTableModel) {
    if (!confirm(`Obrisi projekciju za ${timeTable.movie.title} u ${timeTable.startTime}h ?`))
        return

    TimeTableService.deleteById(timeTable.timeTableId)
        .then(rsp => loadData())
        .catch(e => logout(e))
}

function addToCart(timeTableId: number) {
    if (!confirm(`Dodaj u korpu?`))
        return

    InvoiceService.addTimeTableByIdToCart(timeTableId)
        .then(() => router.push('/cart'))
        .catch(e => logout(e))
}

onMounted(() => loadData())
</script>

<template>
    <div class="card mb-3" v-if="cinemas" v-for="cinema in cinemas">
        <div class="card-header fw-bold">
            {{ cinema.name }} ({{ cinema.address }})
        </div>
        <div class="card-body table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th class="movie" scope="col">Movie</th>
                        <th class="director" scope="col">Director</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">Price</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="timeTable in cinema.timeTables">
                        <th scope="row">{{ timeTable.timeTableId }}</th>
                        <td class="movie">{{ timeTable.movie.title }}</td>
                        <td class="director">{{ timeTable.movie.director.name }}</td>
                        <td>{{ timeTable.movie.runTime }} min</td>
                        <td>{{ timeTable.startTime.slice(0,5) }}h</td>
                        <td>{{ timeTable.price }} RSD</td>
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-primary"
                                    @click="addToCart(timeTable.timeTableId)">
                                    <i class="fa-solid fa-cart-arrow-down"></i>
                                </button>
                                <RouterLink class="btn btn-sm btn-secondary" :to="`/details/${timeTable.movieId}`">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </RouterLink>
                                <RouterLink class="btn btn-sm btn-success" :to="`/time-table/${timeTable.timeTableId}`">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </RouterLink>
                                <button type="button" class="btn btn-sm btn-danger" @click="remove(timeTable)">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Loading v-else />
</template>

<style scoped>
.movie {
    width: 360px;
}

.director {
    width: 200px;
}
</style>