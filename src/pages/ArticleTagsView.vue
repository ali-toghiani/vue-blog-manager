<template>
  <section class="tags-container border bg-white rounded-lg p-6">
    <form
      class="mb-4"
      @submit.prevent
    >
      <app-form-field
        id="tag"
        label="Tags"
        :error="tagError"
      >
        <input
          @keyup="resetError"
          @keyup.enter="addNewTag"
          class="text-[14px]"
          type="text"
          id="tag"
          placeholder="New tag"
          v-model="newTag"
        />
      </app-form-field>
    </form>

    <ul class="tag-list border rounded-lg p-4">
      <li
        v-for="(tag, index) in sortedTags"
        :key="tag"
        class="flex gap-x-1 mb-2"
      >
        <app-checkbox
          :id="'tag' + index"
          :value="tag"
          :label="tag"
          :model-value="selectedTags.includes(tag)"
          @update:modelValue="updateTag(tag, $event)"
        />
      </li>
    </ul>
  </section>
</template>

<script>
  import AppCheckbox from '@/components/AppCheckbox.vue';
  import AppFormField from '@/components/AppFormField.vue';

  import axios from 'axios';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useStore } from 'vuex';

  export default {
    name: 'app-article-tags-view',
    components: {
      AppFormField,
      AppCheckbox,
    },
    
    setup(props, context) {
      const isLoading = ref(false);
      const store = useStore();

      const newTag = ref('');
      const tagError = ref('');
      const tagList = ref([]);
      const sortedTags = computed(() => {
        return [...tagList.value].sort();
      });
      const selectedTags = ref([]);

      const updateTag = (tag, isChecked) => {
        if (isChecked) {
          selectedTags.value = [...selectedTags.value, tag];
        } else {
          selectedTags.value = selectedTags.value.filter((t) => t !== tag);
        }
      };


      watch(
        selectedTags,
        (newTags) => {
          context.emit('update:selectedTags', newTags);
        },
        { deep: true }
      );

      async function fetchTags() {
        try {
          isLoading.value = true;
          const response = await axios.get(`${store.getters.baseApi}/tags`, {
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              Authorization: `Token ${store.getters.token}`,
            },
          });
          tagList.value = response.data.tags;
          return { success: true, response: response.data };
        } catch (error) {
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Network error occurred');
        } finally {
          isLoading.value = false;
        }
      }

      function resetError() {
        tagError.value = '';
      }

      function addNewTag(event) {
        resetError();
        const tag = event.target.value;
        if (!tag) {
          tagError.value = 'Value is required!';
          return;
        }
        if (tagList.value.includes(tag)) {
          tagError.value = 'Tag Already Exists!';
          return;
        } else {
          tagList.value = [tag, ...tagList.value];
          selectedTags.value = [tag, ...selectedTags.value];
          newTag.value = '';
        }
      }

      onMounted(() => {
        fetchTags();
      });
      return {
        newTag,
        tagError,
        tagList,
        selectedTags,
        sortedTags,
        addNewTag,
        resetError,
        updateTag
      };
    },
  };
</script>
