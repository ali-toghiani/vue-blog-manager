<template>
  <ul class="menu">
    <li class="menu-item"
        v-for="item in items" :key="item.key" @click="handleItemClick(item)">
      {{ item.title }}
    </li>
  </ul>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MenuItem',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (items) =>
        items.every(
          (item) =>
            typeof item.title === 'string' &&
            typeof item.key === 'string' &&
            (item.path === undefined || typeof item.path === 'string')
        ),
    },
  },
  emits: ['select'],
  setup(props, context) {
    const router = useRouter();

    const handleItemClick = (item) => {
      context.emit('select', item.key);
      if (item.path) {
        router.push(item.path);
      }
    };

    return {
      handleItemClick,
    };
  },
});
</script>

<style scoped>
.menu {
  @apply hidden absolute bg-white z-10 right-0 min-w-[160px] rounded-xl p-0 m-0 list-none text-start;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}
.menu-item:first-child {
  @apply rounded-t-xl;
}
.menu-item:last-child {
  @apply rounded-b-xl;
}
.menu-item {
  @apply text-[14px] font-normal cursor-pointer px-[16px] py-[12px];
  transition: background-color 0.2s;
}
.menu-item:hover {
  @apply bg-gray-300;
}
</style>