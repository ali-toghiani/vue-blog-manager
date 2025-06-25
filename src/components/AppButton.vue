<template>
  <button
    :class="buttonClasses"
    :disabled="loading"
  >
    <slot></slot>
    <div
      v-if="loading"
      class="spinner w-[15px] h-[15px]"
    >
      <spinner-icon class="fill-white"/>
    </div>
  </button>
</template>

<script>
  import { computed } from 'vue';
  
  import SpinnerIcon from '@/assets/icons/SpinnerIcon.vue';

  export default {
    name: 'app-button',
    components: {
      SpinnerIcon,
    },
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      shade: {
        type: String,
        default: 'base',
        validator: (value) => ['base', 'dark', 'deep'].includes(value),
      },
      color: {
        type: String,
        default: 'green',
        validator: (value) => ['green', 'red', 'transparent'].includes(value),
      },
    },
    setup(props) {
      const buttonClasses = computed(() => ({
        button: true,
        [`button-${props.color}`]: true,
        [`button-${props.color}-${props.shade}`]: props.color !== 'black-outline',
        'button--disabled': props.disabled,
        'button--loading': props.loading,
        'button-black-outline':
          props.color === 'black-outline' && !props.disabled,
      }));
      return {
        buttonClasses,
      };
    },
  };
</script>

<style lang="postcss" scoped>
  .button {
    @apply px-4 py-2 rounded-lg font-semibold text-[14px] w-full flex justify-center items-center gap-[10px];
  }
  .button-green {
    @apply h-[40px] text-white;
  }
  .button-green-base {
    @apply bg-green-300 hover:bg-green-300;
  }
  .button-green-dark {
    @apply bg-green-500 hover:bg-green-500;
  }
  .button-green-deep {
    @apply bg-green-700 hover:bg-green-700;
  }
  .button-red {
    @apply text-white;
  }
  .button-red-base {
    @apply bg-red-300 hover:bg-red-300;
  }
  .button-red-dark {
    @apply bg-red-500 hover:bg-red-500;
  }
  .button-red-deep {
    @apply bg-red-700 hover:bg-red-700;
  }
  .button-transparent {
    @apply bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100;
  }
  .button--disabled {
    @apply bg-opacity-40 cursor-not-allowed;
  }
  .button--loading {
    @apply bg-opacity-40 cursor-wait !important;
  }
</style>
