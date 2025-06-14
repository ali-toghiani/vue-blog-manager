<template>
  <div>
    <!-- Hamburger button  -->
    <button
      v-if="!isOpen"
      class="md:hidden p-4 fixed top-0 left-0 z-30"
      @click="isOpen = !isOpen"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    </button>

    <!-- Sidebar -->
    <aside
      :class="[
        'h-[100dvh] border md:min-w-[240px] transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
      class="fixed top-0 left-0 z-20 bg-white w-64 md:static"
    >
      <nav class="p-4 text-start">
        <div class="flex justify-between items-center mb-4">
          <div class="welcome text-[14px] font-normal block md:hidden">
            welcome
            <strong class="font-semibold">
              {{ userName }}
            </strong>
          </div>
          <button
            class="md:hidden p-2"
            @click="isOpen = false"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ul>
          <li
            class="flex w-full"
            v-for="item in sidebarItems"
            :key="item.title"
          >
            <router-link
              :to="item.link"
              :class="['w-full mb-1 p-2 text-[16px] text-semibold', item.names.includes(currentPath) ? 'active-link' : '']"
              @click="isOpen = false"
            >
              {{ item.title }}
            </router-link>
          </li>
        </ul>
      </nav>

      <div
        class="h-[40px] md:hidden max-w-[220px] mx-auto border border-red-100 bg-red-50 text-red-500 text-start flex justify-center items-center rounded-sm"
        color="red"
        @click="handleLogout"
      >
        Log out
      </div>
    </aside>

    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';

  export default {
    name: 'app-sidebar',
    components: {},
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const currentPath = ref('');
      const userName = ref(store.getters.userName);
      const sidebarItems = ref([
        {
          title: 'All Articles',
          link: '/articles',
          names: ['Articles', 'ArticlesPaginated']
        },
        {
          title: 'New Article',
          link: '/articles/create',
          names: ['Create']
        },
      ]);

      const isOpen = ref(false);

      function handleLogout() {
        store.commit('clearUser');
      }

      onMounted(()=>{
        // Set currentPath initially
        currentPath.value = router.currentRoute.value.name;

        // Update currentPath after changes
        router.afterEach((to)=>{
        currentPath.value = to.name;
      })
      })

      return {
        sidebarItems,
        isOpen,
        userName,
        currentPath,
        handleLogout
      };
    },
  };
</script>

<style scoped>
  .active-link {
    @apply text-green-300 bg-green-50;
  }

  aside {
    z-index: 20;
  }

  .transition-transform {
    transition-property: transform;
  }

  body:has(.translate-x-0) {
    @media (max-width: 767px) {
      overflow: hidden;
    }
  }
</style>
