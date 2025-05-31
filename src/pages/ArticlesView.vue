<template>
  <app-widget title="All Posts">
    <div class="table-container p-6 flex flex-col items-end">
      <table class="article-table w-full">
        <thead>
          <tr class="bg-gray-300 h-[40px] py-1">
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Tags</th>
            <th>Excerpt</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="h-[48px] border-b"
            v-for="(article, index) in articles"
            :key="index"
          >
            <td>
              <div
                class="order-container rounded-sm bg-gray-100 w-[32px] h-[32px] ms-1 flex justify-center items-center"
              >
                {{ index + 1 }}
              </div>
            </td>
            <td
              class="title-cell"
              :title="article.title || 'No title'"
            >
              <strong class="truncate">{{ article.title }}</strong>
            </td>
            <td>
              {{ article.author.username }}
            </td>
            <td>
              <app-link-button
                v-for="tag in article.tagList"
                :key="tag"
                :path="'/articles?=' + tag"
              >
                #{{ tag }}
              </app-link-button>
            </td>
            <td>
              {{ formatBody(article.body) }}
            </td>
            <td>{{ formatDate(article.createdAt) }}</td>
            <td>
              <div class="dropdown">
                <app-button
                  color="transparent"
                  class="!w-[40px] !h-[40px] !p-[10px]"
                >
                  <dots-icon />
                </app-button>
                <app-menu
                  @select="setItemToDelete(article.slug)"
                  class="dropdown-content"
                  :items="contextMenuItems"
                ></app-menu>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <app-pagination
        class="mt-6"
        :total="100"
      ></app-pagination>
    </div>
  </app-widget>
  <app-modal
    title="Delete"
    @delete="handleDelete"
    v-if="showDeleteModal"
  >
    <template #default>
      <div
        class="message-container flex flex-col justify-center items-center p-6 w-full gap-y-2"
      >
        <div
          class="circle w-[56px] h-[56px] bg-red-50 rounded-full flex justify-center items-center"
        >
          <warning-icon />
        </div>
        <p class="text-[14px] text-center">
          Are you sure you want to delete this article
        </p>
      </div>
    </template>
    <template #actions>
      <app-button
        :disabled="deleteIsLoading"
        :loading="deleteIsLoading"
        class="!w-fit text-[14px] font-semibold"
        color="red"
        @click="handleDelete"
      >
        Delete
      </app-button>
      <app-button
        :disabled="deleteIsLoading"
        class="!w-fit"
        color="transparent"
        @click="closeDeleteModal"
      >
        Cancel
      </app-button>
    </template>
  </app-modal>
</template>

<script>
  import { onMounted, ref } from 'vue';
  import { useStore } from 'vuex';
  import { toast } from 'vue3-toastify';
  import axios from 'axios';

  import AppButton from '@/components/AppButton.vue';
  import AppLinkButton from '@/components/AppLinkButton.vue';
  import AppMenu from '@/components/AppMenu.vue';
  import AppModal from '@/components/AppModal.vue';
  import AppPagination from '@/components/AppPagination.vue';
  import AppWidget from '@/components/AppWidget.vue';

  import WarningIcon from '@/assets/icons/WarningIcon.vue';
  import DotsIcon from '@/assets/icons/DotsIcon.vue';

  export default {
    name: 'app-articles-view',
    components: {
      AppButton,
      AppLinkButton,
      AppMenu,
      AppPagination,
      AppWidget,
      AppModal,
      WarningIcon,
      DotsIcon,
    },
    setup() {
      const store = useStore();
      const articles = ref([]);
      const isLoading = ref(false);
      const deleteIsLoading = ref(false);
      const itemToDelete = ref('');
      const showDeleteModal = ref(false);
      const error = ref(null);
      const contextMenuItems = [
        {
          title: 'Edit',
          key: 'edit',
        },
        {
          title: 'Delete',
          key: 'delete',
        },
      ];

      async function fetchArticles() {
        try {
          isLoading.value = true;
          error.value = null;
          const response = await axios.get(
            `${store.getters.baseApi}/articles`,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Token ${store.getters.token}`,
              },
            }
          );
          articles.value = response.data.articles || response.data || [];
          return { success: true, data: response.data };
        } catch (error) {
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Network error occurred');
        } finally {
          isLoading.value = false;
        }
      }

      function handleDelete() {
        deleteIsLoading.value = true;
        try {
          const response = axios.delete(
            `${store.getters.baseApi}/articles/${itemToDelete.value}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Token ${store.getters.token}`,
              },
            }
          );
          toast.success('Article Deleted Successfully!');
          fetchArticles();
          closeDeleteModal();
          return { success: true, data: response.data };
        } catch (error) {
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Network error occurred');
        } finally {
          isLoading.value = false;
        }
      }

      function closeDeleteModal() {
        showDeleteModal.value = false;
        itemToDelete.value = '';
      }

      function setItemToDelete(item) {
        showDeleteModal.value = true;
        itemToDelete.value = item;
      }

      function formatDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }

      function formatBody(bodyString) {
        return bodyString.split(' ').slice(0, 20).join(' ');
      }

      onMounted(() => {
        fetchArticles();
      });
      return {
        articles,
        isLoading,
        error,
        deleteIsLoading,
        contextMenuItems,
        showDeleteModal,
        formatBody,
        formatDate,
        handleDelete,
        setItemToDelete,
        closeDeleteModal,
      };
    },
  };
</script>

<style scoped>
  th {
    @apply text-[18px] font-semibold px-[18px] text-start;
  }

  .table-container {
    overflow-x: auto;
  }

  .title-cell {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title-cell strong.truncate {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }
</style>
