<template>
  <header
    class="w-full h-[64px] bg-white border-b border-gray-500 px-[24px] sticky md:static top-0
           flex justify-center md:justify-between items-center"
  >
    <div class="welcome text-[14px] font-normal hidden md:block">
      welcome
      <strong class="font-semibold">
        {{ userName }}
      </strong>
    </div>
    <div class="text-[16px] font-semibold py-2 px-3 bg-gray-100 rounded-sm">
      Arvancloud Challenge
    </div>

      <span class="hidden md:block">
        <app-button
          class="!w-fit h-[40px]"
          color="transparent"
          @click="handleLogout"
        >
          Log out
      </app-button>
    </span>
  </header>
</template>

<script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';

  import AppButton from '@/components/AppButton.vue';

  export default {
    name: 'app-header',
    components: {
      AppButton,
    },
    setup() {
      const store = useStore();
      const userName = ref(store.getters.userName);

      function handleLogout() {
        store.commit('clearUser');
      }
      return {
        userName,
        handleLogout,
      };
    },
  };
</script>
