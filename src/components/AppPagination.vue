<template>
  <div class="pagination">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      <arrow-right-icon class="rotate-180" />
    </button>

    <button
      v-if="currentPage > 2"
      @click="changePage(1)"
      :class="{ active: currentPage === 1 }"
    >
      1
    </button>

    <button
      v-if="currentPage > 3"
      @click="showMoreBefore"
      class="ellipsis"
    >
      ...
    </button>

    <button
      v-if="currentPage > 1"
      @click="changePage(currentPage - 1)"
      :class="{ active: currentPage === currentPage - 1 }"
    >
      {{ currentPage - 1 }}
    </button>

    <button
      @click="changePage(currentPage)"
      class="active"
    >
      {{ currentPage }}
    </button>

    <button
      v-if="currentPage < totalPagesValue"
      @click="changePage(currentPage + 1)"
      :class="{ active: currentPage === currentPage + 1 }"
    >
      {{ currentPage + 1 }}
    </button>

    <button
      v-if="currentPage < totalPagesValue - 2"
      @click="showMoreAfter"
      class="ellipsis"
    >
      ...
    </button>

    <button
      v-if="currentPage < totalPagesValue - 1 && totalPagesValue > 1"
      @click="changePage(totalPagesValue)"
      :class="{ active: currentPage === totalPagesValue }"
    >
      {{ totalPagesValue }}
    </button>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPagesValue"
    >
      <arrow-right-icon />
    </button>
  </div>
</template>

<script>
  import { defineComponent, ref, computed } from 'vue';

  import ArrowRightIcon from '@/assets/icons/ArrowRightIcon.vue';

  export default defineComponent({
    name: 'AppPagination',
    components: {
      ArrowRightIcon,
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

      const totalPagesValue = computed(() =>
        Math.ceil(props.total / props.pageSize)
      );

      const changePage = (page) => {
        if (page > 0 && page <= totalPagesValue.value) {
          currentPage.value = page;
          emit('page-changed', page);
        }
      };

      const showMoreBefore = () => {
        const newPage = Math.max(2, Math.floor(currentPage.value / 2));
        changePage(newPage);
      };

      const showMoreAfter = () => {
        const newPage = Math.min(
          totalPagesValue.value - 1,
          Math.ceil((currentPage.value + totalPagesValue.value) / 2)
        );
        changePage(newPage);
      };

      return {
        currentPage,
        totalPagesValue,
        changePage,
        showMoreBefore,
        showMoreAfter,
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

  .pagination button.ellipsis {
    @apply cursor-pointer;
  }
</style>
