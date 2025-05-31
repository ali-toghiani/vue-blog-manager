<template>
  <section class="new-article-divider grid grid-cols-[2fr_1fr] gap-x-6 w-full">
    <app-widget title="New Article">
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
            v-model="form.body"
            @blur="validateForm"
          ></textarea>
        </app-form-field>

        <app-button
          class="!w-fit mt-2"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Submit
        </app-button>
      </form>
    </app-widget>

    <app-article-tags-view
      @update:selectedTags="handleSelectedTags"
    ></app-article-tags-view>
  </section>
</template>

<script>
  import AppButton from '@/components/AppButton.vue';
  import AppFormField from '@/components/AppFormField.vue';
  import AppWidget from '@/components/AppWidget.vue';
  import AppArticleTagsView from '@/pages/ArticleTagsView.vue';
  import axios from 'axios';
  import { reactive, ref } from 'vue';
  import { useStore } from 'vuex';
  import { toast } from 'vue3-toastify';
  export default {
    name: 'app-article-create-view',
    components: {
      AppWidget,
      AppFormField,
      AppButton,
      AppArticleTagsView,
    },
    setup() {
      const isLoading = ref(false);
      const store = useStore();

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

      function handleSelectedTags(tags) {
        form.tagList = tags;
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

      async function submitForm() {
        if (!validateForm()) return;
        try {
          isLoading.value = true;
          const response = await axios.post(
            `${store.getters.baseApi}/articles`,
            {
              article: form,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Token ${store.getters.token}`,
              },
            }
          );
          toast.success('Article Created Successfully!');
          resetForm();
          return { success: true, data: response.data };
        } catch (error) {
          toast.success('Article Creation Failed!');
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
        handleSelectedTags,
      };
    },
  };
</script>
