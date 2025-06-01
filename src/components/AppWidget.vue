<template>
  <main class="bg-white rounded-md">
    <h2 class="text-start text-[18px] font-semibold ps-6 py-[38px]">
      {{ title }}
    </h2>
    <hr />

    <slot>
      <app-replacer></app-replacer>
    </slot>
  </main>
</template>

<script>
  import AppReplacer from '@/components/AppReplacer.vue';

  export default {
    name: 'app-widget',
    components: {
      AppReplacer,
    },
    props: {
      title: {
        type: String,
        required: true,
      },
    },
  };
</script>
