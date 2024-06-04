<template>
  <li class="overflow-hidden rounded-xl border border-gray-200">
    <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
      <div class="text-sm font-medium leading-6 text-gray-900">{{ server.hostname }}</div>
      <div class="relative ml-auto">
        <div class="-m-2.5 block p-2.5 text-red-400 hover:text-red-500">
          4 alerts
        </div>
      </div>
    </div>
    <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="text-gray-500">Policy push</dt>
        <dd class="text-gray-700">
          <time :datetime="server.last_policy_install">{{ server.last_policy_install }}</time>
        </dd>
      </div>
      <div class="flex justify-between gap-x-4 py-3">
        <dt class="text-gray-500">Queue</dt>
        <dd class="text-gray-700">
          4 items
        </dd>
      </div>
      <div class="flex justify-end gap-x-4 py-3">
        <button type="button" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Edit</button>
        <button type="button" class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Delete</button>
      </div>
    </dl>
  </li>
</template>

<script setup lang="ts">
import {ServerResource} from '@/api/requests/servers/ServerIndexRequest.ts'

defineProps({
  server: ServerResource,
})
</script>


<style scoped>

</style>