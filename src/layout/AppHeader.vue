<template>
  <header class="w-full md:h-[64px] bg-white flex justify-between items-center border-b border-gray-500 px-[24px]">
     <div class="welcome text-[14px] font-normal">
      welcome
      <strong class="font-semibold">
        {{userName}}
      </strong>
     </div>
     <div class="text-[16px] font-semibold py-2 px-3 bg-gray-100 rounded-sm">Arvancloud Challenge</div>
     <app-button class="!w-fit h-[40px]" color="transparent">Log out</app-button>
  </header>
</template>

<script>
import AppButton from '@/components/AppButton.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'app-header',
  components: { 
    AppButton
  },
  setup(){
    const store = useStore();
    const userName = ref(store.getters.userName);

    return {
      userName
    }
  }
}
</script>