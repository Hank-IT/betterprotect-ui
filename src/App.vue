<template>
    <MainView v-if="auth.authenticated" />
    <RouterView v-else />
</template>

<script setup lang="ts">
import MainView from '@/views/MainView.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>