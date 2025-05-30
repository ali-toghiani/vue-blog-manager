<template>
  <main class="bg-white rounded-md h-full">
    <h2 class="text-start text-[18px] font-semibold ps-6 py-[38px]">
      All Posts
    </h2>
    <hr />

    <div class="table-container p-6">
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
          <tr class="h-[48px] border-b" v-for="(article, index) in articles" :key="index">
            <td>
              <div class="order-container rounded-sm bg-gray-100 w-[32px] h-[32px] ms-1
                       flex justify-center items-center">
                {{ index + 1 }}
              </div>
            </td>
            <td class="title-cell" :title="article.title || 'No title'">
              <strong class="truncate">{{ article.title }}</strong>
            </td>
            <td>
              {{ article.author.username }}
            </td>
            <td>
              <app-link-button v-for="tag in article.tagList" :key="tag" :path="'/articles?=' + tag">
                #{{ tag }}
              </app-link-button>
            </td>
            <td>
              {{ formatBody(article.body) }}
            </td>
            <td>{{ formatDate(article.createdAt) }}</td>
            <td>
              <app-button color="transparent" class="!w-[40px] !h-[40px] !p-[10px]">
                <dots-icon />
              </app-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import DotsIcon from '@/assets/icons/DotsIcon.vue';
import AppButton from '@/components/AppButton.vue';
import AppLinkButton from '@/components/AppLinkButton.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'app-articles-view',
  components: {
    AppButton,
    AppLinkButton,
    DotsIcon,
  },
  setup() {
    const store = useStore();
    const articles = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

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
      return bodyString.split(' ').slice(0, 20).join(' ')
    }

    onMounted(() => {
      fetchArticles();
    });
    return {
      articles,
      isLoading,
      error,
      formatDate,
      formatBody
    }
  },
};
</script>

<style scoped>
th {
  @apply text-[18px] font-semibold px-[18px];
}

.table-container {
  overflow-x: auto;
}

.title-cell {
  max-width: 200px;
  /* Adjust based on your design */
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
</style>
