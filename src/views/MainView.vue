<template>
    <NavSidebar/>

    <div class="lg:pl-72">
        <NavTopbar/>

        <main class="py-5">
            <div class="px-4 sm:px-6 lg:px-8">
                <RouterView/>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import NavSidebar from '@/components/NavSidebar.vue'
import NavTopbar from '@/components/NavTopbar.vue'
</script>
