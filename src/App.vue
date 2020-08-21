<template>
  <main id="ratel-app">
    <Navbar v-if="$route.name !== 'login'"/>
    <router-view></router-view>
  </main>
</template>

<script>
  import Navbar from './components/Navbar.vue'
  import axios from 'axios'
  import Cookies from 'js-cookie'

  export default {
    components: { Navbar },

    created() {
      let _this = this;
      const host = process.env.NODE_ENV === 'development' ? 'http://localhost:4567' : 'https://ratel-app.herokuapp.com';

      axios.interceptors.request.use((config) => {
        config.url = `${host}/api/v1${config.url}`;
        config.headers.common.Authorization = `Bearer ${this.cookies().get('session_token')}`
        return config
      }, error => Promise.reject(error));

      axios.interceptors.response.use(response => response, error => {
        if(error.response.status === 401) _this.$router.push('/login');
        if(Array.isArray(error.response.data.message)) {
         this.$bvToast.toast(error.response.data.message.join('\n'), {title: 'Error', variant: 'danger'});
        }
        return Promise.reject(error);
      });
    },

    methods: {
      cookies() {
        return Cookies
      }
    }
  }
</script>

<style>
</style>
