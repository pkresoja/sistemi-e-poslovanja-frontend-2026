<script lang="ts" setup>
import Loading from '@/components/Loading.vue';
import { useLogout } from '@/hooks/logout.hook';
import type { CinemaModel } from '@/models/cinema.model';
import { CinemaService } from '@/services/cinema.service';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const logout = useLogout()
const id = Number(route.params.id)

const cinema = ref<CinemaModel>()
CinemaService.getCinemaById(id)
    .then(rsp => cinema.value = rsp.data)
    .catch(e => logout(e))

function update() {
    if (!confirm('Save changes?'))
        return

    CinemaService.updateCinema(id, cinema.value)
        .then(rsp => router.push('/cinema'))
}
</script>

<template>
    <div class="card crud-container" v-if="cinema">
        <div class="card-header fw-bold">
            Edit Cinema
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
    <Loading v-else />
</template>