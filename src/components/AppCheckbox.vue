<template>
  <div class="flex items-center gap-x-2">
    <div class="relative flex items-center">
      <input
        type="checkbox"
        :id="id"
        :value="value"
        :checked="modelValue"
        @input="updateCheckbox"
        class="absolute opacity-0 w-5 h-5 cursor-pointer"
      />
      <span
        class="custom-checkbox w-[16px] h-[16px] border-2 rounded-sm flex items-center justify-center"
        :class="[
          modelValue ? 'bg-green-300 border-green-300' : 'border-gray-600',
          error ? '!border-red-500' : '',
        ]"
      >
        <svg
          v-if="modelValue"
          class="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
    </div>
    <label
      :for="id"
      class="cursor-pointer"
    >
      {{ label }}
    </label>
  </div>
</template>

<script>
  export default {
    name: 'app-checkbox',
    props: {
      id: {
        type: String,
        required: true,
      },
      value: {
        type: [String, Number, Object],
        required: true,
      },
      modelValue: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        default: '',
      }
    },
    setup(props, context){
      function updateCheckbox(event){
        context.emit('update:modelValue', event.target.checked);
      }
      return {updateCheckbox}
    }
  };
</script>

<style scoped>
  .custom-checkbox {
    @apply transition-colors duration-200;
  }

  input:checked + .custom-checkbox {
    @apply bg-green-300 border-green-300;
  }
</style>
