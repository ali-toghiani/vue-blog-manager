<template>
  <div
    class="main-container h-[100dvh] w-full flex flex-col justify-center items-center"
  >
    <warning-icon class="fill-golden-state w-[60px] h-[60px] mb-4" />
    <h1 class="text-[45px] font-bold text-golden-state">404 Not Found</h1>
    <app-link-button path="/articles">Go Back</app-link-button>
  </div>
</template>

<script>
  import WarningIcon from '@/assets/icons/WarningIcon.vue';
  import AppLinkButton from '@/components/AppLinkButton.vue';

  export default {
    components: {
      AppLinkButton,
      WarningIcon,
    },
  };
</script>
