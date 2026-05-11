<script lang="ts" setup>
import Loading from '@/components/Loading.vue'
import type { MovieModel } from '@/models/movie.model'
import { DataService } from '@/services/data.service'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = Number(route.params.id)

const movie = ref<MovieModel>()

DataService.getMovieById(id)
  .then(rsp => {
    movie.value = rsp.data
  })

const formattedReleaseDate = computed(() => {
  if (!movie.value?.startDate) return 'N/A'

  return new Date(movie.value.startDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
})

const formattedRuntime = computed(() => {
  if (!movie.value?.runTime) return 'N/A'

  const hours = Math.floor(movie.value.runTime / 60)
  const minutes = movie.value.runTime % 60

  if (hours === 0) return `${minutes} min`
  if (minutes === 0) return `${hours}h`

  return `${hours}h ${minutes}min`
})

function formatScreeningTime(value: string) {
  if (!value) return 'N/A'

  const date = new Date(value)

  if (isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <Loading v-if="!movie" />

  <div v-else class="movie-details-page">
    <!-- Hero / Main Details -->
    <div class="card border-0 shadow-sm overflow-hidden mb-4">
      <div class="row g-0">
        <!-- Poster -->
        <div class="col-12 col-md-4 col-lg-3">
          <div class="poster-wrapper">
            <img
              :src="movie.poster"
              :alt="movie.title"
              class="movie-poster"
            />
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-12 col-md-8 col-lg-9">
          <div class="card-body p-4 p-lg-5">
            <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
              <div>
                <div class="mb-2">
                  <span
                    v-for="g in movie.movieGenres"
                    :key="g.movieGenreId"
                    class="badge rounded-pill text-bg-primary me-2 mb-2"
                  >
                    <i class="fa-solid fa-tag me-1"></i>
                    {{ g.genre.name }}
                  </span>
                </div>

                <h1 class="movie-title mb-1">
                  {{ movie.title }}
                </h1>

                <p
                  v-if="movie.originalTitle && movie.originalTitle !== movie.title"
                  class="text-muted mb-0"
                >
                  <i class="fa-solid fa-language me-2"></i>
                  {{ movie.originalTitle }}
                </p>
              </div>

              <div>
                <span
                  class="status-pill"
                  :class="movie.active ? 'status-active' : 'status-inactive'"
                >
                  <i
                    :class="movie.active ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"
                    class="me-2"
                  ></i>
                  {{ movie.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <p class="movie-description mb-4">
              {{ movie.description || movie.shortDescription }}
            </p>

            <!-- Info Cards -->
            <div class="row g-3 mb-4">
              <div class="col-12 col-sm-6 col-xl-3">
                <div class="info-box">
                  <div class="info-icon">
                    <i class="fa-solid fa-user-tie"></i>
                  </div>
                  <div>
                    <div class="info-label">Director</div>
                    <div class="info-value">{{ movie.director?.name || 'N/A' }}</div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6 col-xl-3">
                <div class="info-box">
                  <div class="info-icon">
                    <i class="fa-solid fa-calendar-days"></i>
                  </div>
                  <div>
                    <div class="info-label">Release Date</div>
                    <div class="info-value">{{ formattedReleaseDate }}</div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6 col-xl-3">
                <div class="info-box">
                  <div class="info-icon">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div>
                    <div class="info-label">Duration</div>
                    <div class="info-value">{{ formattedRuntime }}</div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-sm-6 col-xl-3">
                <div class="info-box">
                  <div class="info-icon">
                    <i class="fa-solid fa-ticket"></i>
                  </div>
                  <div>
                    <div class="info-label">Screenings</div>
                    <div class="info-value">
                      {{ movie.timeTables.length }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cast -->
            <div v-if="movie.movieActors.length > 0">
              <h5 class="section-title mb-3">
                <i class="fa-solid fa-users me-2"></i>
                Cast
              </h5>

              <div class="cast-list">
                <span
                  v-for="a in movie.movieActors"
                  :key="a.movieActorId"
                  class="cast-chip"
                >
                  <i class="fa-solid fa-user me-2"></i>
                  {{ a.actor.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Screenings -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div>
            <h4 class="mb-1">
              <i class="fa-solid fa-film me-2 text-primary"></i>
              Screenings
            </h4>
            <p class="text-muted mb-0">
              Available cinema times for this movie
            </p>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="movie.timeTables.length === 0"
          class="empty-state text-center py-5"
        >
          <div class="empty-icon mb-3">
            <i class="fa-solid fa-calendar-xmark"></i>
          </div>

          <h5 class="mb-2">No screenings available</h5>

          <p class="text-muted mb-0">
            There are currently no scheduled screenings for this movie.
          </p>
        </div>

        <!-- Table for md+ -->
        <div v-else class="table-responsive d-none d-md-block">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th>
                  <i class="fa-solid fa-building me-2"></i>
                  Cinema
                </th>
                <th>
                  <i class="fa-solid fa-calendar-clock me-2"></i>
                  Start Time
                </th>
                <th>
                  <i class="fa-solid fa-money-bill-wave me-2"></i>
                  Price
                </th>
                <th class="text-end">
                  Options
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="tt in movie.timeTables"
                :key="tt.timeTableId"
              >
                <td class="fw-semibold">
                  {{ tt.cinema.name }}
                </td>

                <td>
                  {{ formatScreeningTime(tt.startTime) }}
                </td>

                <td>
                  {{ tt.price }} RSD
                </td>

                <td class="text-end">
                  <button class="btn btn-sm btn-primary">
                    <i class="fa-solid fa-ticket-simple me-1"></i>
                    Order
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Cards for mobile -->
        <div class="d-md-none">
          <div
            v-for="tt in movie.timeTables"
            :key="tt.timeTableId"
            class="screening-card"
          >
            <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
              <div>
                <div class="screening-cinema">
                  <i class="fa-solid fa-building me-2"></i>
                  {{ tt.cinema.name }}
                </div>

                <div class="screening-time">
                  <i class="fa-solid fa-clock me-2"></i>
                  {{ formatScreeningTime(tt.startTime) }}
                </div>
              </div>

              <div class="screening-price">
                {{ tt.price }} RSD
              </div>
            </div>

            <button class="btn btn-primary w-100 mt-2">
              <i class="fa-solid fa-ticket-simple me-1"></i>
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-details-page {
  padding-bottom: 2rem;
}

.poster-wrapper {
  height: 100%;
  min-height: 420px;
  background: #f1f3f5;
}

.movie-poster {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  display: block;
}

.movie-title {
  font-weight: 800;
  letter-spacing: -0.04em;
}

.movie-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #495057;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.status-active {
  color: #198754;
  background: rgba(25, 135, 84, 0.1);
}

.status-inactive {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.info-box {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.075);
  border-radius: 1rem;
  padding: 1rem;
  background: #fff;
}

.info-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.85rem;
  color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.1);
}

.info-label {
  color: #6c757d;
  font-size: 0.8rem;
  line-height: 1.2;
}

.info-value {
  font-weight: 700;
  color: #212529;
}

.section-title {
  font-weight: 700;
}

.cast-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cast-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  background: #f8f9fa;
  color: #343a40;
  font-size: 0.9rem;
}

.empty-state {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 1rem;
  background: #f8f9fa;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #6c757d;
  background: #fff;
  font-size: 1.75rem;
}

.screening-card {
  border: 1px solid rgba(0, 0, 0, 0.075);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: #fff;
}

.screening-cinema {
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.screening-time {
  color: #6c757d;
  font-size: 0.95rem;
}

.screening-price {
  font-weight: 800;
  color: var(--bs-primary);
  white-space: nowrap;
}

@media (max-width: 767.98px) {
  .poster-wrapper,
  .movie-poster {
    min-height: 360px;
    max-height: 520px;
  }

  .movie-title {
    font-size: 2rem;
  }
}
</style>