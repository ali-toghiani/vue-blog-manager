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

  import { computed, onMounted, onUpdated, ref, watch, getCurrentInstance } from 'vue';

  export default {
    name: 'app-article-tags-view',
    components: {
      AppFormField,
      AppCheckbox,
    },
    props: {
      initialTags: {
        type: Array,
        default: () => [],
        validator: (arr) => arr.every((item) => typeof item === 'string'),
      },
      isEditing: {
        type: Boolean,
        default: false,
      },
    },

    setup(props, context) {
      const { appContext } = getCurrentInstance();
      const $http = appContext.config.globalProperties.$http;

      const isLoading = ref(false);

      const newTag = ref('');
      const tagError = ref('');
      const tagList = ref([]);
      const selectedTags = ref([]);

      const sortedTags = computed(() => {
        return [...tagList.value].sort();
      });


      // Emit Selected Tags to parent
      watch(
        selectedTags,
        (newTags) => {
          context.emit('update:selectedTags', newTags);
        },
        { deep: true }
      );

      // Update selected tags in Edit mode
      watch(props.initialTags, () => {
        tagList.value = [...props.initialTags];
        selectedTags.value = [...props.initialTags];
      });

      onMounted(() => {
        if (!props.isEditing && props.initialTags.length === 0) {
          fetchTags();
        }
      });

      onUpdated(() => {
        if (tagList.value.length == 0 && props.initialTags.length > 0) {
          tagList.value = [...props.initialTags];
          selectedTags.value = [...props.initialTags];
        }
      });

      const updateTag = (tag, isChecked) => {
        if (isChecked) {
          selectedTags.value = [...selectedTags.value, tag];
        } else {
          selectedTags.value = selectedTags.value.filter((t) => t !== tag);
        }
      };

      async function fetchTags() {
        try {
          isLoading.value = true;
          const response = await $http.get(`/tags`);
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

      return {
        newTag,
        tagError,
        tagList,
        selectedTags,
        sortedTags,
        addNewTag,
        resetError,
        updateTag,
      };
    },
  };
</script>
