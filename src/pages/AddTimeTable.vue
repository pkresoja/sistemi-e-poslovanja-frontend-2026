<script lang="ts" setup>
import Loading from '@/components/Loading.vue';
import type { CinemaModel } from '@/models/cinema.model';
import type { MovieModel } from '@/models/movie.model';
import { CinemaService } from '@/services/cinema.service';
import { MovieService } from '@/services/movie.service';
import { TimeTableService } from '@/services/time.service';
import { ref } from 'vue';

import { useRouter } from 'vue-router';

const router = useRouter()

const timeTable = ref({
    cinemaId: 0,
    movieId: 0,
    startTime: "21:00",
    price: 3200
})

const cinemas = ref<CinemaModel[]>()
CinemaService.getCinemas()
    .then(rsp => {
        cinemas.value = rsp.data
        timeTable.value.cinemaId = rsp.data[0]!.cinemaId
    })

const movies = ref<MovieModel[]>()
MovieService.getAllMovies()
    .then(rsp => {
        movies.value = rsp.data
        timeTable.value.movieId = rsp.data[0]!.movieId
    })

function update() {
    if (!confirm('Save changes?'))
        return

    TimeTableService.create(timeTable.value)
        .then(rsp => router.push(`/details/${timeTable.value?.movieId}`))
}
</script>

<template>
    <div class="card crud-container" v-if="cinemas && movies">
        <div class="card-header fw-bold">
            Add Time Table
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