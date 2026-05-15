<script lang="ts" setup>
import { DataService } from '@/services/data.service';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const payload = ref({
    firstName: '',
    lastName: '',
    gender: 'm',
    email: '',
    password: '',
    repeat: ''
})

function signup() {
    if (payload.value.email == '' || payload.value.password == '')
        return

    if (payload.value.firstName == '' || payload.value.lastName == '')
        return

    if (payload.value.repeat !== payload.value.password)
        return

    DataService.register(payload.value)
        .then(rsp => {
            sessionStorage.setItem('verify_email', payload.value.email)
            router.push('/verify')
        })
}
</script>

<template>
    <div class="card crud-container">
        <div class="card-header fw-bold">Signup</div>
        <div class="card-body">
            <div class="mb-3">
                <label for="first" class="form-label">First Name:</label>
                <input type="text" class="form-control" id="first" v-model="payload.firstName">
            </div>
            <div class="mb-3">
                <label for="last" class="form-label">Last Name:</label>
                <input type="text" class="form-control" id="last" v-model="payload.lastName">
            </div>
            <div class="mb-3">
                <label for="gender" class="form-label">Gender:</label>
                <select class="form-select" id="gender" v-model="payload.gender">
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email:</label>
                <input type="email" class="form-control" id="email" v-model="payload.email">
            </div>
            <div class="mb-3">
                <label for="pass" class="form-label">Password:</label>
                <input type="password" class="form-control" id="pass" v-model="payload.password">
            </div>
            <div class="mb-3">
                <label for="rep" class="form-label">Repeat Password:</label>
                <input type="password" class="form-control" id="rep" v-model="payload.repeat">
            </div>
        </div>
        <div class="card-footer">
            <div class="btn-group">
                <button type="button" class="btn btn-success" @click="signup">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Signup
                </button>
                <RouterLink to="/login" class="btn btn-secondary">
                    <i class="fa-solid fa-arrow-right-to-bracket"></i> I already have an account
                </RouterLink>
            </div>
        </div>
    </div>
</template>