<template>
  <aside class="md:min-w-[240px] border h-[100dvh]">
    <nav class="p-4 text-start">
      <ul>
        <li class="flex w-full" v-for="item in sidebarItems" :key="item.title">
          <router-link :to="item.link" class="w-full mb-1 p-2 text-[16px] text-semibold">
            {{item.title}}
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'app-sidebar',
  setup() {
    const sidebarItems = ref([
      {
        title: 'All Articles',
        link: '/articles'
      },
      {
        title: 'New Article',
        link: '/articles/create'
      }
    ])

    return {
      sidebarItems
    }
  }
}
</script>

<style scoped>
.router-link-exact-active{
  @apply text-green-300 bg-green-50;
}
</style>