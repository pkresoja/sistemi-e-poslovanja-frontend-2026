<script lang="ts" setup>
import { DataService } from '@/services/data.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const code = ref<number>()
const router = useRouter()
const email = sessionStorage.getItem('verify_email')

function verify() {
    if (code.value == null) {
        alert('Code cant be empty')
        return
    }

    DataService.verifyEmail(code.value)
        .then(rsp => router.push('/login'))
}
</script>

<template>
    <div class="card crud-container">
        <div class="card-header fw-bold">Email Verification</div>
        <div class="card-body">
            <div class="alert alert-warning" role="alert">
                The verification code has been sent to {{ email ?? 'your email' }} address!
            </div>
            <div class="mb-3">
                <label for="code" class="form-label">Verification Code:</label>
                <input type="number" class="form-control" id="pass" v-model="code">
            </div>
        </div>
        <div class="card-footer">
            <div class="btn-group">
                <button type="button" class="btn btn-success" @click="verify">
                    <i class="fa-solid fa-arrow-right-to-bracket"></i> Verify and Go to Login
                </button>
            </div>
        </div>
    </div>
</template>