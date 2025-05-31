<template>
  <section class="new-article-divider grid grid-cols-[2fr_1fr] gap-x-6 w-full">
    <app-widget title="New Article">
      <form class="p-6">
        <app-form-field
          class="mb-3"
          id="title"
          label="Title"
        >
          <input
            class="text-[14px]"
            type="text"
            id="title"
            placeholder="Title"
            v-model="tag"
          />
        </app-form-field>

        <app-form-field
          class="mb-3"
          id="description"
          label="Description"
        >
          <input
            class="text-[14px]"
            type="text"
            id="description"
            placeholder="Description"
            v-model="tag"
          />
        </app-form-field>

        <app-form-field
          class="mb-3"
          id="body"
          label="Body"
        >
          <textarea
            class="text-[14px] w-full border bg-white rounded-lg p-2"
            rows="5"
            type="text"
            id="body"
            placeholder="Body"
            v-model="tag"
          ></textarea>
        </app-form-field>

        <app-button class="!w-fit mt-2">Submit</app-button>
      </form>
    </app-widget>
    <section class="tags-container border bg-white rounded-lg p-6">
      <form class="mb-4">
        <app-form-field
          id="tag"
          label="Tags"
        >
          <input
            class="text-[14px]"
            type="text"
            id="tag"
            placeholder="New tag"
            v-model="tag"
          />
        </app-form-field>
      </form>

      <ul class="tag-list border rounded-lg p-4">
        <li
          v-for="(tag, index) in tags"
          :key="tag"
          class="flex gap-x-1 mb-2"
        >
          <input
            type="checkbox"
            :value="tag"
            :name="tag"
            :id="'tag' + index"
          />
          <label :for="'tag' + index">{{ tag }}</label>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
  import AppButton from '@/components/AppButton.vue';
  import AppFormField from '@/components/AppFormField.vue';
  import AppWidget from '@/components/AppWidget.vue';
  import { ref } from 'vue';

  export default {
    name: 'app-article-create-view',
    components: {
      AppWidget,
      AppFormField,
      AppButton,
    },
    setup() {
      const tag = ref('');
      const tags = ref(['Tag', 'Tag', 'Tag']);

      return {
        tag,
        tags,
      };
    },
  };
</script>
