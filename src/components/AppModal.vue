<template>
  <div
    @click="handleClose"
    :class="isOpen ? 'block' : 'hidden'"
  ></div>
  <dialog
    class="p-0"
    :open="isOpen"
  >
    <header>
      <h2 class="text-start text-[18px] font-semibold px-6 py-4">
        {{ title }}
      </h2>
      <hr />
    </header>
    <slot default></slot>
    <hr />
    <menu class="flex gap-x-4">
      <slot name="actions">
        <app-button
          class="!w-fit"
          color="transparent"
          @click="$emit('close')"
        >
          Cancel
        </app-button>
      </slot>
    </menu>
  </dialog>
</template>

<script>
  import { ref } from 'vue';

  import AppButton from '@/components/AppButton.vue';

  export default {
    props: {
      title: {
        type: String,
        required: false,
      },
    },
    emits: ['close'],
    components: {
      AppButton,
    },
    setup(props,context) {
      const isOpen = ref(true);

      function handleClose() {
        context.emit('close');
        isOpen.value = false;
      }

      return {
        isOpen,
        handleClose,
      };
    },
  };
</script>

<style scoped>
  div {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }

  dialog {
    position: fixed;
    top: 20vh;
    left: 10%;
    width: 80%;
    z-index: 100;
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  menu {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    margin: 0;
  }

  @media (min-width: 768px) {
    dialog {
      left: calc(50% - 20rem);
      width: 40rem;
    }
  }
</style>
