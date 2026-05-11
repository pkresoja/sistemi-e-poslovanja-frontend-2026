<script setup lang="ts">
const year = new Date().getFullYear()
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
            <RouterLink class="nav-link" to="/about">
              <i class="fa-solid fa-star"></i> About
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/cinema">
              <i class="fa-solid fa-building"></i> Cinemas
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container mt-3">
    <RouterView />
    <footer class="text-center my-3">
      &copy; {{ year }} Univerzitet Singidunum
    </footer>
  </div>
</template>

<style scoped></style>
