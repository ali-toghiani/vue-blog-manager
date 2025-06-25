<template>
  <section
    class="new-article-divider w-full flex flex-col justify-center p-4 md:p-0 gap-y-4 gap-x-6 md:grid md:grid-cols-[2fr_1fr]"
  >
    <app-widget :title="isEditing ? 'Edit Article' : 'Create Article'">
      <form
        class="p-6"
        @submit.prevent="submitForm"
      >
        <app-form-field
          class="mb-3"
          id="title"
          label="Title"
          :error="errors.title"
        >
          <input
            class="text-[14px]"
            type="text"
            id="title"
            :disabled="isEditing"
            placeholder="Title"
            v-model="form.title"
            @blur="validateForm"
          />
        </app-form-field>

        <app-form-field
          class="mb-3"
          id="description"
          label="Description"
          :error="errors.description"
        >
          <input
            class="text-[14px]"
            type="text"
            id="description"
            :disabled="isLoading"
            placeholder="Description"
            v-model="form.description"
            @blur="validateForm"
          />
        </app-form-field>

        <app-form-field
          class="mb-3"
          id="body"
          label="Body"
          :error="errors.body"
        >
          <textarea
            class="text-[14px] w-full border bg-white rounded-lg p-2"
            rows="5"
            type="text"
            id="body"
            :disabled="isLoading"
            v-model="form.body"
            @blur="validateForm"
          ></textarea>
        </app-form-field>

        <app-button
          class="!w-fit mt-2"
          :loading="isLoading"
          :disabled="isLoading"
        >
          {{ isEditing ? 'Save Changes' : 'Submit' }}
        </app-button>
      </form>
    </app-widget>

    <app-article-tags-view
      :initialTags="initialTags"
      :isEditing="isEditing"
      @update:selectedTags="updateSelectedTags"
    ></app-article-tags-view>
  </section>
</template>

<script>
  import { reactive, ref, onMounted, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue3-toastify';

  import AppButton from '@/components/AppButton.vue';
  import AppFormField from '@/components/AppFormField.vue';
  import AppWidget from '@/components/AppWidget.vue';
  import AppArticleTagsView from '@/pages/ArticleTagsView.vue';

  export default {
    components: {
      AppWidget,
      AppFormField,
      AppButton,
      AppArticleTagsView,
    },
    props: {
      isEditing: {
        type: Boolean,
      },
      slug: {
        type: String,
      },
    },
    setup(props) {
      const { appContext } = getCurrentInstance();
      const $http = appContext.config.globalProperties.$http;
      const router = useRouter();

      const isLoading = ref(false);

      const form = reactive({
        title: '',
        description: '',
        body: '',
        tagList: [],
      });
      const errors = reactive({
        title: '',
        description: '',
        body: '',
        tagList: [],
      });
      const initialTags = ref([]);

      function updateSelectedTags(tags) {
        form.tagList = tags;
      }

      onMounted(() => {
        if (props.slug) {
          fetchArticle(props.slug);
        }
      });

      async function fetchArticle(slug) {
        isLoading.value = true;
        try {
          const response = await $http.get(`/articles/${slug}`);

          Object.assign(form, response.data.article);
          initialTags.value = [...response.data.article.tagList];
          return { success: true, data: response.data };
        } catch (error) {
          console.error('Fetching Article By Slug Failed');
        } finally {
          isLoading.value = false;
        }
      }
      const validateForm = () => {
        let isValid = true;
        errors.title = '';
        errors.description = '';
        errors.body = '';

        if (!form.title) {
          errors.title = 'Title is required!';
          isValid = false;
        }
        if (!form.description) {
          errors.description = 'Description is required!';
          isValid = false;
        }
        if (!form.body) {
          errors.body = 'Body is required!';
          isValid = false;
        }
        return isValid;
      };

      async function editArticle(slug) {
        try {
          isLoading.value = true;
          const response = await $http.put(`/articles/${slug}`, {
            article: form,
          });

          toast.success('Article Edited Successfully!');
          resetForm();
          router.push('/articles');
          return { success: true, data: response.data };
        } catch (error) {
          toast.error(error.response.data.message);
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Network error occurred');
        } finally {
          isLoading.value = false;
        }
      }

      async function submitForm() {
        if (!validateForm()) return;

        if (props.slug) {
          editArticle(props.slug);
          return;
        }
        try {
          isLoading.value = true;
          const response = await $http.post(`/articles`, { article: form });
          toast.success('Article Created Successfully!');
          resetForm();
          router.push('/articles');
          return { success: true, data: response.data };
        } catch (error) {
          toast.error(error.response.data.message);
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Network error occurred');
        } finally {
          isLoading.value = false;
        }
      }

      function resetForm() {
        Object.assign(form, {
          title: '',
          description: '',
          body: '',
          tagList: [],
        });
        Object.assign(errors, {
          title: '',
          description: '',
          body: '',
        });
      }

      return {
        form,
        errors,
        isLoading,
        submitForm,
        validateForm,
        updateSelectedTags,
        initialTags,
      };
    },
  };
</script>
