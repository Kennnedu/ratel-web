<template>
  <main id="ratel-app">
    <router-view></router-view>
  </main>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import axios from 'axios'
  import debounce from 'lodash.debounce'
  import Cookies from 'js-cookie'

  export default {
    computed: {
      ...mapState(['filter'])
    },

    created() {
      let _this = this;

      axios.interceptors.request.use((config) => {
        config.url = `http://192.168.1.6:4567/api/v1${config.url}`;
        config.headers.common.Authorization = `Bearer ${this.cookies().get('session_token')}`
        return config
      }, error => Promise.reject(error));

      axios.interceptors.response.use(response => response, error => {
        if(error.response.status === 401) _this.$router.push('/login');
        return Promise.reject(error);
      });
    },

    mounted() {
      this.fetchRecords();
      this.fetchCards();
      this.debouncedFetchRecords = debounce(this.fetchRecords, 500);
    },

    watch: {
      filter: {
        handler: function(){
          this.debouncedFetchRecords()
        },
        deep: true
      }
    },

    methods: {
      ...mapActions(['fetchRecords', 'fetchCards']),

      cookies() {
        return Cookies
      }
    }
  }
</script>

<style>
</style>
