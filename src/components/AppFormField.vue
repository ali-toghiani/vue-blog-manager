<template>
  <div class="form-group flex flex-col items-start w-full">
    <div class="label-container flex flex-col items-start w-full gap-y-[8px]">
      <label
        class="text-[14px] font-base"
        v-if="label"
        :for="id"
      >
        {{ label }}
        <span
          v-if="required"
          class="text-red-500"
        >
          *
        </span>
      </label>
      <div
        :class="[
          'field-input-container min-h-[40px] w-full',
          { 'field-input-container--error': error },
        ]"
      >
        <slot>
          <app-replacer></app-replacer>
        </slot>
      </div>
    </div>
    <p
      v-if="error"
      class="error text-red-500 text-[12px] font-semibold"
    >
      {{ Array.isArray(error) ? error[0] : error }}
    </p>
  </div>
</template>

<script>
  import AppReplacer from '@/components/AppReplacer.vue';

  export default {
    name: 'form-field',
    components: {
      AppReplacer,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        default: '',
      },
      error: {
        type: String,
        default: '',
      },
      required: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style scoped>
  .field-input-container :deep(input),
  .field-input-container--error :deep(textarea) {
    @apply w-full rounded-md mb-1 p-2 border border-gray-500;
  }

  .field-input-container--error :deep(input),
  .field-input-container--error :deep(textarea) {
    @apply border-[2px] !border-red-500;
  }
</style>
