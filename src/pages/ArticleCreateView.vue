<template>
  <section class="new-article-divider grid grid-cols-[2fr_1fr] gap-x-6 w-full">
    <app-widget :title="isEditing ? 'Edit Article': 'Create Article'">
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
          {{isEditing ? 'Save Changes' : 'Submit'}}
        </app-button>
      </form>
    </app-widget>

    <app-article-tags-view :initialTags="initialTags" :isEditing="isEditing"
      @update:selectedTags="updateSelectedTags"
    ></app-article-tags-view>
  </section>
</template>

<script>
  import { reactive, ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { toast } from 'vue3-toastify';
  import axios from 'axios';

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
        type: Boolean
      },
      slug: {
        type: String
      }
    },
    setup(props) {
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
      const initialTags = ref([])

      function updateSelectedTags(tags) {
        form.tagList = tags;
      }

      onMounted(()=>{
        if (props.slug){
          fetchArticle(props.slug)
        }
      })

      async function fetchArticle(slug){
        isLoading.value = true;
        try{
          const response = await axios.get(`${store.getters.baseApi}/articles/${slug}`,{
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                Authorization: `Token ${store.getters.token}`,
              })
              Object.assign(form, response.data.article);
              initialTags.value = [...response.data.article.tagList];
              return {success: true, data: response.data};
        } catch(error){
          console.error("Fetching Article By Slug Failed");
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

      async function editArticle(slug){
        try {
          isLoading.value = true;
          const response = await axios.put(
            `${store.getters.baseApi}/articles/${slug}`,
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
          toast.success('Article Edited Successfully!');
          resetForm();
          return { success: true, data: response.data };
        } catch (error) {
          toast.success('Article Edit Failed!');
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

        if (props.slug){
          editArticle(props.slug);
          return;
        }
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
        updateSelectedTags,
        initialTags
      };
    },
  };
</script>
