<script lang="ts" setup>
import Loading from '@/components/Loading.vue';
import { DataService } from '@/services/data.service';
import { ref } from 'vue';

const cinemas = ref<any[]>()
DataService.getCinemas()
    .then(rsp => cinemas.value = rsp.data)

function remove(cinema: any) {
    if (!confirm(`Obrisi bioskop ${cinema.name}?`))
        return

    DataService.deleteCinemaById(cinema.cinemaId)
        .then(rsp => {
            cinemas.value = cinemas.value?.filter(c => c.cinemaId !== cinema.cinemaId)
        })
}
</script>

<template>
    <div class="card" v-if="cinemas">
        <div class="card-header fw-bold">
            Cinema List
        </div>
        <div class="card-body">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cinema in cinemas">
                        <th scope="row">{{ cinema.cinemaId }}</th>
                        <td>{{ cinema.name }}</td>
                        <td>{{ cinema.address }}</td>
                        <td>
                            <div class="btn-group">
                                <RouterLink :to="`/cinema/${cinema.cinemaId}`" class="btn btn-sm btn-success">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </RouterLink>
                                <button type="button" class="btn btn-sm btn-danger" @click="remove(cinema)">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card-footer">
            <RouterLink class="btn btn-sm btn-primary" to="/cinema/add">
                <i class="fa-solid fa-circle-plus"></i> Create Cinema
            </RouterLink>
        </div>
    </div>
    <Loading v-else />
</template>