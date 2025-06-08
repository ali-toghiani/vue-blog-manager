<template>
  <table class="article-table w-full hidden md:table text-start text-base">
    <thead>
      <tr class="bg-gray-300 h-[40px] py-1">
        <th
          v-for="header in headers"
          :key="header"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-if="list.length > 0">
        <tr
          class="h-[48px] border-b"
          v-for="(row, index) in list"
          :key="index"
        >
          <slot
            default
            :row="row"
            :index="index"
          ></slot>
        </tr>
      </template>
      <tr v-else>
        <td :colspan="headers.length">
          <div
            v-if="loading"
            class="loading-list-container w-full min-h-[250px] flex flex-col justify-center items-center"
          >
            <spinner-icon class="spinner fill-green-500 w-[45px] h-[45px] mb-6"/>
            <p class="">Fetching Data ...</p>
          </div>

          <div
            v-else-if="list.length === 0"
            class="empty-list-container w-full min-h-[250px] flex flex-col justify-center items-center"
          >
            <inbox-icon class="fill-green-300 w-[45px] h-[45px] mb-6"/>
            <p class="">No Data to Show</p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import InboxIcon from '@/assets/icons/InboxIcon.vue';
import SpinnerIcon from '@/assets/icons/SpinnerIcon.vue';

  export default {
    name: 'app-table',
    components: {
      SpinnerIcon,
      InboxIcon
    },
    props: {
      headers: {
        type: Array,
        default: () => [],
        validator: (arr) => arr.every((item) => typeof item === 'string'),
        required: true,
      },
      list: {
        type: Array,
        required: true,
        default: () => [],
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style scoped>
table
  th {
    @apply text-[18px] font-semibold text-start;
    &:first-child{
      @apply px-4;
    }
    &:last-child{
      @apply px-4
    }
  }
  tbody tr:deep(td) {
    @apply px-2;
    &:first-child{
      @apply ps-0;
    }
  }
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
