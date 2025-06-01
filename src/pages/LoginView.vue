<template>
  <div
    class="login-container w-full h-[100vh] bg-neutral-300 flex justify-center items-center"
  >
    <div
      class="formcontainer bg-neutral-100 flex flex-col items-start w-full max-w-[480px] rounded-[10px]"
    >
      <h2 class="text-[18px] font-semibold px-[24px] py-[38px]">Sign in</h2>

      <form
        class="w-full p-[24px] border-t"
        @submit.prevent="submitForm"
      >
        <app-form-field
          id="email"
          label="Email"
          :error="errors.email"
          @blur="validateForm"
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
            @blur="validateForm"
          />
        </app-form-field>

        <app-button
          class="mt-[24px]"
          :loading="isLoading"
        >
          Sign in
        </app-button>
        <div class="link-container flex gap-x-[8px] pt-[12px] justify-center">
          <p class="text-[14px] font-normal">Don't have an account?</p>
          <app-link-button
            class="inline text-[14px] font-semibold"
            path="/register"
          >
            Sign up now
          </app-link-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { toast } from 'vue3-toastify';
  import axios from 'axios';

  import AppButton from '@/components/AppButton.vue';
  import AppFormField from '@/components/AppFormField.vue';
  import AppLinkButton from '@/components/AppLinkButton.vue';

  export default {
    name: 'app-login-view',
    components: {
      AppFormField,
      AppButton,
      AppLinkButton,
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const isLoading = ref(false);

      const form = reactive({
        email: '',
        password: '',
      });
      const errors = reactive({
        email: '',
        password: '',
      });

      const validateForm = () => {
        let isValid = true;
        errors.email = '';
        errors.password = '';

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

      async function loginUser(body) {
        try {
          const response = await axios.post(
            `${store.getters.baseApi}/users/login`,
            {
              user: body,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              },
            }
          );
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
          const response = await loginUser(form);
          if (response.success) {
            const { user } = response.data;
            store.commit('setUser', user);
            toast.success(`Welcome ${user.username}`);
            router.push('/articles');
          } else {
            toast.error('Email or Password is Invalid');
            Object.assign(errors, response.errors);
          }
        } catch (error) {
          console.error('Login failed:', error.message);
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
