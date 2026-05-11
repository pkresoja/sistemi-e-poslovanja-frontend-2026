<script lang="ts" setup>
import { DataService } from '@/services/data.service';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = Number(route.params.id)

const cinema = ref<any>()
DataService.getCinemaById(id)
    .then(rsp => cinema.value = rsp.data)
</script>

<template>
    <div class="card">
        <div class="card-header fw-bold">
            Edit Cinema
        </div>
        <div class="card-body">
            <pre>{{ cinema }}</pre>
        </div>
        <div class="card-footer"></div>
    </div>
</template>