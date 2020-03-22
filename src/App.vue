<template>
  <main id="ratel-app">
    <Navbar v-show="$route.name !== 'login'"/>
    <router-view></router-view>
  </main>
</template>

<script>
  import { mapActions } from 'vuex'
  import Navbar from './components/Navbar.vue'
  import axios from 'axios'
  import Cookies from 'js-cookie'

  export default {
    components: { Navbar },

    created() {
      let _this = this;

      axios.interceptors.request.use((config) => {
        config.url = `https://ratel-app.herokuapp.com/api/v1${config.url}`;
        config.headers.common.Authorization = `Bearer ${this.cookies().get('session_token')}`
        return config
      }, error => Promise.reject(error));

      axios.interceptors.response.use(response => response, error => {
        if(error.response.status === 401) _this.$router.push('/login');
        return Promise.reject(error);
      });
    },

    mounted() {
      this.fetchCards();
    },

    methods: {
      ...mapActions(['fetchCards']),

      cookies() {
        return Cookies
      }
    }
  }
</script>

<style>
</style>
