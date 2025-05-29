<template>
  <div class="login-container w-full h-[100vh] bg-neutral-300 flex justify-center items-center">
    <div class="formcontainer bg-neutral-100 flex flex-col items-start w-full max-w-[480px] rounded-[10px]">
        <h2 class="text-[18px] font-semibold px-[24px] py-[38px]">Sign in</h2>

        <form class="w-full p-[24px] border-t" action="">
          <app-form-field id="email" label="Email" error="Invalid email address">
            <input type="email" id="email" placeholder="sample text"/>
          </app-form-field>

          <app-form-field id="password" label="Password" error="Required Field">
            <input type="password" id="password" placeholder="sample text"/>
          </app-form-field>

          <app-button class="mt-[24px]">Sign in</app-button>
          <div class="link-container flex gap-x-[8px] pt-[12px] justify-center">
            <p class="text-[14px] font-normal">Don't have an account?</p>
            <app-link-button class="inline text-[14px] font-semibold">Sign up now</app-link-button>
          </div>
        </form>
      </div>
  </div>
</template> 

<script>
import AppButton from '@/components/AppButton.vue';
import AppFormField from '@/components/AppFormField.vue';
import AppLinkButton from '@/components/AppLinkButton.vue';

export default {
  components: {
    AppFormField,
    AppButton,
    AppLinkButton
  }
}
</script>