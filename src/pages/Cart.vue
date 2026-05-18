<script lang="ts" setup>
import { useLogout } from '@/hooks/logout.hook';
import { DataService } from '@/services/data.service';
import { ref } from 'vue';

const logout = useLogout()
const cartItems = ref<any[]>()

DataService.useAxios('/invoice/cart')
    .then(rsp => cartItems.value = rsp.data)
    .catch(e => logout(e))
</script>

<template>
    <div class="card">
        <div class="card-header fw-bold">Items in Cart</div>
        <div class="card-body">
            <pre>{{ cartItems }}</pre>
        </div>
    </div>
</template>