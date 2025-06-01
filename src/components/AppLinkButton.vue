<template>
  <router-link
    :to="path"
    :class="linkButtonClasses"
    @click="handleButtonClick"
  >
    <slot></slot>
  </router-link>
</template>

<script>
  import { computed } from 'vue';

  export default {
    name: 'app-link-button',
    props: {
      shade: {
        type: String,
        default: 'base',
        validator: (value) => ['base', 'dark', 'deep', 'light'].includes(value),
      },
      path: {
        type: String,
        default: '',
      },
    },
    setup(props, context) {
      function handleButtonClick(event) {
        context.emit('on-click', event);
      }
      const linkButtonClasses = computed(() => ({
        'link-button': true,
        [`link-button-${props.shade}`]: true,
        'link-button--disabled': props.disabled,
      }));
      return {
        linkButtonClasses,
        handleButtonClick,
      };
    },
  };
</script>

<style lang="postcss" scoped>
  .link-button-light {
    @apply text-blue-100;
  }
  .link-button-base {
    @apply text-blue-300;
  }
  .link-button-dark {
    @apply text-blue-500;
  }
  .link-button-deep {
    @apply text-blue-700;
  }
  .link-button--disabled {
    @apply text-blue-100;
  }
</style>
