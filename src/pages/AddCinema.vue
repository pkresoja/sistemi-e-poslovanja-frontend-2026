<script lang="ts" setup>
import { CinemaService } from '@/services/cinema.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const cinema = ref({
    name: '',
    address: ''
})

function update() {
    if (!confirm('Save changes?'))
        return

    CinemaService.createCinema(cinema.value)
        .then(rsp => router.push('/cinema'))
}
</script>

<template>
    <div class="card crud-container">
        <div class="card-header fw-bold">
            Create Cinema
        </div>
        <div class="card-body">
            <div class="mb-3">
                <label for="name" class="form-label">Name:</label>
                <input type="text" class="form-control" id="name" v-model="cinema.name">
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Address:</label>
                <input type="text" class="form-control" id="address" v-model="cinema.address">
            </div>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-success" @click="update">
                <i class="fa-solid fa-floppy-disk"></i> Save
            </button>
        </div>
    </div>
</template>