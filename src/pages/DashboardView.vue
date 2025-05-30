<template>
  <app-header></app-header>
  <div class="contenct-container flex">
    <app-sidebar></app-sidebar>
    <div class="router-view-container md:p-6 bg-gray-300 w-full">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/layout/AppHeader.vue';
import AppSidebar from '@/layout/AppSidebar.vue';

export default {
  name: 'app-dashaobrd-view',
  components: {
    AppHeader,
    AppSidebar
  }
}
</script> 