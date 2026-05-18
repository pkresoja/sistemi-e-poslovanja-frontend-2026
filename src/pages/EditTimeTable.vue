<script lang="ts" setup>
import Loading from '@/components/Loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { CinemaModel } from '@/models/cinema.model';
import type { MovieModel } from '@/models/movie.model';
import type { TimeTableModel } from '@/models/time.model';
import { CinemaService } from '@/services/cinema.service';
import { MovieService } from '@/services/movie.service';
import { TimeTableService } from '@/services/time.service';
import { ref } from 'vue';

import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const logout = useLogout()
const id = Number(route.params.id)

const timeTable = ref<TimeTableModel>()
TimeTableService.getById(id)
    .then(rsp => timeTable.value = rsp.data)
    .catch(e => logout(e))

const cinemas = ref<CinemaModel[]>()
CinemaService.getCinemas()
    .then(rsp => cinemas.value = rsp.data)
    .catch(e => logout(e))

const movies = ref<MovieModel[]>()
MovieService.getAllMovies()
    .then(rsp => movies.value = rsp.data)

function update() {
    if (!confirm('Save changes?'))
        return

    TimeTableService.update(id, timeTable.value)
        .then(rsp => router.push(`/details/${timeTable.value?.movieId}`))
}
</script>

<template>
    <div class="card crud-container" v-if="timeTable && cinemas && movies">
        <div class="card-header fw-bold">
            Edit Time Table
        </div>
        <div class="card-body">
            <div class="mb-3">
                <label for="cinema" class="form-label">Cinema:</label>
                <select class="form-select" id="cinema" v-model="timeTable.cinemaId">
                    <option v-for="c in cinemas" :value="c.cinemaId">
                        {{ c.name }} ({{ c.address }})
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label for="movie" class="form-label">Movie:</label>
                <select class="form-select" id="movie" v-model="timeTable.movieId">
                    <option v-for="m in movies" :value="m.movieId">
                        {{ m.movieId }} {{ m.title }}
                    </option>
                </select>
            </div>
            <div class="mb-3">
                <label for="name" class="form-label">Start Time:</label>
                <input type="time" class="form-control" id="name" v-model="timeTable.startTime">
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Price:</label>
                <input type="number" class="form-control" id="address" v-model="timeTable.price">
            </div>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-success" @click="update">
                <i class="fa-solid fa-floppy-disk"></i> Save
            </button>
        </div>
    </div>
    <Loading v-else />
</template>