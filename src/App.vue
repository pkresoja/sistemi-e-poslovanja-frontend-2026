<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useLogout } from './hooks/logout.hook';
import { AuthService } from './services/auth.service';

const year = new Date().getFullYear()
const logout = useLogout()
const route = useRoute()
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">
        <i class="fa-brands fa-typescript"></i> Praktikum 2026
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">
              <i class="fa-solid fa-house"></i> Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/cinema">
              <i class="fa-solid fa-building"></i> Cinemas
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/time-table/add">
              <i class="fa-solid fa-clock-rotate-left"></i> Add Time Table
            </RouterLink>
          </li>
          <template v-if="AuthService.hasAuth()">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/cart">
                <i class="fa-solid fa-cart-shopping"></i> Cart
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/user">
                <i class="fa-solid fa-user"></i> User
              </RouterLink>
            </li>
            <li class="nav-item">
              <button class="nav-link" type="button" @click="logout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> Login
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">
                <i class="fa-solid fa-user-plus"></i> Signup
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container mt-3">
    <RouterView :key="route.fullPath" />
    <footer class="text-center my-3">
      &copy; {{ year }} Univerzitet Singidunum
    </footer>
  </div>
</template>

<style scoped></style>
