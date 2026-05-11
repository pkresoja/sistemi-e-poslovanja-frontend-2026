<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';

const data = ref<any>()
axios.get('http://localhost:3300/')
    .then(rsp => data.value = rsp.data)
</script>

<template>
    Ovo je about stranica!
    <pre>{{ data }}</pre>
</template>