<template>
  <div
    class="register-container w-full h-[100vh] bg-neutral-300 flex justify-center items-center"
  >
    <div
      class="formcontainer bg-neutral-100 flex flex-col items-start w-full max-w-[480px] rounded-[10px]"
    >
      <h2 class="text-[18px] font-semibold px-[24px] py-[38px]">Sign up</h2>

      <form
        class="w-full p-[24px] border-t"
        @submit.prevent="submitForm"
      >
        <app-form-field
          id="username"
          label="Username"
          :error="errors.username"
        >
          <input
            type="text"
            id="username"
            placeholder="sample text"
            v-model="form.username"
          />
        </app-form-field>

        <app-form-field
          id="email"
          label="Email"
          :error="errors.email"
        >
          <input
            type="email"
            id="email"
            placeholder="sample text"
            v-model="form.email"
          />
        </app-form-field>

        <app-form-field
          id="password"
          label="Password"
          :error="errors.password"
        >
          <input
            type="password"
            id="password"
            placeholder="sample text"
            v-model="form.password"
          />
        </app-form-field>

        <app-button
          class="mt-[24px]"
          :loading="isLoading"
        >
          Sign up
        </app-button>
        <div class="link-container flex gap-x-[8px] pt-[12px] justify-center">
          <p class="text-[14px] font-normal">Have an account?</p>
          <app-link-button
            class="inline text-[14px] font-semibold"
            path="/login"
          >
            Sign in
          </app-link-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { reactive, ref, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';

  import AppButton from '@/components/AppButton.vue';
  import AppFormField from '@/components/AppFormField.vue';
  import AppLinkButton from '@/components/AppLinkButton.vue';

  export default {
    name: 'app-register-view',
    components: {
      AppFormField,
      AppButton,
      AppLinkButton,
    },
    setup() {
      const { appContext } = getCurrentInstance();
      const $http = appContext.config.globalProperties.$http;

      const store = useStore();
      const router = useRouter();
      const isLoading = ref(false);

      const form = reactive({
        username: '',
        email: '',
        password: '',
      });
      const errors = reactive({
        username: '',
        email: '',
        password: '',
      });

      const validateForm = () => {
        let isValid = true;
        errors.username = '';
        errors.email = '';
        errors.password = '';

        if (!form.username) {
          errors.username = 'Username is required!';
          isValid = false;
        }
        if (!form.email) {
          errors.email = 'Email is required!';
          isValid = false;
        }
        if (!form.password) {
          errors.password = 'Password is required!';
          isValid = false;
        }
        return isValid;
      };

      async function registerUser(body) {
        try {
          const response = await $http.post(`/users`, { user: body });
          
          return { success: true, data: response.data };
        } catch (error) {
          if (error.response) {
            return { success: false, errors: error.response.data.errors || {} };
          }
          throw new Error('Network error occurred');
        }
      }

      async function submitForm() {
        if (!validateForm()) return;
        isLoading.value = true;

        try {
          const response = await registerUser(form);
          if (response.success) {
            store.commit('setUser', response.data.user);
            router.push('/articles');
          } else {
            Object.assign(errors, response.errors);
          }
        } catch (error) {
          console.error('Registration failed:', error.message);
        } finally {
          isLoading.value = false;
        }
      }

      return {
        form,
        errors,
        isLoading,
        submitForm,
      };
    },
  };
</script>
