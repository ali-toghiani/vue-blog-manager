<template>
  <app-widget
    class="m-4 md:m-0"
    title="All Posts"
  >
    <div class="table-container p-6 flex flex-col items-end overflow-x-auto">

      <!-- Desktop table -->
      <app-table
        :list="paginatedArticles"
        :headers="['#', 'Title', 'Author', 'Tags', 'Excerpt', 'Created', '']"
        #default="slotProps"
        :loading="isLoading"
      >
        <td>
          <div
            class="order-container rounded-sm bg-gray-100 w-[32px] h-[32px] ms-1 flex justify-center items-center"
          >
            {{ (+pageId -1)*articlePageSize  + slotProps.index + 1 }}
          </div>
        </td>
        <td class="title-cell">
          <strong class="truncate">{{ slotProps.row.title }}</strong>
        </td>
        <td class="whitespace-nowrap">
          {{ slotProps.row.author.username }}
        </td>
        <td>
          <app-link-button
            v-for="tag in slotProps.row.tagList"
            :key="tag"
            :path="'/articles?=' + tag"
          >
            #{{ tag }}
          </app-link-button>
        </td>
        <td>
          {{ formatBody(slotProps.row.body) }}
        </td>
        <td class=" whitespace-nowrap">{{ formatDate(slotProps.row.createdAt) }}</td>
        <td>
          <div class="dropdown">
            <app-button
              color="transparent"
              class="!w-[40px] !h-[40px] !p-[10px]"
            >
              <dots-icon />
            </app-button>
            <app-menu
              @select="handleMenuClick($event, slotProps.row.slug)"
              class="dropdown-content"
              :items="contextMenuItems"
            ></app-menu>
          </div>
        </td>
      </app-table>

      <!-- Mobile table -->
      <div class="md:hidden space-y-4 p-4">
        <div
          v-for="(article, index) in paginatedArticles"
          :key="index"
          class="border rounded-lg p-4 bg-white shadow-sm"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center space-x-2">
              <div
                class="order-container rounded-sm bg-gray-100 w-[32px] h-[32px] flex justify-center items-center"
              >
                {{ index + 1 }}
              </div>
              <strong
                class="font-semibold title-cell truncate"
                :title="article.title || 'No title'"
              >
                {{ article.title }}
              </strong>
            </div>
            <div class="dropdown">
              <app-button
                color="transparent"
                class="!w-[32px] !h-[32px] !p-[6px]"
              >
                <dots-icon />
              </app-button>
              <app-menu
                @select="handleMenuClick($event, article.slug)"
                class="dropdown-content"
                :items="contextMenuItems"
              ></app-menu>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            <p>
              <span class="font-medium">Author:</span>
              {{ article.author.username }}
            </p>
            <p>
              <span class="font-medium">Created:</span>
              {{ formatDate(article.createdAt) }}
            </p>
            <div class="mt-1">
              <span class="font-medium">Tags:</span>
              <app-link-button
                v-for="tag in article.tagList"
                :key="tag"
                :path="'/articles?=' + tag"
                class="inline-block mr-1"
              >
                #{{ tag }}
              </app-link-button>
            </div>
            <p class="mt-1">
              <span class="font-medium">Excerpt:</span>
              {{ formatBody(article.body) }}
            </p>
          </div>
        </div>
      </div>

      <app-pagination
        v-if="articlesCount > articlePageSize"
        class="mt-6"
        @pageChanged="handlePageChange"
        :page-size="articlePageSize"
        :total="articlesCount"
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
  import { computed, onMounted, ref, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue3-toastify';

  import AppButton from '@/components/AppButton.vue';
  import AppLinkButton from '@/components/AppLinkButton.vue';
  import AppMenu from '@/components/AppMenu.vue';
  import AppModal from '@/components/AppModal.vue';
  import AppPagination from '@/components/AppPagination.vue';
  import AppWidget from '@/components/AppWidget.vue';
  import AppTable from '@/components/AppTable.vue';

  import WarningIcon from '@/assets/icons/WarningIcon.vue';
  import DotsIcon from '@/assets/icons/DotsIcon.vue';

  export default {
    name: 'app-articles-view',
    props: {
      pageId: {
        type: String,
        default: '1',
      },
    },
    components: {
      AppButton,
      AppLinkButton,
      AppMenu,
      AppPagination,
      AppWidget,
      AppModal,
      AppTable,
      WarningIcon,
      DotsIcon,
    },
    setup(props) {
      const { appContext } = getCurrentInstance();
      const $http = appContext.config.globalProperties.$http;

      const router = useRouter();

      const currentPage = computed(() => {
        return Math.max(
          1,
          Math.min(
            +(props.pageId) || 1,
            Math.ceil(articlesCount.value / articlePageSize.value)
          )
        );
      });

      const paginatedArticles = computed(() => {
        const start = (currentPage.value - 1) * articlePageSize.value;
        const end = start + articlePageSize.value;
        return articles.value.slice(start, end);
      });
      const articles = ref([]);
      const articlesCount = ref(10);
      const articlePageSize = ref(5);

      const isLoading = ref(false);
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

      const deleteIsLoading = ref(false);
      const itemToDelete = ref('');
      const showDeleteModal = ref(false);

      async function fetchArticles() {
        try {
          isLoading.value = true;
          error.value = null;
          const response = await $http.get(`/articles`);

          articles.value = response.data.articles || response.data || [];
          articlesCount.value = response.data.articlesCount;
          return { success: true, data: response.data };
        } catch (error) {
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Fetching Articles Failed');
        } finally {
          isLoading.value = false;
        }
      }

      function handleDelete() {
        deleteIsLoading.value = true;
        try {
          const response = $http.delete(`/articles/${itemToDelete.value}`);
          toast.success('Article Deleted Successfully!');
          fetchArticles();
          closeDeleteModal();
          return { success: true, data: response.data };
        } catch (error) {
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Article Deletion Failed');
        } finally {
          isLoading.value = false;
        }
      }

      function closeDeleteModal() {
        showDeleteModal.value = false;
        itemToDelete.value = '';
      }

      function handlePageChange(page) {
        if (page == '1') {
          router.push('/articles');
        } else {
          router.push(`/articles/page/${page}`);
        }
      }

      function setItemToDelete(item) {
        showDeleteModal.value = true;
        itemToDelete.value = item;
      }

      function handleMenuClick(event, slug) {
        switch (event) {
          case 'edit':
            {
              redirectToEdit(slug);
            }
            break;
          case 'delete':
            {
              setItemToDelete(slug);
            }
            break;
        }
      }

      function redirectToEdit(slug) {
        router.push(`/articles/edit/${slug}`);
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
        articlesCount,
        handlePageChange,
        paginatedArticles,
        articlePageSize,
        handleMenuClick,
      };
    },
  };
</script>

<style scoped>
  .title-cell {
    @apply max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap;
  }

  .title-cell strong.truncate {
    @apply block overflow-hidden text-ellipsis whitespace-nowrap;
  }

  .dropdown {
    @apply relative inline-block;
  }

  .dropdown:hover .dropdown-content {
    @apply block;
  }
</style>
