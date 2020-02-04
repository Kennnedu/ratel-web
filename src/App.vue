<template>
  <main id="ratel-app">
    <Header v-if="logged" />
    <Login v-if="!logged" v-on:login="logged = true" />
    <Records v-else-if="currentPage === 'Records'" v-on:navigateTo="navigateTo"/>
    <GroupedBy v-else-if="currentPage === 'Dashboard'" v-on:navigateTo="navigateTo" />
  </main>
</template>

<script>
  import Records from './components/Records.vue'
  import GroupedBy from './components/GroupedBy.vue'
  import Header from './components/Header.vue'
  import Login from './components/Login.vue'
  import { mapState, mapActions } from 'vuex'
  import axios from 'axios'
  import _ from 'lodash'
  import Cookies from 'js-cookie'

  export default {
    components: {
      Records,
      GroupedBy,
      Login,
      Header
    },

    data: function(){
      return {
        currentPage: 'Records',
        logged: true
      }
    },

    computed: {
      ...mapState(['filter'])
    },

    created() {
      let _this = this;

      axios.interceptors.request.use((config) => {
        config.url = `https://ratel-app.herokuapp.com/api/v1${config.url}`;
        config.headers.common.Authorization = `Bearer ${this.cookies().get('session_token')}`
        return config
      }, error => Promise.reject(error));

      axios.interceptors.response.use(response => response, error => {
        if(error.response.status === 401) _this.logged = false;
        return Promise.reject(error);
      });
    },

    mounted() {
      this.debouncedFetchRecords = _.debounce(this.fetchRecords, 500);
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
      ...mapActions(['fetchRecords']),

      navigateTo: function(page){
        this.currentPage = page
      },

      cookies() {
        return Cookies
      }
    }
  }
</script>

<style lang="css">
  .button-error {
    background: rgb(202, 60, 60);
    color: white;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }
</style>
