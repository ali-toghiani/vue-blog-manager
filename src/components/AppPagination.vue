<template>
  <div class="pagination">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      <arrow-right-icon class="rotate-180" />
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      @click="changePage(page)"
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </button>
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      <arrow-right-icon />
    </button>
  </div>
</template>

<script>
  import ArrowRightIcon from '@/assets/icons/ArrowRightIcon.vue';
import { defineComponent, ref, computed } from 'vue';

  export default defineComponent({
    name: 'AppPagination',
    components: {
      ArrowRightIcon
    },
    props: {
      total: {
        type: Number,
        required: true,
      },
      pageSize: {
        type: Number,
        default: 10,
      },
    },
    setup(props, { emit }) {
      const currentPage = ref(1);

      const totalPages = computed(() =>
        Math.ceil(props.total / props.pageSize)
      );

      const changePage = (page) => {
        if (page > 0 && page <= totalPages.value) {
          currentPage.value = page;
          emit('page-changed', page);
        }
      };

      return {
        currentPage,
        totalPages,
        changePage,
      };
    },
  });
</script>

<style scoped>
  .pagination {
    @apply flex justify-center items-center border rounded-lg py-[4px] w-fit;
  }
  .pagination button {
    @apply w-[32px] h-[32px] flex items-center justify-center;
  }
  .pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .pagination button.active {
    @apply text-white bg-green-300 rounded-lg;
  }
</style>
