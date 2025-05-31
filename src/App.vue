<template>
  <router-view />
</template>

<style lang="scss">
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  * {
    box-sizing: border-box;
  }

  nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .Toastify__toast {
    &-container {
      background-color: transparent !important;
      width: fit-content !important;
      border-radius: 12px !important;
    }
    &--success {
      background: #e3f6e9 !important;
      color: #17b24a !important;
    }
    &--error {
      background: #FAE4E4 !important;
      color: #D61E20 !important;
    }
  }
</style>
